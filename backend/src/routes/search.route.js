import express from "express"

const searchRouter = express.Router()

searchRouter.get('/:searchText', async (req, res) => {
    const { searchText } = req.params
    try {
        res.status(200).json(searchText)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
})


export default searchRouter