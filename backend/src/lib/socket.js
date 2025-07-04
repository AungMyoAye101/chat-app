import http from "http"
import express from "express"
import { Server } from "socket.io"

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173'],
        credentials: true
    },

})
io.on("connection", (socket) => {


    socket.on("setup", (userId) => {
        console.log(userId)
        socket.join(userId)
        console.log("user " + userId + "joined")
    })

    socket.on("send-message", ({ sender, receiverId, message }) => {
        const payload = {
            sender, message
        }
        io.to(receiverId).to(sender.id).emit("received-message", payload)

    })
    socket.on("disconnected", () => {
        console.log("user is disconnected", socket.id)
    })

})

export { io, server, app }