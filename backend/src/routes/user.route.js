import express from "express"
import { getAllUsers, getUserById } from "../controllers/users.js"
import { verifyToken } from "../middleware/verify.js"
const userRouter = express.Router()

userRouter.get('/', verifyToken, getAllUsers)
userRouter.get('/:userId', getUserById)

export default userRouter