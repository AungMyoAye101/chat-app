
import express from "express"
import type { Request, Response } from "express"
import { verifyToken } from "../middleware/verify";
import User from "../model/user.model";
import { createUser, login } from "../controllers/auth";

const authRouter = express.Router()

authRouter.post("/register", createUser)
authRouter.post("/login", login)
authRouter.get("/me", verifyToken, async (req: Request, res: Response) => {
    try {
        // Assuming verifyToken middleware attaches user info to req.user
        const userId = req.id
        const user = await User.findById(userId).select("-password");
        res.status(201).json({ message: "fetched user", user });
    } catch (error) {
        res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) });
    }
});
authRouter.post('/logout', async (req: Request, res: Response) => {
    res.clearCookie('token')
    res.status(200).json({ message: "Logout ." })
})

export default authRouter 