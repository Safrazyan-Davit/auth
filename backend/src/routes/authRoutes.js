import express from "express";
import {
    register,
    login,
    refresh,
    logout,
    me,
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

router.use(authMiddleware);

router.get("/me", me);






export default router;