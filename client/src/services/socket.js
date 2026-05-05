import { io } from "socket.io-client";
import { setInsights } from "../store/insightSlice.js";
import { setTasks } from "../store/taskSlice.js";

let socket;

export const connectSocket = (token, dispatch, onUpdate) => {
  if (!token) return null;

  if (socket?.connected) {
    return socket;
  }

  socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
    auth: { token },
    transports: ["websocket"]
  });

  socket.on("dashboard:update", (data) => {
    dispatch(setTasks(data.tasks));
    dispatch(setInsights(data.insights));
    onUpdate?.(data);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
};
