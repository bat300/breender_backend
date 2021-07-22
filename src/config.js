// Configuration variables
const port = process.env.PORT || "4000";
const mongoURI = process.env.MONGODB_URI || "mongodb+srv://breenderTeam:877JPH-@5EJtE5v@breenderdb.sldft.mongodb.net/breender?retryWrites=true&w=majority";
const JwtSecret = process.env.JWT_SECRET || "very secret secret";

export {
    port,
    mongoURI,
    JwtSecret,
};