import mongoose from "mongoose"
import User from "../model/user.model"
import type { Request, Response } from "express"


export const getAllUsers = async (req: Request, res: Response) => {
    const id = req.id as string;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid userId" })
    }
    try {
        const users = await User.find({ _id: { $ne: id } }).select("-password")
        res.status(200).json(users)
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