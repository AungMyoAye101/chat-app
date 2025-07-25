import express from "express"
import { verifyToken } from "../middleware/verify.js"
import { getGroupMessage, getMessages, messageSeenBy } from "../controllers/message.js"
const messageRouter = express.Router()

messageRouter.get('/:receiverId', verifyToken, getMessages)
messageRouter.get('/group/:groupId', verifyToken, getGroupMessage)
messageRouter.put('/:messageId', verifyToken, messageSeenBy)

export default messageRouter