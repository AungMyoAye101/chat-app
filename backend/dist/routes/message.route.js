"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verify_1 = require("../middleware/verify");
const message_1 = require("../controllers/message");
const messageRouter = express_1.default.Router();
messageRouter.get('/:receiverId', verify_1.verifyToken, message_1.getMessages);
messageRouter.get('/group/:groupId', verify_1.verifyToken, message_1.getGroupMessage);
messageRouter.get('/:messageId', verify_1.verifyToken, message_1.getMessageById);
messageRouter.put('/:messageId', verify_1.verifyToken, message_1.messageSeenBy);
exports.default = messageRouter;
//# sourceMappingURL=message.route.js.map