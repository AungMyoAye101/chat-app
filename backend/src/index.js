
import dotenv from "dotenv"
import express from "express"
import cookiePaser from "cookie-parser"
import { app, server, io } from "./lib/socket.js"
import { connectToDb } from "./lib/db.js"
dotenv.config()


connectToDb()

app.use(express.json())
app.use(cookiePaser())

app.get("/", async (req, res) => (
    res.send("Server is alive ")
))


server.listen(3000, () => (
    console.log("server is listening on port" + 3000)
))