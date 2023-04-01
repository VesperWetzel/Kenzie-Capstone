import jwt from "jsonwebtoken";
import { jwt_secret } from "../config/server.config";
import User from "../models/user.model";

const requireAuth = async (req, res, next) => {
  try {
    const auth = req.get("authorization");

    if (!auth) return res.status(401).json({ error: "Unauthorized" });

    const token = auth.replace("Bearer ", "");

    jwt.verify(token, jwt_secret, (err, payload) => {
      if (err) return res.status(401).json({ error: "Unauthorized" });

      User.findById(payload.uid)
        .then((user) => {
          if (!user) return res.status(401).json({ error: "Unauthorized" });

          req.user = user;

          next();
        })
        .catch((err) => next(err));
    });
  } catch (error) {
    next(error);
  }
};

export default requireAuth;
