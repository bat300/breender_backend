import * as express from "express";
import { checkAuthentication } from "../middlewares/auth.middleware.js";
import { login, register, me, logout } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", login); // login
router.post("/register", register); // register a new user
router.get("/me", checkAuthentication, me); // get own username, requires a logged in user
router.get("/logout", checkAuthentication, logout); // logout user

export default router;