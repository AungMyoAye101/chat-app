import mongoose from "mongoose"
import Message from "../model/message.model.js"

export const getMessages = async (req, res) => {
    const { receiverId } = req.params
    const senderId = req.id
    if (!mongoose.Types.ObjectId.isValid(senderId)) {
        return res.status(400).json({ message: "Invalid senderId" })
    }
    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
        return res.status(400).json({ message: "Invalid receiverId" })
    }
    try {
        const message = await Message.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        })
            .populate([
                { path: "sender", select: "id name" },
                { path: "receiver", select: "id name" }
            ])
            .sort({ createdAt: 1 })
        res.status(200).json(message)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal error." })
    }
}