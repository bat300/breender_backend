"use strict";
import * as express from "express";
const petRouter = express.Router();

import { getPets, addPet } from "../controllers/pet.controller.js";


petRouter.get("/search", getPets)
petRouter.get("/add", addPet)

export default petRouter;