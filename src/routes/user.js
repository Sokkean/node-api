import Router from "express";
import { createUser, getListUser, login } from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js"; 


const router = Router();

router.post("/user", createUser);
router.get("/user", authMiddleware, getListUser);
//login route
router.post("/login", login);

export default router;
