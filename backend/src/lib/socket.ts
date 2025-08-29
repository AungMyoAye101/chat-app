import http from "http"
import express from "express"
import { Server } from "socket.io"
import Message from "../model/message.model";
import User from "../model/user.model";



declare module "socket.io" {
    interface Socket {
        userId?: string;
    }
}



const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
});

const onlineUsers = new Map()
io.on("connection", (socket) => {
    socket.on("setup", (userId) => {

        socket.userId = userId
        onlineUsers.set(userId, socket.id)
        socket.join(userId)
        console.log(Array.from(onlineUsers.keys()))
        io.emit("online-users", Array.from(onlineUsers.keys()))
    })

    socket.on("send-message", async ({ senderId, receiverId, message, }) => {
        const createdMessage = await Message.create({ sender: senderId, receiver: receiverId, message })


        const newMessage = await createdMessage.populate([
            { path: "sender", select: "id name" },
            { path: "receiver", select: "id name" }
        ])
        io.to(receiverId).to(senderId).emit("received-message", newMessage)

    })

    //seen message 
    socket.on("seen-message", async ({ messageId, userId, chatId }) => {
        const updatedMessage = await Message.findByIdAndUpdate(messageId, { $addToSet: { seenBy: userId } }, { new: true })
        io.to(chatId).emit("seen", updatedMessage)
    })

    // for typing indicator
    socket.on("typing", ({ senderId, receiverId }) => {
        socket.to(receiverId).emit("isTyping", { senderId, receiverId })
    })
    socket.on("stop-typing", ({ senderId, receiverId }) => {
        socket.to(receiverId).emit("stopped-typing", { senderId, receiverId })
    })

    socket.on("disconnect", async () => {
        if (socket.userId) {
            onlineUsers.delete(socket.userId)
            try {
                await User.findByIdAndUpdate(socket.userId, { lastSeen: Date.now() })
            } catch (error: any) {
                console.error(error.message)
            }

            io.emit("online-users", Array.from(onlineUsers.keys()))

        }
    })


    //For Group Chat 
    socket.on("join-group", ({ groupId, userId }) => {
        socket.join(groupId)
        console.log(`User ${userId} joined group ${groupId}`);
    })
    socket.on("send-message-group", async ({ groupId, senderId, message }) => {
        try {
            const groupMessage = await Message.create({
                sender: senderId,
                group: groupId,
                message,
            })
            const newMessage = await groupMessage.populate([{ path: "sender", select: "_id name" }, { path: "seenBy", select: "_id name avatar" }])

            io.to(groupId).emit("received-group-message", newMessage)
        } catch (error) {
            console.log(error)
        }

    })
})

export { io, server, app }