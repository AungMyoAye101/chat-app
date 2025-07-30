import express from "express"
import cloudinary, { upload } from "../lib/cloundinary.js"
import mongoose from "mongoose"
import User from "../model/user.model.js"

const imageRouter = express.Router()

imageRouter.post('/upload/:id', upload.single('avatar'), async (req, res) => {
    console.log('uploading...')
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json("UserId is not valid")
    }
    const images = req.file
    if (!images) {
        res.status(400).json("Image not found.")
    }

    console.log(images)
    try {

        const uploaded = await cloudinary.uploader.upload(images.path, { folder: 'chat-app/profile' })
        console.log(upload)
        // const user = await User.findByIdAndUpdate(id)

        res.status(201).json(uploaded)
    } catch (error) {
        console.log(error.message)
        res.status(500).json("internal server error.")
    }
})

export default imageRouter