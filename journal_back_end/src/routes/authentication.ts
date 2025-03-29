import { Router } from "express";
import { singUp, login, me, refreshToken, logout} from "../controllers/authentication";
import { isAuthenticated } from "../middlewares/authentication";

const router = Router();

router.post("/signUp", singUp);
router.post("/login", login);
router.get("/me", isAuthenticated, me);
router.post("/token", refreshToken);
router.post("/logout", logout);

export default router;