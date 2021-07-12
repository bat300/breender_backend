import * as express from "express"
import { checkAuthentication } from "../middlewares/auth.middleware.js"
import { read } from "../controllers/user.controller.js"

const userRouter = express.Router()

userRouter.get("/:id", read) // Read a user by id

export default userRouter
