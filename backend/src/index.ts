import dotenv from "dotenv"
import express from "express"
// import messageRouter from "./routes/message.route.js"
// import groupRouter from "./routes/group.route.js"
// import userRouter from "./routes/user.route.js"
// import { app, server } from "./lib/socket.js"
// import cookiePaser from "cookie-parser"
// import imageRouter from "./routes/imageUpload.route.js"
// import searchRouter from "./routes/search.route.js"
import type { Request, Response } from "express"
import { connectToDb } from "./lib/db"
import cookieParser from "cookie-parser"
import cors from "cors"
// import authRouter from "./routes/auth.route.js"
// //to config env file
dotenv.config()
connectToDb()
const app = express()
app.use(cors({ origin: process.env.FRONTEND_UR, credentials: true }));
app.use(express.json());
app.use(cookieParser())

// // Routes
// app.use("/api/auth", authRouter)
// app.use('/api/user', userRouter)
// app.use("/api/messages", messageRouter);
// app.use('/api/search', searchRouter);
// app.use("/api/group", groupRouter);
// app.use("/api/image", imageRouter);

app.get("/", (req: Request, res: Response) => {
    res.send("server is running.")
});

app.use((req: Request, res: Response) => {
    res.status(404).json({ message: "No route match." })
})
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});




