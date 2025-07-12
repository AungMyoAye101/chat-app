import Group from "../model/group.model.js"

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