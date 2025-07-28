import { v2 as cloudinary } from 'cloudinary'
import multer from "multer"
import path from "path"

cloudinary.config({
    cloud_name: process.env.CLOUNDINARY_NAME,
    api_key: process.env.CLOUNDINARY_API_key,
    api_secret: process.env.CLOUNDINARY_API_SECRECT
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, "uploads/") },
    filename: function (req, file, cb) { cb(null, Date.now() + path.extname(file.originalname)) }
})

export const upload = multer({ storage })