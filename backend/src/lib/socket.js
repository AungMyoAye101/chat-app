import http from "http"
import express from "express"
import { Server } from "socket.io"
const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: [process.env.FRONTEND_URL]
    }
})

export { io, server, app }