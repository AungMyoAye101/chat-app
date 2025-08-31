import { v2 as cloudinary } from 'cloudinary'
import multer from "multer"
import path from "path"
import fs from "fs"
import dotenv from "dotenv"
dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUNDINARY_NAME,
    api_key: process.env.CLOUNDINARY_API_key,
    api_secret: process.env.CLOUNDINARY_API_SECRECT
});

const uploadDir = path.join(__dirname + ".." + "uploads")
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, uploadDir) },
    filename: function (req, file, cb) { cb(null, Date.now() + path.extname(file.originalname)) }
})

export const upload = multer({ storage })
export default cloudinary