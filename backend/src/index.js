
import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import authRouter from "./routes/auth.route.js"
import messageRouter from "./routes/message.route.js"
import groupRouter from "./routes/group.route.js"
import userRouter from "./routes/user.route.js"
import { connectToDb } from "./lib/db.js"
import { app, server } from "./lib/socket.js"
import cookiePaser from "cookie-parser"
//to config env file 
dotenv.config()
connectToDb()

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookiePaser())

// Routes
app.use("/api/auth", authRouter)
app.use('/api/users', userRouter)
app.use("/api/messages", messageRouter);
app.use("/api/group", groupRouter);

//to connect database


// Socket.io
// const onlineUsers = new Map();

// io.on("connection", (socket) => {
//     console.log("User connected: " + socket.id);

//     socket.on("setup", (userId) => {
//         socket.join(userId);
//         socket.userId = userId;
//         onlineUsers.set(userId, socket.id);
//         io.emit("online-users", Array.from(onlineUsers.keys()));
//         console.log("User setup:", userId);
//     });

//     socket.on("disconnect", () => {
//         if (socket.userId) {
//             onlineUsers.delete(socket.userId);
//             io.emit("online-users", Array.from(onlineUsers.keys()));
//             console.log("User disconnected:", socket.userId);
//         }
//     });

//     // One-to-one messaging
//     socket.on("send-message", async ({ senderId, receiverId, message }) => {
//         const newMessage = await Message.create({ sender: senderId, receiver: receiverId, message });
//         io.to(receiverId).to(senderId).emit("received-message", newMessage);
//     });

//     // Typing indicator (one-to-one)
//     socket.on("typing", (receiverId) => {
//         socket.to(receiverId).emit("typing", socket.userId);
//     });

//     socket.on("stop-typing", (receiverId) => {
//         socket.to(receiverId).emit("stop-typing", socket.userId);
//     });

//     // Group chat events
//     socket.on("join-group", (groupId) => {
//         socket.join(groupId);
//     });

//     socket.on("leave-group", (groupId) => {
//         socket.leave(groupId);
//     });

//     socket.on("send-group-message", async ({ groupId, senderId, message }) => {
//         const newMsg = await Message.create({ group: groupId, sender: senderId, message });
//         io.to(groupId).emit("receive-group-message", newMsg);
//     });

//     // Group typing indicator
//     socket.on("group-typing", ({ groupId, senderId }) => {
//         socket.to(groupId).emit("group-typing", senderId);
//     });

//     socket.on("group-stop-typing", ({ groupId, senderId }) => {
//         socket.to(groupId).emit("group-stop-typing", senderId);
//     });
// });

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
