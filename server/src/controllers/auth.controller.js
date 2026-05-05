import { User } from "../models/User.js";
import { createToken } from "../utils/token.js";

const sendAuthResponse = (res, user, statusCode = 200) => {
  res.status(statusCode).json({
    token: createToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
};

export const register = async (req, res, next) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password?.trim();

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Name, email and password are required");
    }

    if (password.length < 6) {
      res.status(400);
      throw new Error("Password must be at least 6 characters");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409);
      throw new Error("User already exists with this email");
    }

    const user = await User.create({ name, email, password });
    sendAuthResponse(res, user, 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password?.trim();

    if (!email || !password) {
      res.status(400);
      throw new Error("Email and password are required");
    }

    const user = await User.findOne({ email });
    const passwordMatches = user ? await user.matchPassword(password) : false;
    const legacyPlainPasswordMatches = user?.password === password;

    if (!user || (!passwordMatches && !legacyPlainPasswordMatches)) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    if (legacyPlainPasswordMatches) {
      user.password = password;
      await user.save();
    }

    sendAuthResponse(res, user);
  } catch (error) {
    next(error);
  }
};
