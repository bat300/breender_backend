import * as express from "express"
import { checkAuthentication } from "../middlewares/auth.middleware.js"
import { list, read, update } from "../controllers/user.controller.js"

const userRouter = express.Router()

userRouter
    .get("/pets/:ownerId", list) // List all pets of a user TODO add authentication
    .put("/:id", checkAuthentication, update) // Update a user by id, needs logged in user 
    .get("/:id", read); // get user TODO Add authentication check


export default userRouter
