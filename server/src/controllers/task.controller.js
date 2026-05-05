import { Task } from "../models/Task.js";
import { emitDashboardUpdate } from "../socket.js";
import { logActivity } from "../services/insight.service.js";
import { sortBySmartPriority } from "../utils/priority.js";

const normalizeTask = (task) => task.toObject({ virtuals: true });

export const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find().populate("owner", "name email");
    res.json(sortBySmartPriority(tasks.map(normalizeTask)));
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { title, description, category, status, deadline } = req.body;

    if (!title || !description || !category || !deadline) {
      res.status(400);
      throw new Error("Title, description, category and deadline are required");
    }

    const task = await Task.create({
      title,
      description,
      category,
      status,
      deadline,
      owner: req.user._id
    });
    await task.populate("owner", "name email");

    const normalizedTask = normalizeTask(task);
    await logActivity({ owner: req.user._id, task: task._id, taskTitle: task.title, action: "created", category: task.category });
    await emitDashboardUpdate("task:created", { task: normalizedTask });

    res.status(201).json(normalizedTask);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    const previousStatus = task.status;
    const allowedFields = ["title", "description", "category", "status", "deadline"];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });

    const updatedTask = await task.save();
    await updatedTask.populate("owner", "name email");
    const action = previousStatus !== "Completed" && updatedTask.status === "Completed" ? "completed" : "updated";
    const normalizedTask = normalizeTask(updatedTask);

    await logActivity({
      owner: req.user._id,
      task: updatedTask._id,
      taskTitle: updatedTask.title,
      action,
      category: updatedTask.category
    });
    await emitDashboardUpdate("task:updated", { task: normalizedTask });

    res.json(normalizedTask);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    await logActivity({ owner: req.user._id, task: task._id, taskTitle: task.title, action: "deleted", category: task.category });
    await emitDashboardUpdate("task:deleted", { id: req.params.id });

    res.json({ message: "Task deleted successfully", id: req.params.id });
  } catch (error) {
    next(error);
  }
};

export const createDemoTasks = async (req, res, next) => {
  try {
    const now = Date.now();
    const samples = [
      {
        title: "Finish overdue API review",
        description: "Review protected routes, persistence and error handling before submission.",
        category: "Backend",
        status: "Pending",
        deadline: new Date(now - 2 * 60 * 60 * 1000),
        owner: req.user._id
      },
      {
        title: "Polish responsive dashboard",
        description: "Check mobile spacing, filters and task cards for final demo recording.",
        category: "Frontend",
        status: "In Progress",
        deadline: new Date(now + 6 * 60 * 60 * 1000),
        owner: req.user._id
      },
      {
        title: "Record project demo",
        description: "Explain modules, architecture, real-time updates and productivity insights.",
        category: "Submission",
        status: "Pending",
        deadline: new Date(now + 30 * 60 * 60 * 1000),
        owner: req.user._id
      }
    ];

    const createdTasks = await Task.insertMany(samples);
    await Promise.all(
      createdTasks.map((task) =>
        logActivity({ owner: req.user._id, task: task._id, taskTitle: task.title, action: "created", category: task.category })
      )
    );
    await emitDashboardUpdate("demo:created", { count: createdTasks.length });

    const tasks = await Task.find().populate("owner", "name email");
    res.status(201).json(sortBySmartPriority(tasks.map(normalizeTask)));
  } catch (error) {
    next(error);
  }
};
