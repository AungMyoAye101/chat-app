import express from "express"
import { verifyToken } from "../middleware/verify.js"
import { getMessages } from "../controllers/message.js"
const messageRouter = express.Router()

messageRouter.get('/:receiverId', verifyToken, getMessages)

export default messageRouter