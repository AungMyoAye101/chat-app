import express from "express"
import { verifyToken } from "../middleware/verify.js"
import { addMembersToGroup, checkAvailableGroupMembers, createGroup, deleteGroup, getGroupById, getGroups, updateGroup } from "../controllers/group.js"

const groupRouter = express.Router()
groupRouter.get("/", verifyToken, getGroups)
groupRouter.get('/:groupId', getGroupById)
groupRouter.put('/update/:groupId', updateGroup)
groupRouter.delete('/delete/:groupId', verifyToken, deleteGroup)
groupRouter.post('/create-group', verifyToken, createGroup)
groupRouter.put("/:groupId/add-members", addMembersToGroup)
groupRouter.get("/check-available-user/:groupId", checkAvailableGroupMembers)
export default groupRouter