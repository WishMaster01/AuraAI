import { isAllowedOrigin } from "../configs/origins.js";

const corsGuard = (req, res, next) => {
  const origin = req.headers.origin;

  if (origin && !isAllowedOrigin(origin)) {
    return res.status(403).json({ message: "CORS origin denied." });
  }

  return next();
};

export default corsGuard;

