import express from "express"
import { verifyToken } from "../middleware/verify"
import { getGroupMessage, getMessageById, getMessages, messageSeenBy } from "../controllers/message"

const messageRouter = express.Router()

messageRouter.get('/:receiverId', verifyToken, getMessages)
messageRouter.get('/group/:groupId', verifyToken, getGroupMessage)
messageRouter.get('/:messageId', verifyToken, getMessageById)
messageRouter.put('/:messageId', verifyToken, messageSeenBy)

export default messageRouter