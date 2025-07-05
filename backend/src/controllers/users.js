import User from "../model/user.model.js"

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.id } }).select("-password")
        res.status(200).json(users)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}