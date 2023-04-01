import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { db_url } from "./config/server.config";
import { green, red } from "chalk";
import router from "./routes";

mongoose
  .connect(db_url)
  .then(() => console.log(`${green("[Database]")} Connection established!`))
  .catch((err) => console.log(`${red("[Database]")} Connection failed: `, err));

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
