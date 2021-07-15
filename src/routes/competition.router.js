import * as express from "express"
import { getDocs, verify, decline } from "../controllers/competition.controller.js"


const competitionRouter = express.Router()
competitionRouter.get("/",getDocs) // get all unverified documents
competitionRouter.post("/verify",verify) // verify document
competitionRouter.post("/decline",decline) // decline document


export default competitionRouter