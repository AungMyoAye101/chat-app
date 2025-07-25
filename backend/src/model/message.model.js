import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    group: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
    message: {
        type: String,
        required: true
    },
    seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
},
    { timestamps: true }
)

const Message = mongoose.model("Message", messageSchema)
export default Message