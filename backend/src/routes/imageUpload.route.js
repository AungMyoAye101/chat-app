import express from "express"
import cloudinary, { upload } from "../lib/cloundinary.js"
import mongoose from "mongoose"
import User from "../model/user.model.js"
import fs from "fs"
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
        console.log(uploaded)
        const user = await User.findByIdAndUpdate(id, { avatar: uploaded.secure_url, avatar_public_id: uploaded.public_id })
        fs.unlinkSync(images.path)
        res.status(201).json(user)
    } catch (error) {
        console.log(error.message)
        res.status(500).json("internal server error.")
    }
})

imageRouter.put('/upload/:id', upload.single('avatar'), async (req, res) => {
    console.log('uploading...')
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json("UserId is not valid")
    }
    const images = req.file
    if (!images) {
        res.status(400).json("Image not found.")
    }
    try {

        const removePrevImage = await cloudinary.uploader.destroy(public_id)
        const updated = await cloudinary.uploader.upload(images.path, { folder: "chat-app/profile" })
        const { secure_url, public_id } = updated
        const user = await User.findByIdAndUpdate(id, { avatar: secure_url, avatar_public_id: public_id })
        fs.unlinkSync(images.path)
        res.status(201).json(user)

    } catch (error) {
        console.log(error.message)
        res.status(500).json("internal server error.")
    }

})

export default imageRouter