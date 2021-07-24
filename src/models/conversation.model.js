import mongoose from "mongoose"

const ConversationSchema = new mongoose.Schema(
    {
        members: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    },
    { timestamps: true }
)

const MessageSchema = new mongoose.Schema(
    {
        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        seen: {
            type: Boolean,
            required: true,
        },
    },
    { timestamps: true }
)

export var Conversation = mongoose.model("Conversation", ConversationSchema)
export var Message = mongoose.model("Message", MessageSchema)
