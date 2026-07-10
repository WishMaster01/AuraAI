import { resolveAuthenticatedUser } from "../services/authContext.service.js";

const isAuth = async (req, res, next) => {
  try {
    const authContext = await resolveAuthenticatedUser(req);
    if (!authContext?.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.userId = authContext.user.id;
    req.user = authContext.user;
    req.authProvider = authContext.provider;
    req.clerkUserId = authContext.clerkUserId;

    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export default isAuth;
