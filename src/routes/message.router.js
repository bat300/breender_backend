import * as express from "express"
import { checkAuthentication } from "../middlewares/auth.middleware.js"
import { create, list } from "../controllers/message.controller.js"

const messageRouter = express.Router()

messageRouter
    .post("/", create) // Create a new message, needs logged in user
    .get("/:conversationId", list) // Read a message by id, needs logged in user

export default messageRouter
