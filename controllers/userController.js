import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ status: 400, success: false, message: "User already exist!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(200).json({
      status: 200,
      success: true,
      message: "New User Created!",
      data: newUser,
    });
  } catch (error) {
    console.log("Error while registering user", error);
    return res
      .status(500)
      .json({ status: 500, success: false, message: error?.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "All fields required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "User not found...",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Incorrect Password",
      });
    }

    const { accessToken, refreshToken } = await generateToken(user._id);

    if (!accessToken || !refreshToken) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Tokens could'nt be generated",
      });
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("access-token", accessToken, options)
      .cookie("refresh-token", refreshToken, options)
      .json({
        status: 200,
        success: true,
        message: "User login success",
        data: { accessToken, refreshToken },
      });
  } catch (error) {
    console.log("Login Error", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Error while logging in the user",
      data: error?.messageS,
    });
  }
};
