import express from "express";
import User from "../models/userModel.js";

export const searchUsers = async (req, res, next) => {
 const query = req.query.q; // Arama terimi
 try {
  const users = await User.find({
   $or: [
    { firstName: { $regex: query, $options: "i" } }, // Büyük/küçük harf duyarsız arama
    { lastName: { $regex: query, $options: "i" } },
   ],
  }).select("firstName lastName picturePath location");

  res.status(200).json({
   result: users.length,
   data: users,
  });
 } catch (error) {
  res.status(500).json({ message: "Arama işlemi sırasında bir hata oluştu." });
 }
};

export const getUser = async (req, res, next) => {
 try {
  const user = await User.findById(req.params.id);
  res.status(200).json(user);
 } catch (err) {
  res.status(404).json({ msg: err.message });
 }
};

export const getUserFriends = async (req, res, next) => {
 try {
  const { id } = req.params;
  const user = await User.findById(id).populate("friends");
  res.status(200).json(user.friends);
 } catch (err) {
  res.status(404).json({ message: err.message });
 }
};

export const addRemoveFriend = async (req, res) => {
 try {
  const user = await User.findById(req.params.id);
  const friend = await User.findById(req.params.friendId);

  if (user.friends.includes(friend._id)) {
   user.friends = user.friends.filter((fri) => {
    fri._id !== friend._id;
   });
   friend.friends = friend.friends.filter((fri) => {
    fri._id !== user._id;
   });
  } else {
   user.friends.push(friend._id);
   friend.friends.push(user._id);
  }

  await user.save();
  await friend.save();

  const friends = await Promise.all(
   user.friends?.map((friendId) => User.findById(friendId))
  );

  const formattedFriends = friends.map(
   ({ _id, firstName, lastName, occupation, location, picturePath }) => {
    return { _id, firstName, lastName, occupation, location, picturePath };
   }
  );

  res.status(200).json(formattedFriends);
 } catch (err) {
  res.status(404).json({ msg: err.message });
 }
};
