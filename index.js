import express from "express";
import cors from "cors";
import "dotenv/config";
import { dbConnect } from "./database/dbConnect.js";
import { login, register } from "./controllers/userController.js";
import cookieParser from "cookie-parser";

const app = express();
dbConnect();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Working");
});

app.post("/api/v1/register", register);
app.post("/api/v1/login", login);

app.listen(process.env.PORT, () => {
  console.log(`Server running at ${process.env.PORT}`);
});
