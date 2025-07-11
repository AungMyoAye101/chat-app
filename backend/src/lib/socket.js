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
    })

    socket.on("send-message", async ({ senderId, receiverId, message }) => {
        const newMessage = await Message.create({ sender: senderId, receiver: receiverId, message })
        io.to(receiverId).to(senderId).emit("received-message", newMessage)

    })

    // for typing indicator
    socket.on("typing", (receiverId) => {
        if (socket.userId) {
            socket.to(receiverId).emit("isTyping", socket.userId)
        }
    })
    socket.on("stop-typing", (receiverId) => {
        socket.to(receiverId).emit("stopped-typing", receiverId)
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

})

export { io, server, app }