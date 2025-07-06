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
io.on("connection", (socket) => {


    socket.on("setup", (userId) => {

        socket.join(userId)
        console.log("user " + userId + " joined")
    })

    socket.on("send-message", async ({ senderId, receiverId, message }) => {
        const newMessage = await Message.create({ sender: senderId, receiver: receiverId, message })
        console.log(senderId, receiverId, message)
        io.to(receiverId).to(senderId).emit("received-message", newMessage)

    })
    socket.on("disconnected", () => {
        console.log("user is disconnected", socket.id)
    })

})

export { io, server, app }