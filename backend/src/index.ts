import dotenv from "dotenv"
import express from "express"
import type { Request, Response } from "express"
import { connectToDb } from "./lib/db"
import cookieParser from "cookie-parser"
import cors from "cors"
import authRouter from "./routes/auth.route"
import userRouter from "./routes/user.route"
import messageRouter from "./routes/message.route"
import searchRouter from "./routes/search.route"
import groupRouter from "./routes/group.route"
import imageRouter from "./routes/imageUpload.route"
import { app, server } from "./lib/socket"

// //to config env file
dotenv.config()
connectToDb()
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser())

// Routes
app.use("/api/auth", authRouter)
app.use('/api/user', userRouter)
app.use("/api/messages", messageRouter);
app.use('/api/search', searchRouter);
app.use("/api/group", groupRouter);
app.use("/api/image", imageRouter);

app.get("/", (req: Request, res: Response) => {
    res.send("server is running.")
});

// app.use((req: Request, res: Response) => {
//     res.status(404).json({ message: "No route match." })
// })
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});




