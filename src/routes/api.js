// routes/user.js
import { Router } from "express";
import UserController from "../controllers/registerController.js";

const router = Router();

router.post("/register", UserController.registerUser);
router.get("/register", UserController.getUsers);
router.put("/register", UserController.updateUser);


export default router;
