import * as express from "express"
import { checkAuthentication, checkIsAdmin } from "../middlewares/auth.middleware.js"
import { create, update, read, remove, listFoUser, listForAdmin } from "../controllers/transaction.controller.js"

const transactionRouter = express.Router()

transactionRouter
    .get("/", checkAuthentication, listFoUser) // List all transactions for the user
    .post("/", checkAuthentication, create) // Create a new transaction, needs logged in user
    .get("/all", checkAuthentication, checkIsAdmin, listForAdmin) // List all transactions for the user
    .get("/:id", checkAuthentication, read) // Read a transaction by id
    .put("/:id", checkAuthentication, update) // Update a transaction by id, needs logged in user 
    .delete("/:id", checkAuthentication, remove) // Delete a transaction by id, needs logged in user 


export default transactionRouter
