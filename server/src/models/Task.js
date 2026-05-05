import mongoose from "mongoose";
import { calculatePriorityScore, getPriorityLevel } from "../utils/priority.js";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 120
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: 1000
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      maxlength: 80
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending"
    },
    deadline: {
      type: Date,
      required: [true, "Deadline is required"]
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

taskSchema.virtual("priorityScore").get(function priorityScore() {
  return calculatePriorityScore(this.deadline, this.status);
});

taskSchema.virtual("priorityLevel").get(function priorityLevel() {
  return getPriorityLevel(calculatePriorityScore(this.deadline, this.status), this.status);
});

taskSchema.virtual("isOverdue").get(function isOverdue() {
  return this.status !== "Completed" && new Date(this.deadline).getTime() < Date.now();
});

export const Task = mongoose.model("Task", taskSchema);
