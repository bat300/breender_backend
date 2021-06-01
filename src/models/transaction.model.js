import mongoose from "mongoose"

const transactionDaysLimit = 60
const StatusProperty = {
    type: String,
    enum: ["pending", "success", "fail"],
    default: "pending",
    required: true,
}

const TransactionSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    senderResponse: StatusProperty,
    receiverResponse: StatusProperty,
    status: StatusProperty,
    amount: {
        type: Number,
        min: 0.0,
        required: true,
    },
})

TransactionSchema.set("timestamps", true)
TransactionSchema.virtual("deadline").get(calculateDeadline(this.createdAt))

function calculateDeadline(createdAt) {
    var deadline = new Date(createdAt)
    deadline.setDate(deadline.getDate() + transactionDaysLimit)
    return deadline
}

module.exports = mongoose.model("Transaction", TransactionSchema)
