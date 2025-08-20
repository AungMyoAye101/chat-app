
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
import imageRouter from "./routes/imageUpload.route.js"
import searchRouter from "./routes/search.route.js"
//to config env file 
dotenv.config()
connectToDb()

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookiePaser())

// Routes
app.use("/api/auth", authRouter)
app.use('/api/user', userRouter)
app.use("/api/messages", messageRouter);
app.use('/api/search', searchRouter);
app.use("/api/group", groupRouter);
app.use("/api/image", imageRouter);


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
