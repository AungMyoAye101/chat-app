import mongoose, { Document } from "mongoose";

export interface IGroup extends Document {
    name: string,
    members: string[],
    createdBy: string,
    avatar: string,
    avatarPublicId: string
}

const groupSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        avatar: { type: String },
        avatarPublicId: { type: String },
    },
    { timestamps: true }
);

const Group = mongoose.model<IGroup>("Group", groupSchema);
export default Group
