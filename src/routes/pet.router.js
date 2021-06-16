import * as express from "express"
import { checkAuthentication } from "../middlewares/auth.middleware.js"
import { create, update, read, remove, list } from "../controllers/pet.controller.js"

const petRouter = express.Router()

petRouter
    .get("/", list) // List all pets
    .post("/", checkAuthentication, create) // Create a new pet, needs logged in user
    .get("/:id", checkAuthentication, read) // Read a pet by id
    .put("/:id", checkAuthentication, update) // Update a pet by id, needs logged in user 
    .delete("/:id", checkAuthentication, remove) // Delete a oet by id, needs logged in user 

export default petRouter
