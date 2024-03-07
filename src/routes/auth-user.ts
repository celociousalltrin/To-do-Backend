import { Router } from "express";
import { createuser, login } from "../controllers/authUserController";

const router = Router();

router.post("/create-user", createuser);

router.post("/login", login);

export default router;
