import mongoose from "mongoose"

const PaymentMethodSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["paypal"],
        required: true,
    },
    details: {
        type: String,
        required: true,
    },
})

const ReviewSchema = new mongoose.Schema({
    reviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    revieweeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    review: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        required: true,
    },
    reviewDate: {
        type: Date,
        required: true,
    },
    veifiedTransaction: {
        type: Boolean,
        default: false,
    },
})

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ["member", "admin"],
        default: "member",
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    subscriptionPlan: {
        type: String,
        enum: ["free", "premium"],
        default: "free",
        required: true,
    },
    renewalFrequency: {
        type: String,
        enum: ["none", "1mo", "3mo", "6mo", "1yr"],
        default: "none",
        required: true,
    },
    nextRenewalDate: Date,
    paymentMethods: [PaymentMethodSchema],
})

module.exports = mongoose.model("User", UserSchema)
module.exports = mongoose.model("Review", ReviewSchema)
