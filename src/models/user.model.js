import mongoose from "mongoose";

// Define the user schema
const UserModel = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        unique: true,
    },
    // role of the user, used for rights management
    role: {
        type: String,
        // role can only take the value "member" and "admin"
        enum: ["member", "admin"],
        // if not specified the role member is choosen
        default: "member",
    },
});

UserModel.set("versionKey", false);

// Export the User model
export default mongoose.model("User", UserModel);