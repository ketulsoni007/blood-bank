import { Router } from "express";
import userAuth from "../middlewares/authMiddleware.js";
import { bloodGroupDetailController } from "../controller/analyticController.js";

const analyticRoutes = Router();

analyticRoutes.get("/get-donars",userAuth,bloodGroupDetailController);

export default analyticRoutes;