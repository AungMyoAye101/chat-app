import express from "express"

const groupRouter = express.Router()
groupRouter.get("/", (req, res) => {
    res.send("hello group")
})

export default groupRouter