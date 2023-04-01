import User from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwt_secret } from "../config/server.config";

export const signUpHandler = async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  try {
    const errors = {};
    if (!email) errors.email = "Email is required.";
    if (!password) errors.password = "Password is required.";
    if (password.length < 8 || password.length > 20)
      errors.password = "Password must be between 8 and 20 characters.";

    if (Object.keys(errors).length) return res.status(422).json({ errors });
    const userInDb = await User.findOne({ email });

    if (userInDb) errors.email = "Email already in use.";

    if (password !== confirmPassword) errors.password = "Passwords must match.";

    if (Object.keys(errors).length) return res.status(422).json({ errors });
    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({ email, passwordHash });

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const signInHandler = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const userInDb = await User.findOne({ email });

    const passwordsMatch = !userInDb
      ? false
      : await bcrypt.compare(password, userInDb.passwordHash);

    if (!passwordsMatch)
      return res
        .status(422)
        .json({ errors: { email: "Invalid email/password." } });

    const tokenUser = { email, uid: userInDb._id };

    const token = jwt.sign(tokenUser, jwt_secret);

    res.json({ token, user: tokenUser });
  } catch (error) {
    next(error);
  }
};
