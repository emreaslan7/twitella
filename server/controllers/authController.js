import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const register = async (req, res) => {
 try {
  const result = await cloudinary.uploader.upload(
   req.files.picturePath.tempFilePath,
   {
    use_filename: true,
    folder: "twitella",
   }
  );

  const {
   firstName,
   lastName,
   email,
   password,
   picturePath,
   friends,
   location,
   occupation,
  } = req.body;

  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = new User({
   firstName,
   lastName,
   email,
   password: passwordHash,
   picturePath: result.secure_url,
   friends,
   location,
   occupation,
   viewedProfile: Math.floor(Math.random() * 1000),
   impressions: Math.floor(Math.random() * 1000),
  });
  const savedUser = await newUser.save();

  fs.unlinkSync(req.files.picturePath.tempFilePath);
  if (req.files) {
   fs.unlinkSync(req.files.picture.tempFilePath);
  }
  res.status(201).json(savedUser);
 } catch (err) {
  res.status(500).json({ error: err });
 }
};

export const login = async (req, res) => {
 try {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) return res.status(400).json({ msg: "User does not exist" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: "Password is incorrect" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  delete user.password;
  res.status(200).json({ token, user });
 } catch (err) {
  res.status(500).json({ error: err.massage });
 }
};
