import express from "express"
import { verifyToken } from "../middleware/verify.js"
import { getGroupMessage, getMessages } from "../controllers/message.js"
const messageRouter = express.Router()

messageRouter.get('/:receiverId', verifyToken, getMessages)
messageRouter.get('/group/:groupId', verifyToken, getGroupMessage)

export default messageRouter