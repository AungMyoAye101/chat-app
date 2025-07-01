import express from 'express'
const app = express()


app.get("/", async (req, res) => (
    res.send("Server is alive ")
))


app.listen(3000, () => (
    console.log("server is listening on port" + 3000)
))