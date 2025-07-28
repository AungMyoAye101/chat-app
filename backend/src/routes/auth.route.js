import { createUser, login } from "../controllers/auth.js";
import { upload } from "../lib/cloundinary.js";
import { verifyToken } from "../middleware/verify.js";
import User from "../model/user.model.js";
import express from "express"

const authRouter = express.Router()

authRouter.post("/register", upload.single('avater'), createUser)
authRouter.post("/login", login)
authRouter.get("/me", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.id).select("-password")
        res.status(201).json({ message: "Get user", user })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

export default authRouter 