import * as express from "express";
import { checkAuthentication } from "../middlewares/auth.middleware.js";
import * as AuthController from "../controllers/auth.controller.js";

const authRouter = express.Router();

// login
authRouter.post("/login", AuthController.login); // login
authRouter.post("/register", AuthController.register); // register a new user
authRouter.get("/me", checkAuthentication, AuthController.me); // get own username, requires a logged in user
authRouter.get("/logout", checkAuthentication, AuthController.logout); // logout user

export default authRouter;