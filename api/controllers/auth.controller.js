import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const userByUsername = await User.findOne({ username: username });
  const userByEmail = await User.findOne({ email: email });
  try {
    if (userByUsername && userByEmail) {
      return next(errorHandler(409, "Username and email already exist"));
    } else if (userByUsername) {
      return next(errorHandler(409, "Username already exist"));
    } else if (userByEmail) {
      return next(errorHandler(409, "Email already exist"));
    }
    if (!username && !email && !password)
      return next(errorHandler(400, "Please fill your information below :"));

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json("User create successfull");
  } catch (error) {
    // next(errorHandler(409, "User is already exist, Please try another."));
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found!"));
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong Credentials!"));
    const { password: pass, ...rest } = validUser._doc;
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    console.log(token);
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};
