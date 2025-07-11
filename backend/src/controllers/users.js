import mongoose from "mongoose"
import User from "../model/user.model.js"

export const getAllUsers = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.id)) {
        return res.status(400).json({ message: "Invalid userId" })
    }
    try {
        const users = await User.find({ _id: { $ne: req.id } }).select("-password")
        res.status(200).json(users)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}