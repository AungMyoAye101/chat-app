import http from "http"
import express from "express"
import { Server } from "socket.io"
import Message from "../model/message.model.js"
import User from "../model/user.model.js"

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
        credentials: true,
    },
});

const onlineUsers = new Map()
io.on("connection", (socket) => {


    socket.on("setup", (userId) => {

        socket.userId = userId
        onlineUsers.set(userId, socket.id)
        socket.join(userId)
        io.emit("online-users", Array.from(onlineUsers.keys()))
        console.log('user joined as ', userId,)
    })

    socket.on("send-message", async ({ senderId, receiverId, message }) => {
        const newMessage = await Message.create({ sender: senderId, receiver: receiverId, message })
        socket.to(receiverId).to(senderId).emit("received-message", newMessage)

    })

    // for typing indicator
    socket.on("typing", ({ senderId, receiverId }) => {

        socket.to(receiverId).emit("isTyping", senderId)

    })
    socket.on("stop-typing", ({ senderId, receiverId }) => {
        socket.to(receiverId).emit("stopped-typing", senderId)
    })

    socket.on("disconnect", async () => {
        if (socket.userId) {
            onlineUsers.delete(socket.userId)

            try {
                await User.findByIdAndUpdate(socket.userId, { lastSeen: Date.now() })
            } catch (error) {
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

})

export { io, server, app }