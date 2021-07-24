import * as express from "express"
import { checkAuthentication } from "../middlewares/auth.middleware.js"
import { create, list, updateManyToSeen, listUnseen } from "../controllers/message.controller.js"

const messageRouter = express.Router()

// TODO: Add Auth
messageRouter
    .post("/", checkAuthentication, create) // Create a new message, needs logged in user
    .get("/:conversationId", checkAuthentication, list) // Read a messages by conversation id, needs logged in user
    .get("/unseen/:userId", listUnseen) // Read a messages by conversation id, needs logged in user
    .put("/", checkAuthentication, updateManyToSeen) // Update messages to seen from id array, needs logged in user

export default messageRouter
