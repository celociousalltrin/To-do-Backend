import { Router } from "express";
const router = Router();
import {
  createTask,
  getUserTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController";

router.get("/get-user-task", getUserTask);
router.post("/create-task", createTask);
router.put("/update-task/:id", updateTask);
router.put("/delete-task/:id", deleteTask);

export default router;
