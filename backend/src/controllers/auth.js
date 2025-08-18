
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../model/user.model.js"
import fs from "fs"
import cloudinary from "../lib/cloundinary.js"

export const createUser = async (req, res) => {

    const { email, password } = req.body

    console.log("creating....")

    try {

        const userExit = await User.findOne({ email })
        if (userExit) {
            return res.status(400).json({ message: "User already exists." })
        }

        const hashed = await bcrypt.hash(password, 10)

        const newUser = await User.create({ ...req.body, password: hashed, })


        console.log("created")
        const token = jwt.sign({
            id: newUser._id
        }, process.env.SECRET_KEY, {
            expiresIn: "7d"
        })

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(201).json({ message: "User created", user: newUser })

    } catch (error) {
        console.log(error.message)
        res.status(500).json("Internal server error.")
    }



}

export const login = async (req, res) => {
    const { email, password } = req.body
    console.log(req.file)
    try {
        const userExit = await User.findOne({ email })
        if (!userExit) {
            return res.status(404).json({ message: "User doesn't exist." })

        }
        console.log(password, "__AND__", userExit.password)
        const checkPassword = await bcrypt.compare(password, userExit.password)
        console.log(checkPassword)
        if (!checkPassword) {
            return res.status(400).json({ message: "Email or password doesn't match." })

        }
        const token = jwt.sign({ id: userExit._id }, process.env.SECRET_KEY, { expiresIn: "7d" })
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        res.status(200).json({ message: "User logged in.", user: userExit })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

