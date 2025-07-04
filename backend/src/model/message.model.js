import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Types.ObjectId,
        ref: User
    },
    recevier: {
        type: mongoose.Types.ObjectId,
        ref: User
    },
    message: {
        type: String,
        required: true
    }
},
    { timestamps: true }
)