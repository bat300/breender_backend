import mongoose from "mongoose"

const Schema = mongoose.Schema

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

const Review = mongoose.model("Review", ReviewSchema)

export default Review