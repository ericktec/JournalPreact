import { Router } from "express";
import { getAUserIfAuth } from "../controllers/users";
import { isAuthenticated } from "../middlewares/authentication";

const router = Router();

router.get("/getUser", isAuthenticated, getAUserIfAuth);

export default router;