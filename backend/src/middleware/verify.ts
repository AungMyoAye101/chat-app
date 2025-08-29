import jwt from "jsonwebtoken"
import type { Request, Response, NextFunction } from "express"

declare global {
    namespace Express {
        interface Request {
            id?: string;
        }
    }
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(400).json({ message: 'Invailed token' })
    }
    try {
        const decode = jwt.verify(token, process.env.SECRET_KEY as string)
        req.id = (decode as { id: string }).id
        next()
    } catch (error) {
        if (error instanceof Error)
            res.status(500).json({ message: error.message })
    }
}
