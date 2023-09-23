import { Router } from "express";
import userAuth from "../middlewares/authMiddleware.js";
import { createInventoryController,getInventoryController,getDonarController,getHospitalController,getOrganisationController,getOrganisationForHospitalController,getInventoryHospitalController, getRecentInventoryController } from "../controller/inventoryController.js";

const inventoryRoutes = Router();

inventoryRoutes.post("/create-inventory",userAuth,createInventoryController);
inventoryRoutes.get("/get-inventory",userAuth,getInventoryController);
inventoryRoutes.get("/get-donars",userAuth,getDonarController);
inventoryRoutes.get("/get-hospitals",userAuth,getHospitalController);
inventoryRoutes.get("/get-organisation",userAuth,getOrganisationController);
inventoryRoutes.get("/get-org-hospital",userAuth,getOrganisationForHospitalController);
inventoryRoutes.post("/get-inventory-hospital",userAuth,getInventoryHospitalController);
inventoryRoutes.get("/get-recent-inventory",userAuth,getRecentInventoryController);

export default inventoryRoutes;