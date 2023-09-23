import { Router } from "express";
import { registerController,loginController,currentUserController } from "../controller/authController.js";
import userAuth from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/register",registerController)
router.post("/login",loginController)
router.get("/current-user",userAuth,currentUserController)

export default router;