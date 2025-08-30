"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessageById = exports.messageSeenBy = exports.getGroupMessage = exports.getMessages = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const message_model_1 = __importDefault(require("../model/message.model"));
const getMessages = async (req, res) => {
    const { receiverId } = req.params;
    const senderId = req.id;
    if (!mongoose_1.default.Types.ObjectId.isValid(senderId)) {
        return res.status(400).json({ message: "Invalid senderId" });
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(receiverId)) {
        return res.status(400).json({ message: "Invalid receiverId" });
    }
    try {
        const message = await message_model_1.default.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        })
            .populate([
            { path: "sender", select: "id name" },
            { path: "receiver", select: "id name" }
        ])
            .sort({ createdAt: 1 });
        res.status(200).json(message);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal error." });
    }
};
exports.getMessages = getMessages;
const getGroupMessage = async (req, res) => {
    const { groupId } = req.params;
    try {
        const message = await message_model_1.default.find({ group: groupId }).populate([
            { path: "sender", select: "id name" }, { path: "seenBy", select: "id name" }
        ]);
        res.status(200).json(message);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal error." });
    }
};
exports.getGroupMessage = getGroupMessage;
const messageSeenBy = async (req, res) => {
    const { messageId } = req.params;
    const userId = req.id;
    if (!mongoose_1.default.Types.ObjectId.isValid(userId) || !mongoose_1.default.Types.ObjectId.isValid(messageId)) {
        return res.status(400).json({ message: "Invalid Id" });
    }
    try {
        const message = await message_model_1.default.findByIdAndUpdate(messageId, { $addToSet: { seenBy: userId } }, { new: true });
        if (!message) {
            return res.status(400).json({ message: "Failed to update message." });
        }
        res.status(200).json(message);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal error." });
    }
};
exports.messageSeenBy = messageSeenBy;
const getMessageById = async (req, res) => {
    const { messageId } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(messageId)) {
        return res.status(400).json({ message: "Invalid message Id!" });
    }
    try {
        const message = await message_model_1.default.findById(messageId).populate([{ path: "sender", select: "id name" }, { path: "seenBy", select: "id name" }]);
        res.status(200).json(message);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal error." });
    }
};
exports.getMessageById = getMessageById;
//# sourceMappingURL=message.js.map