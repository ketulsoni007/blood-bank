import { Router } from "express";
import userAuth from "../middlewares/authMiddleware.js";
import { getdonarlistController,deletedonarController,getorganisationlistController,deleteorganisationController,gethospitallistController,deletehospitalController } from "../controller/adminController.js";
import adminAuth from "../middlewares/adminMiddleware.js";

const adminRouter = Router();

adminRouter.get("/donar-list",userAuth,adminAuth,getdonarlistController);
adminRouter.get("/organisation-list",userAuth,adminAuth,getorganisationlistController);
adminRouter.get("/hospital-list",userAuth,adminAuth,gethospitallistController);
adminRouter.delete("/donar/:id",userAuth,adminAuth,deletedonarController);
adminRouter.delete("/hospital/:id",userAuth,adminAuth,deletehospitalController);
adminRouter.delete("/organisation/:id",userAuth,adminAuth,deleteorganisationController);

export default adminRouter;