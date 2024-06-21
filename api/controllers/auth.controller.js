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
  try {
    const validUser = await User.findOne({ email });
    if (!email && !password)
      return next(errorHandler(400, "Please fill your information below :"));
    if (!validUser)
      return next(errorHandler(404, "User does't exist, Please try again!"));
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword)
      return next(
        errorHandler(401, "Your password is incorrect, Please try again!")
      );
    const { password: pass, ...rest } = validUser._doc;
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);

      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });

      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
