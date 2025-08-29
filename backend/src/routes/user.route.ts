import express from "express"
import { verifyToken } from "../middleware/verify"
import { getAllUsers, getUserById, updateUser } from "../controllers/users"

const userRouter = express.Router()

userRouter.get('/', verifyToken, getAllUsers)
userRouter.get('/:userId', getUserById)
userRouter.put('/update/:userId', updateUser)

export default userRouter