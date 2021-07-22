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
    subscriptionReminderSent: {
        type: Boolean,
        default: false,
    }
})

UserSchema.virtual("endDate").get(function () {
    return this.startDate? calculateEndDate(this.startDate, this.paymentPlan) : null;
})

function calculateEndDate(startDate, paymentPlan) {
    var date = new Date(startDate);
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

    date.setMonth(startDate.getMonth() + (i * 1))
    return date
}
const User = mongoose.model("User", UserSchema)

export default User
