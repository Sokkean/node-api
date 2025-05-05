import Router from "express";
import { createUser , getListUser ,login} from "../controllers/userController.js";

const router = Router();

router.post("/user", createUser);
router.get("/user", getListUser);
//login route
router.post("/login", login);

export default router;
