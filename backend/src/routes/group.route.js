import express from "express"
import { verifyToken } from "../middleware/verify.js"
import mongoose from "mongoose"
import Group from "../model/group.model.js"

const groupRouter = express.Router()
groupRouter.get("/", (req, res) => {
    res.send("hello group")
})
groupRouter.post('/create-group', verifyToken, async (req, res) => {
    const { name, member } = req.body
    const userId = req.id
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invaild user id!" })
    }
    const membersId = [userId]
    try {
        const newGroup = await Group.create({ name, members: membersId, createdBy: userId })
        if (!newGroup) {
            return res.status(400).json({ message: "Failed to create group." })
        }
        res.status(201).json({ message: "group created succeeful", group: newGroup })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

})
export default groupRouter