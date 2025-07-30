import express from "express"
import { getAllUsers, getUserById, updateUser } from "../controllers/users.js"
import { verifyToken } from "../middleware/verify.js"
import { upload } from "../lib/cloundinary.js"
const userRouter = express.Router()

userRouter.get('/', verifyToken, getAllUsers)
userRouter.get('/:userId', getUserById)
userRouter.put('/update/:userId', upload.single('avatar'), updateUser)

export default userRouter