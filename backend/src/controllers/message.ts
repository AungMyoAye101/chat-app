import mongoose from "mongoose"
import type { Request, Response } from "express"
import Message from "../model/message.model"


export const getGroupMessage = async (req: Request, res: Response) => {
    const { groupId } = req.params
    try {
        const message = await Message.find({ group: groupId }).populate([
            { path: "sender", select: "id name" }, { path: "seenBy", select: "id name" }])

        res.status(200).json(message)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal error." })
    }
}

export const messageSeenBy = async (req: Request, res: Response) => {
    const { messageId } = req.params
    const userId = req.id as string

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(messageId)) {
        return res.status(400).json({ message: "Invalid Id" })
    }

    try {
        const message = await Message.findByIdAndUpdate(messageId, { $addToSet: { seenBy: userId } }, { new: true })
        if (!message) {
            return res.status(400).json({ message: "Failed to update message." })
        }

        res.status(200).json(message)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal error." })
    }

}

export const getMessageById = async (req: Request, res: Response) => {
    const { messageId } = req.params
    if (!mongoose.Types.ObjectId.isValid(messageId)) {
        return res.status(400).json({ message: "Invalid message Id!" })
    }
    try {
        const message = await Message.findById(messageId).populate([{ path: "sender", select: "id name" }, { path: "seenBy", select: "id name" }])

        res.status(200).json(message)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal error." })
    }
}


