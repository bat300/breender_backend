import mongoose from "mongoose"
import moment from "moment"

const transactionDaysLimit = 60
const StatusProperty = {
    type: String,
    enum: ["pending", "success", "fail"],
    default: "pending",
    required: true,
}

const TransactionSchema = new mongoose.Schema(
    {   
        orderNr: {
            type: String,
            required: true, 
        },
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
        pet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Pet",
            required: true,
        },
        createdAt: {
            type: Date,
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
        processed: {
            type: Boolean,
            default: false,
        },
        reminderSent: {
            type: Boolean,
            default: false,
        },
    },
    {
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
    }
)

TransactionSchema.set("timestamps", true)

TransactionSchema.virtual("deadline").get(function () {
    return calculateDeadline(this.createdAt)
})

function calculateDeadline(createdAt) {
    var deadline = moment(createdAt).add(transactionDaysLimit, 'days');
    return deadline
}

export var Transaction = mongoose.model("Transaction", TransactionSchema)
