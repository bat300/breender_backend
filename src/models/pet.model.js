import mongoose from "mongoose"

const DocumentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    uploadDate: {
        type: Date,
        required: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    verificationDate: Date,
})

const CompetitionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    category: String,
    prize: String,
    certificate: DocumentSchema,
})

const PetSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    officialName: {
        type: String,
        required: true,
    },
    nickname: String,
    birthDate: {
        type: Date,
        required: true,
    },
    sex: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        min: 0.0,
    },
    // Profile picture stored as path to the image
    profilePicture: {
        type: String,
        required: true,
    },
    // Pictures stroed as array of paths to images
    pictures: [String],
    breed: {
        type: String,
        required: true,
    },
    species: {
        type: String,
        enum: ["dog", "cat", "horse"],
        required: true,
    },
    competitions: [CompetitionSchema],
    documents: [DocumentSchema],
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
})

PetSchema.virtual("age").get(function () {
    return calculateAge(this.birthDate)
})

function calculateAge(birthDate) {
    var ageDate = new Date(Date.now() - birthDate.getTime());
    return Math.abs(ageDate.getUTCFullYear() - 1970)
}

const Pet = mongoose.model("Pet", PetSchema)

export { Pet }
