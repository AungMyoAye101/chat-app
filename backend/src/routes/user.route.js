import express from "express"
import { getAllUsers } from "../controllers/users.js"
import { verifyToken } from "../middleware/verify.js"
const userRouter = express.Router()

userRouter.get('/', getAllUsers)

export default userRouter