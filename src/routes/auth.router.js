import * as express from "express";
import { checkAuthentication } from "../middlewares/auth.middleware.js";
import { login, register, checkUser, me, logout, confirmEmail, updateUser } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/login", login); //login
authRouter.get("/checkUser/:email/:username/:isAdmin", checkUser); //check if user info is valid
authRouter.post("/register", register); // register a new user
authRouter.get("/me", checkAuthentication, me); // get own username, requires a logged in user
authRouter.get("/logout", checkAuthentication, logout); // logout user
authRouter.get("/confirmation/:email/:token", confirmEmail); //confirm email
authRouter.post("/update", checkAuthentication, updateUser); //update user subscription plan

export default authRouter;