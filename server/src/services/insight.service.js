import { Activity } from "../models/Activity.js";
import { Task } from "../models/Task.js";

const startOfToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

export const logActivity = async ({ owner, task, taskTitle, action, category }) => {
  await Activity.create({
    owner,
    task,
    taskTitle: taskTitle || "Task",
    action,
    category: category || "Uncategorized"
  });
};

export const buildInsights = async () => {
  const today = startOfToday();

  const [
    totalTasks,
    completedTasks,
    pendingTasks,
    overdueTasks,
    dailyActivityCount,
    completedToday,
    categoryStats,
    completedByUser,
    recentActivities
  ] =
    await Promise.all([
      Task.countDocuments(),
      Task.countDocuments({ status: "Completed" }),
      Task.countDocuments({ status: { $ne: "Completed" } }),
      Task.countDocuments({ status: { $ne: "Completed" }, deadline: { $lt: new Date() } }),
      Activity.countDocuments({ createdAt: { $gte: today } }),
      Activity.countDocuments({ action: "completed", createdAt: { $gte: today } }),
      Task.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 }, completed: { $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] } } } },
        { $sort: { count: -1, _id: 1 } }
      ]),
      Activity.aggregate([
        { $match: { action: "completed" } },
        { $group: { _id: "$owner", completed: { $sum: 1 } } },
        { $sort: { completed: -1 } },
        { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
        { $unwind: "$user" },
        { $project: { _id: 0, userId: "$user._id", name: "$user.name", email: "$user.email", completed: 1 } }
      ]),
      Activity.find()
        .sort({ createdAt: -1 })
        .limit(8)
        .populate("owner", "name email")
        .lean()
    ]);

  const mostActiveCategory = categoryStats[0]?._id || "No category yet";

  return {
    totals: {
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks
    },
    activity: {
      dailyActivityCount,
      completedToday
    },
    categoryDistribution: categoryStats.map((item) => ({
      category: item._id,
      count: item.count,
      completed: item.completed
    })),
    completedByUser,
    recentActivities: recentActivities.map((item) => ({
      id: item._id,
      action: item.action,
      taskTitle: item.taskTitle,
      category: item.category,
      createdAt: item.createdAt,
      user: item.owner ? { name: item.owner.name, email: item.owner.email } : null
    })),
    productivityInsights: {
      completedTodayText:
        completedToday === 1 ? "You completed 1 task today" : `You completed ${completedToday} tasks today`,
      mostActiveCategory
    }
  };
};
