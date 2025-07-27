import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  console.log("JWT Secret being used:", process.env.JWT_SECRET);
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({ message: "TOKEN NOT FOUND!!" });
    }

    const verifyToken = await jwt.verify(token, process.env.JWT_SECRET);

    req.userId = verifyToken.userId;

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "isAuth ERROR OCCURED!" });
  }
};

export default isAuth;
