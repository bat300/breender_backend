import mongoose from "mongoose"

const Schema = mongoose.Schema

const PaymentMethodSchema = new Schema({
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

const ReviewSchema = new Schema({
    reviewerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    revieweeId: {
        type: Schema.Types.ObjectId,
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
    verifiedTransaction: {
        type: Boolean,
        default: false,
    },
})

const UserSchema = new Schema({
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
    isVerified: {
        type: Boolean,
        default: false,
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

const User = mongoose.model("User", UserSchema)
// export const Review = mongoose.model("Review", ReviewSchema);

export default User
