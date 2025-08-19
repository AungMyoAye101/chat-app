import express from "express"
import User from "../model/user.model.js"
import Group from "../model/group.model.js"

const searchRouter = express.Router()

searchRouter.get('/:searchText', async (req, res) => {
    const { searchText } = req.params
    if (!searchText.trim()) {
        return res.status(400).json({ message: "Missiing search query  " })
    }
    try {
        const regex = new RegExp(searchText, "i")
        const users = await User.find({ name: { $regex: regex } })
        const groups = await Group.find({ name: { $regex: regex } })

        const result = { users, groups }

        res.status(200).json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
})


export default searchRouter