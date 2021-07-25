import * as express from "express"
import { checkAuthentication } from "../middlewares/auth.middleware.js"
import { list, read, update, getReviewsOnUser, createReview } from "../controllers/user.controller.js"

const userRouter = express.Router()

userRouter
    .get("/pets/:ownerId", checkAuthentication, list) // List all pets of a user 
    .get("/:id/reviews", checkAuthentication, getReviewsOnUser) // get users reviews
    .put("/:id", checkAuthentication, update) // Update a user by id, needs logged in user 
    .get("/:id", checkAuthentication, read) // get user
    .post("/add-review", checkAuthentication, createReview) // Create a new review, needs logged in user


export default userRouter
