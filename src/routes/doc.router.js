import * as express from "express"
import { checkAuthentication, checkIsAdmin } from "../middlewares/auth.middleware.js"
import { getDocs, verify, decline } from "../controllers/doc.controller.js"


const docRouter = express.Router()
docRouter.get("/", checkAuthentication, checkIsAdmin, getDocs) // get all unverified documents
docRouter.post("/verify", checkAuthentication, checkIsAdmin, verify) // verify document
docRouter.post("/decline", checkAuthentication, checkIsAdmin, decline) // decline document


export default docRouter