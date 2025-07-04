
import jwt from "jsonwebtoken"

export const verifyToken = async (req, res, next) => {
    const { token } = req.cookies
    console.log(token)
    if (!token) {
        return res.status(400).json({ message: 'Invailed token' })
    }
    try {
        const decode = jwt.verify(token, process.env.SECRET_KEY)
        req.id = decode.id
        next()
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}