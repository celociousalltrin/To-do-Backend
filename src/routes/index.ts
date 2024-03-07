import { Router, Request, Response, NextFunction } from "express";
import path from "path";
import authUserRouter from "./auth-user";
import taskRouter from "./task";
import { authUserMiddleware } from "../middlewares/auth.user.middleware";

const router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

router.use("/auth", authUserRouter);
router.use("/task", authUserMiddleware, taskRouter);

export default router;
