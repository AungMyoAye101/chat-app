import express from "express"
import mongoose from "mongoose"
import fs from 'fs/promises'
import cloudinary, { upload } from "../lib/cloundinary"
import User, { IUser } from "../model/user.model"
import Group from "../model/group.model"
const imageRouter = express.Router()


imageRouter.post('/upload/user/:id', upload.single('avatar'), async (req, res) => {
    console.log('uploading...')
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json("UserId is not valid")
    }
    const images = req.file
    if (!images) {
        res.status(400).json("Image not found.")
        return;
    }
    try {
        const user = await User.findById(id)
        if (!user) {
            res.status(400).json("Invalid userId!")
            return;
        }
        if (user.avatarPublicId) {
            await cloudinary.uploader.destroy(user.avatarPublicId)
            console.log("delete old photo from cloudinary.")
        }

        const uploaded = await cloudinary.uploader.upload(images.path, { folder: "chat-app/profile" })
        user.avatar = uploaded.secure_url;
        user.avatarPublicId = uploaded.public_id
        await user.save()
        try {
            await fs.unlink(images.path)
        } catch (error) {
            if (error instanceof Error)
                console.warn("Tem file not deleted .", + error.message)
        }

        return res.status(201).json(user)

    } catch (error) {
        if (error instanceof Error)
            console.log(error.message)
        res.status(500).json("internal server error.")
    }

})
imageRouter.post('/upload/group/:id', upload.single('avatar'), async (req, res) => {
    console.log('uploading...')
    const { id } = req.params
    const images = req.file
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json("UserId is not valid")
    }

    if (!images) {
        return res.status(400).json("Image not found.")

    }
    try {
        const group = await Group.findById(id)
        if (!group) {
            return res.status(400).json("Invalid userId!")

        }
        if (group.avatarPublicId) {
            try {
                await cloudinary.uploader.destroy(group.avatarPublicId)
                console.log("delete old photo from cloudinary.")
            } catch (error) {
                console.warn("Failed to delete old image " + error)
            }

        }

        const uploaded = await cloudinary.uploader.upload(images.path, { folder: "chat-app/profile" })
        group.avatar = uploaded.secure_url;
        group.avatarPublicId = uploaded.public_id
        await group.save()
        try {
            await fs.unlink(images.path)
        } catch (error) {
            if (error instanceof Error)
                console.warn("Tem file not deleted .", + error.message)
        }
        return res.status(201).json(group)

    } catch (error) {
        if (error instanceof Error)
            console.log(error.message)
        res.status(500).json("internal server error.")
    }

})

export default imageRouter