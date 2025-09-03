import mongoose from "mongoose"
import User from "../model/user.model"
import type { Request, Response } from "express"


export const getAllUsers = async (req: Request, res: Response) => {
    const id = req.id as string;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid userId" })
    }
    try {
        // const users = await User.find({ _id: { $ne: id } }).select("-password")


        const users = await User.aggregate([
            { $match: { _id: { $ne: new mongoose.Types.ObjectId(id) } } },
            {
                $lookup: {
                    from: "messages",
                    as: "lastMessage",
                    let: { userId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $or: [
                                        {
                                            $and: [
                                                { $eq: ['$sender', "$$userId"] },
                                                { $eq: ['$receiver', new mongoose.Types.ObjectId(id)] }
                                            ]
                                        },
                                        {
                                            $and: [
                                                { $eq: ['$sender', new mongoose.Types.ObjectId(id)] },
                                                { $eq: ['$receiver', "$$userId"] }
                                            ]
                                        }
                                    ]
                                }
                            }
                        },
                        { $sort: { createdAt: -1 } },
                        { $limit: 1 },
                        { $project: { message: 1 } }
                    ]
                }
            },
            {
                $lookup: {
                    from: "messages",
                    as: "unseenMessage",
                    let: { userId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$sender", "$$userId"] },
                                        { $eq: ["$receiver", new mongoose.Types.ObjectId(id)] },
                                        { $not: { $in: [new mongoose.Types.ObjectId(id), "$seenBy"] } }
                                    ]
                                }
                            },
                        }, { $count: "unreadMessage" }
                    ]
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    avatar: 1,
                    lastSeen: 1,
                    lastMessage: { $arrayElemAt: ["$lastMessage.message", 0] },
                    unreadMessage: { $ifNull: [{ $arrayElemAt: ["$unseenMessage.unreadMessage", 0] }, 0] }

                }
            }
        ])

        return res.status(200).json(users)
    } catch (error) {
        if (error instanceof Error)
            console.log(error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}
export const getUserById = async (req: Request, res: Response) => {
    const { userId } = req.params
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid userId" })
    }
    try {
        const users = await User.findById(userId).select("-password").populate('groups')
        res.status(200).json(users)
    } catch (error) {
        if (error instanceof Error)
            console.log(error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const updateUser = async (req: Request, res: Response) => {
    const { userId } = req.params
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "UserId is not valid!" })
    }

    try {
        const user = await User.findByIdAndUpdate(userId, req.body)
        if (!user) {
            return res.status(400).json({ message: "UserId is not valid!" })
        }
        res.status(200).json({ user })
    } catch (error) {
        if (error instanceof Error)
            console.log(error.message)
        res.status(500).json({ message: "Internal server error!" })

    }
}




export const getAllUser = async (req: Request, res: Response) => {
    const id = req.id as string; // current user id

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid userId" });
    }

    try {
        const users = await User.aggregate([
            // exclude current user
            { $match: { _id: { $ne: new mongoose.Types.ObjectId(id) } } },

            // join last message
            {
                $lookup: {
                    from: "messages",
                    let: { userId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $or: [
                                        {
                                            $and: [
                                                { $eq: ["$sender", "$$userId"] },
                                                { $eq: ["$receiver", new mongoose.Types.ObjectId(id)] },
                                            ],
                                        },
                                        {
                                            $and: [
                                                { $eq: ["$sender", new mongoose.Types.ObjectId(id)] },
                                                { $eq: ["$receiver", "$$userId"] },
                                            ],
                                        },
                                    ],
                                },
                            },
                        },
                        { $sort: { createdAt: -1 } },
                        { $limit: 1 },
                        { $project: { text: 1, createdAt: 1 } }, // 👈 only keep text + createdAt
                    ],
                    as: "lastMessage",
                },
            },

            // join unread count
            {
                $lookup: {
                    from: "messages",
                    let: { userId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$sender", "$$userId"] },
                                        { $eq: ["$receiver", new mongoose.Types.ObjectId(id)] },
                                        { $eq: ["$isRead", false] },
                                    ],
                                },
                            },
                        },
                        { $count: "unreadCount" },
                    ],
                    as: "unreadData",
                },
            },

            // clean projection
            {
                $project: {
                    password: 0,
                    lastMessage: { $arrayElemAt: ["$lastMessage.text", 0] }, // 👈 only text
                    lastMessageAt: { $arrayElemAt: ["$lastMessage.createdAt", 0] }, // optional
                    unreadCount: {
                        $ifNull: [{ $arrayElemAt: ["$unreadData.unreadCount", 0] }, 0],
                    },
                },
            },
        ]);

        res.status(200).json(users);
    } catch (error) {
        if (error instanceof Error) console.error(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
