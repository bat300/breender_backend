import mongoose from "mongoose"
import moment from "moment"
import Review from "../models/review.model.js"

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
        fee: {
            type: Number,
            min: 0.0,
            default: 0.0,
            required: false,
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

TransactionSchema.virtual("isReviewed").get(function () {
    let reviews = Review.find({ transactionNr: this._id })
    return reviews && reviews.count > 0 ? true : false
})

TransactionSchema.virtual("processed").get(function () {
    if (this.status === "success" || this.status === "fail") {
        return true
    } else return false
})

function calculateDeadline(createdAt) {
    var deadline = moment(createdAt).add(transactionDaysLimit, "days")
    return deadline
}

export var Transaction = mongoose.model("Transaction", TransactionSchema)
