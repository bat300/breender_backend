import * as express from "express"
import { checkAuthentication } from "../middlewares/auth.middleware.js"
import { create, read, remove, list } from "../controllers/conversation.controller.js"

const conversationRouter = express.Router()

// TODO: Add Auth
conversationRouter
    .get("/:userId", list) // List all conversations, needs logged in user
    .post("/", create) // Create a new conversations, needs logged in user
    .get("/find/:firstUserId&:secondUserId", read) // Read a conversation, needs logged in user
    .delete("/:id", remove) // Delete a conversations by id, needs logged in user

export default conversationRouter
