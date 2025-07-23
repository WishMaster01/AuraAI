import generateToken from "../configs/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existEmail = await User.findOne({ email });

    if (existEmail) {
      return res.status(400).json({ message: "EMAIL ALREADY EXISTS!" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "PASSWORD MUST BE AT LEAST 6 CHARACTERS!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      password: hashedPassword,
      email,
    });

    const token = await generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: true,
    });

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: `SIGN UP ERROR OCCURED: ${error}` });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "EMAIL DOES NOT EXISTS!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "INCORRECT PASSWORD!" });
    }

    const token = await generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: true,
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `LOGIN ERROR OCCURED: ${error}` });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "LOGOUT SUCCESSFULLY!" });
  } catch (error) {
    return res.status(500).json({ message: `LOGOUT ERROR OCCURED: ${error}` });
  }
};
