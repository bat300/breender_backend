// Configuration variables
const port = process.env.PORT || "4000";
const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/breender";
const JwtSecret = process.env.JWT_SECRET || "very secret secret";

export {
    port,
    mongoURI,
    JwtSecret,
};