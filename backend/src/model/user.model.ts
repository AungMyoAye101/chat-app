import mongoose, { Document } from "mongoose"

export interface IUser extends Document {
    name: string,
    email: string,
    password: string,
    avatar: string,
    avatarPublicId: string,
    lastSeen: Date,
    groups: string[]

}

const userSchema = new mongoose.Schema<IUser>({

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

const User = mongoose.model<IUser>("User", userSchema)
export default User