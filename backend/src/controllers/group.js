import mongoose from "mongoose"
import Group from "../model/group.model.js"


export const createGroup = async (req, res) => {
    const { name } = req.body
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

}
export const getGroups = async (req, res) => {
    const userId = req.id
    try {
        const groups = await Group.find({ members: { $in: userId } })
        if (!groups) {
            res.status(404).json({ message: "Failed to fetch group." })
        }
        res.status(200).json({ message: 'success', groups })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Interval server error" })
    }
}

export const updateGroup = async (req, res) => {
    const { groupId } = req.params
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
        return res.status(400).json({ message: "Invalid group Id." })
    }
    try {
        const updatedGroup = await Group.findOneAndUpdate({ _id: groupId }, { ...req.body }, { new: true })
        console.log(updatedGroup)

        res.status(200).json({ message: 'Group updated successful', })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Interval server error" })
    }
}

export const getGroupById = async (req, res) => {
    const { groupId } = req.params
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
        return res.status(400).json({ message: "Invalid group Id." })
    }
    try {
        const group = await Group.findById(groupId).populate('members', 'name ')
        if (!group) {
            return res.status(404).json({ message: "Group not found." })
        }
        res.status(200).json({ message: 'success', group })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Interval server error" })
    }
}