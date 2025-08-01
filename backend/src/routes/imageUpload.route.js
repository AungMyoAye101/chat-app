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
        const user = await User.findByIdAndUpdate(id, { avatar: uploaded.secure_url, avatarPublicId: uploaded.public_id })
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
        const user = await User.findById(id)
        if (!user) {
            res.status(400).json("Invalid userId!")
        }
        console.log(user.avatarPublicId)
        if (user.avatarPublicId) {
            await cloudinary.uploader.destroy(user.avatarPublicId)
            console.log("delete old photo from cloudinary.")
        }

        const uploaded = await cloudinary.uploader.upload(images.path, { folder: "chat-app/profile" })
        console.log("uploaded")
        user.avatar = uploaded.secure_url;
        user.avatarPublicId = uploaded.public_id
        await user.save()
        fs.unlinkSync(images.path)
        res.status(201).json(user)

    } catch (error) {
        console.log(error.message)
        res.status(500).json("internal server error.")
    }

})

export default imageRouter