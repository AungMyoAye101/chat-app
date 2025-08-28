import mongoose from "mongoose"



const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    avatar: {
        type: String
    },
    avatarPublicId: {
        type: String
    },
    lastSeen: {
        type: Date,
        default: Date.now()
    },
    groups: [{ type: mongoose.Types.ObjectId }]
}, { timestamps: true })

const User = mongoose.model("User", userSchema)
export default User