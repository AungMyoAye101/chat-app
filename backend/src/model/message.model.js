import mongoose from "mongoose";
import User from "./user.model.js";

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

const Message = mongoose.model("Message", messageSchema)
export default Message