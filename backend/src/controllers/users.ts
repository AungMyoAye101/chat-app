import mongoose from "mongoose"
import User from "../model/user.model.js"
import cloudinary from "../lib/cloundinary.js"

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
export const getUserById = async (req, res) => {
    const { userId } = req.params
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid userId" })
    }
    try {
        const users = await User.findById(userId).select("-password").populate('groups')
        res.status(200).json(users)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const updateUser = async (req, res) => {
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
        console.log(error)
        res.status(500).json({ message: "Internal server error!" })

    }
}