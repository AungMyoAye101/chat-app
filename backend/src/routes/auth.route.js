import express from "express"
import { createUser, login } from "../controllers/auth.js"
import { verifyToken } from "../middleware/verify.js"
import User from "../model/user.model.js"
const router = express.Router()

router.post("/register", createUser)
router.post("/login", login)
router.get("/me", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.id).select("-password")
        res.status(201).json({ message: "Get user", data: user })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

export default router