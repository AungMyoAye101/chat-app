"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const group_1 = require("../controllers/group");
const verify_1 = require("../middleware/verify");
const groupRouter = express_1.default.Router();
groupRouter.get("/", verify_1.verifyToken, group_1.getGroups);
groupRouter.get('/:groupId', group_1.getGroupById);
groupRouter.put('/update/:groupId', group_1.updateGroup);
groupRouter.delete('/delete/:groupId', verify_1.verifyToken, group_1.deleteGroup);
groupRouter.post('/create-group', verify_1.verifyToken, group_1.createGroup);
groupRouter.put("/:groupId/add-members", group_1.addMembersToGroup);
groupRouter.get("/check-available-user/:groupId", group_1.checkAvailableGroupMembers);
exports.default = groupRouter;
//# sourceMappingURL=group.route.js.map