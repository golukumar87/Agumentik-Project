import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { User } from "./models/User.js";
import { Task } from "./models/Task.js";
import { sortBySmartPriority } from "./utils/priority.js";
import { buildInsights } from "./services/insight.service.js";

let io;

const normalizeTask = (task) => task.toObject({ virtuals: true });
const workspaceRoom = "workspace:tasks";

export const initSocket = (server, clientUrl) => {
  io = new Server(server, {
    cors: {
      origin: clientUrl,
      credentials: true
    }
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) throw new Error("Socket authentication token missing");

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select("_id name email");
      if (!user) throw new Error("Socket user not found");

      socket.user = user;
      next();
    } catch (error) {
      next(error);
    }
  });

  io.on("connection", (socket) => {
    socket.join(workspaceRoom);
    socket.emit("socket:ready", { userId: socket.user._id.toString() });
  });

  return io;
};

export const emitDashboardUpdate = async (eventType, payload = {}) => {
  if (!io) return;

  const tasks = await Task.find().populate("owner", "name email");
  const insights = await buildInsights();

  io.to(workspaceRoom).emit("dashboard:update", {
    eventType,
    payload,
    tasks: sortBySmartPriority(tasks.map(normalizeTask)),
    insights,
    serverTime: new Date().toISOString()
  });
};
