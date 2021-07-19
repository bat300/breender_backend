import * as express from "express"
import { checkPlanStatus, updateUser } from "../controllers/subscription.controller.js";
import { checkAuthentication } from "../middlewares/auth.middleware.js"

const subscriptionRouter = express.Router()

subscriptionRouter.post("/update", checkAuthentication, updateUser); //update user subscription plan

export default subscriptionRouter
