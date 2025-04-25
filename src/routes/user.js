import Router from "express";
import { createUser , getListUser} from "../controllers/userController.js";

const router = Router();

router.post("/user", createUser);
router.get("/user", getListUser);

export default router;
