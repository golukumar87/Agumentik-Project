import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const protect = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    res.status(401);
    return next(new Error("Authentication token missing"));
  }

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      res.status(401);
      return next(new Error("User no longer exists"));
    }

    req.user = user;
    next();
  } catch (_error) {
    res.status(401);
    next(new Error("Invalid or expired token"));
  }
};
