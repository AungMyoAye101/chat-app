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
    console.log(req.file)

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid userId" })
    }
    let imageUploaded;

    // try {
    //     if (req.file) {
    //         imageUploaded = await cloudinary.uploader.upload(req.file.path)
    //     }
    //     if (!imageUploaded) {
    //         return res.status(400).json({ message: "Failed to upload image." })
    //     }
    //     const users = await User.findByIdAndUpdate(userId, { ...req.body, avatar: imageUploaded.secure_url, avatar_public_id: imageUploaded.public_id })
    //     res.status(200).json(users)
    // } catch (error) {
    //     console.log(error.message)
    //     res.status(500).json({ message: "Internal server error" })
    // }
}