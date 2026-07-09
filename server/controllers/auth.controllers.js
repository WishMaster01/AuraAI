import bcrypt from "bcryptjs";
import generateToken from "../configs/token.js";
import prisma from "../configs/prisma.js";
import { serializeUser, userInclude } from "../utils/userSerializers.js";

const getCookieOptions = () => ({
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  sameSite: process.env.COOKIE_SAME_SITE || "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
});

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "PASSWORD MUST BE AT LEAST 6 CHARACTERS!" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existEmail = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });

    if (existEmail) {
      return res.status(400).json({ message: "EMAIL ALREADY EXISTS!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: String(name).trim(),
        email: normalizedEmail,
        password: hashedPassword,
      },
      include: userInclude,
    });

    const token = await generateToken(user.id);
    res.cookie("token", token, getCookieOptions());

    return res.status(201).json(serializeUser(user));
  } catch (error) {
    console.error("Signup failed:", error);
    return res.status(500).json({ message: "Signup failed." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await prisma.user.findUnique({
      where: { email: String(email).trim().toLowerCase() },
      include: userInclude,
    });

    if (!user) {
      return res.status(400).json({ message: "EMAIL DOES NOT EXISTS!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "INCORRECT PASSWORD!" });
    }

    const token = await generateToken(user.id);
    res.cookie("token", token, getCookieOptions());

    return res.status(200).json(serializeUser(user));
  } catch (error) {
    console.error("Login failed:", error);
    return res.status(500).json({ message: "Login failed." });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: process.env.COOKIE_SAME_SITE || "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    return res.status(200).json({ message: "LOGOUT SUCCESSFULLY!" });
  } catch (error) {
    return res.status(500).json({ message: "Logout failed." });
  }
};
