
import dotenv from "dotenv"
import express from "express"
import cookiePaser from "cookie-parser"
dotenv.config()
import { app, server, io } from "./lib/socket.js"


app.use(express.json())
app.use(cookiePaser())

app.get("/", async (req, res) => (
    res.send("Server is alive ")
))


server.listen(3000, () => (
    console.log("server is listening on port" + 3000)
))