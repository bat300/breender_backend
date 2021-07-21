import mongoose from "mongoose"

const Schema = mongoose.Schema

const PaymentMethodSchema = new Schema({
    type: {
        type: String,
        enum: ["PayPal"],
        required: true,
    },
    email: {
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
    transactionNr: {
        type: String,
        required: true,
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
    province: {
        type: String,
        required: true,
    },
    subscriptionPlan: {
        type: String,
        enum: ["free", "premium"],
        default: "free",
        required: true,
    },
    paymentPlan: {
        type: String,
        enum: ["none", "1mo", "3mo", "6mo", "1yr"],
        default: "none",
        required: true,
    },
    startDate: Date,
    paymentMethod: PaymentMethodSchema,
})

UserSchema.virtual("endDate").get(function () {
    return calculateEndDate(this.startDate, this.paymentPlan)
})

function calculateEndDate(startDate, paymentPlan) {
    var i = 0
    switch (paymentPlan) {
        case "1mo":
            i = 1
            break
        case "3mo":
            i = 3
            break
        case "6mo":
            i = 6
            break
        case "1yr":
            i = 12
            break
        case "none":
            break
        default:
            break
    }

    var dy = startDate.getDay()
    startDate.setMonth(startDate.getMonth() + i * 1)
    startDate.setDate(startDate.getDate() - (startDate.getDay() - dy))
    return startDate
}
const User = mongoose.model("User", UserSchema)
const Review = mongoose.model("Review", ReviewSchema)

export { User, Review }
