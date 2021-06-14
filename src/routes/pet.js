"use strict";
import * as express from "express";
const router = express.Router();

import getPets from "../controllers/pet.js";


router.get("/search", getPets)

export default router;