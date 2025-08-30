"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.server = exports.io = void 0;
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const message_model_1 = __importDefault(require("../model/message.model"));
const user_model_1 = __importDefault(require("../model/user.model"));
const app = (0, express_1.default)();
exports.app = app;
const server = http_1.default.createServer(app);
exports.server = server;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.FORNTEND_URL,
        credentials: true,
    },
});
exports.io = io;
const onlineUsers = new Map();
io.on("connection", (socket) => {
    socket.on("setup", (userId) => {
        socket.userId = userId;
        onlineUsers.set(userId, socket.id);
        socket.join(userId);
        console.log(Array.from(onlineUsers.keys()));
        io.emit("online-users", Array.from(onlineUsers.keys()));
    });
    socket.on("send-message", async ({ senderId, receiverId, message, }) => {
        const createdMessage = await message_model_1.default.create({ sender: senderId, receiver: receiverId, message });
        const newMessage = await createdMessage.populate([
            { path: "sender", select: "id name" },
            { path: "receiver", select: "id name" }
        ]);
        io.to(receiverId).to(senderId).emit("received-message", newMessage);
    });
    //seen message 
    socket.on("seen-message", async ({ messageId, userId, chatId }) => {
        const updatedMessage = await message_model_1.default.findByIdAndUpdate(messageId, { $addToSet: { seenBy: userId } }, { new: true });
        io.to(chatId).emit("seen", updatedMessage);
    });
    // for typing indicator
    socket.on("typing", ({ senderId, receiverId }) => {
        socket.to(receiverId).emit("isTyping", { senderId, receiverId });
    });
    socket.on("stop-typing", ({ senderId, receiverId }) => {
        socket.to(receiverId).emit("stopped-typing", { senderId, receiverId });
    });
    socket.on("disconnect", async () => {
        if (socket.userId) {
            onlineUsers.delete(socket.userId);
            try {
                await user_model_1.default.findByIdAndUpdate(socket.userId, { lastSeen: Date.now() });
            }
            catch (error) {
                console.error(error.message);
            }
            io.emit("online-users", Array.from(onlineUsers.keys()));
        }
    });
    //For Group Chat 
    socket.on("join-group", ({ groupId, userId }) => {
        socket.join(groupId);
        console.log(`User ${userId} joined group ${groupId}`);
    });
    socket.on("send-message-group", async ({ groupId, senderId, message }) => {
        try {
            const groupMessage = await message_model_1.default.create({
                sender: senderId,
                group: groupId,
                message,
            });
            const newMessage = await groupMessage.populate([{ path: "sender", select: "_id name" }, { path: "seenBy", select: "_id name avatar" }]);
            io.to(groupId).emit("received-group-message", newMessage);
        }
        catch (error) {
            console.log(error);
        }
    });
});
//# sourceMappingURL=socket.js.map