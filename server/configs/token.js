import jwt from "jsonwebtoken";

const generateToken = async (userId) => {
  try {
    console.log("JWT Secret used for SIGNING:", process.env.JWT_SECRET); // <<< Add this line
    const token = await jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return token;
  } catch (error) {
    console.log(error);
  }
};

export default generateToken;
