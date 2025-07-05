import Message from "../model/message.model.js"

export const getMessages = async (req, res) => {
    const { receiverId } = req.params
    const senderId = req.id
    try {
        const message = await Message.find({
            $or: [
                { sender: senderId, recevier: receiverId },
                { sender: receiverId, recevier: senderId }
            ]
        }).sort({ createdAt: 1 })
        res.status(200).json(message)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal error." })
    }
}