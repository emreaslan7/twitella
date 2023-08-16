import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postsRoutes from "./routes/postsRoutes.js";
import { register } from "./controllers/authController.js";
import * as postsController from "./controllers/postsController.js";
import { verifyToken } from "./middleware/auth.js";
// image imports
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";

// CONFIGURATION ----------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

cloudinary.config({
 cloud_name: process.env.CLOUD_NAME,
 api_key: process.env.CLOUD_API_KEY,
 api_secret: process.env.CLOUD_API_SECRET,
});

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
// app.use("/assets", express.static(path.join(__dirname, "/public/assets")));
app.use(fileUpload({ useTempFiles: true }));

// FILE STORAGE ----------------------------------------------------------------
// const storage = multer.diskStorage({
//  destination: function (req, file, cb) {
//   cb(null, "/public/assets");
//  },
//  filename: function (req, file, cb) {
//   cb(null, file.originalname);
//  },
// });
// const upload = multer({ storage });

// ROUTES WITH FILE --------------------------------------------------------------
app.post("/auth/register", register);
app.post("/posts", verifyToken, postsController.createPost);

// ROUTES -----------------------------------------------------------------------
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postsRoutes);

// MONGOOSE SETUP ----------------------------------------------------------------
const PORT = process.env.PORT || 6001;
mongoose
 .connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
 })
 .then(() => {
  app.listen(PORT, () => {
   console.log(`Server is listening on ${PORT}`);
  });
 })
 .catch((err) => console.log(`Server error: ${err}`));
