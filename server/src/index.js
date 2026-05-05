import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.routes.js";
import insightRoutes from "./routes/insight.routes.js";
import taskRoutes from "./routes/task.routes.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";
import { initSocket } from "./socket.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const clientUrls = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);
const allowedOrigins = [...new Set([...clientUrls, "http://localhost:5173", "http://localhost:5174"])];
const server = http.createServer(app);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "productivity-management-server" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/insights", insightRoutes);
app.use(notFound);
app.use(errorHandler);

connectDB().then(() => {
  initSocket(server, allowedOrigins);

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});
