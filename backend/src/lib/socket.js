import http from "http"
import express from "express"
import { Server } from "socket.io"
import Message from "../model/message.model.js"

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        credentials: true
    },

})

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
        console.log("stop typing")
        socket.to(receiverId).emit("stop-typing", socket.userId)
    })

    socket.on("disconnect", () => {
        console.log("user is disconnected", socket.id)
        if (socket.userId) {
            onlineUsers.delete(socket.userId)
            io.emit("online-users", Array.from(onlineUsers.keys()))
        }
    })

})

export { io, server, app }