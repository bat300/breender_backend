"use strict";
import * as express from "express";
const petRouter = express.Router();

import { getPets } from "../controllers/pet.controller.js";


petRouter.get("/search", getPets)

export default petRouter;