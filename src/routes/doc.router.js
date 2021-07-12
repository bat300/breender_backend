import * as express from "express"
import { getDocs, verify } from "../controllers/doc.controller.js"


const docRouter = express.Router()
docRouter.get("/",getDocs) // get all unverified documents
docRouter.get("/id",verify) // verify document


export default docRouter