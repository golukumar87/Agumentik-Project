import { buildInsights } from "../services/insight.service.js";

export const getInsights = async (req, res, next) => {
  try {
    const insights = await buildInsights();
    res.json(insights);
  } catch (error) {
    next(error);
  }
};
