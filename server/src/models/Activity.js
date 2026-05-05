import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task"
    },
    taskTitle: {
      type: String,
      default: "Task",
      trim: true
    },
    action: {
      type: String,
      enum: ["created", "updated", "completed", "deleted"],
      required: true
    },
    category: {
      type: String,
      default: "Uncategorized",
      trim: true
    }
  },
  { timestamps: true }
);

export const Activity = mongoose.model("Activity", activitySchema);
