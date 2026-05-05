import { Router } from "express";
import {
  createTask,
  createDemoTasks,
  deleteTask,
  getTasks,
  updateTask
} from "../controllers/task.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect);
router.get("/", getTasks);
router.post("/demo", createDemoTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
