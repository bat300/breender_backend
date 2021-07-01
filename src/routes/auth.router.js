import * as express from "express";
import { checkAuthentication } from "../middlewares/auth.middleware.js";
import {login, register,checkIfUserExists, me, logout, confirmEmail} from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/login", login); //login
authRouter.get("/userExists/:email/:username", checkIfUserExists);
authRouter.post("/register", register); // register a new user
authRouter.get("/me", checkAuthentication, me); // get own username, requires a logged in user
authRouter.get("/logout", checkAuthentication, logout); // logout user
authRouter.get("/confirmation/:email/:token",confirmEmail); //confirm email

export default authRouter;