import Comment from "../models/commentModel.js";
import Post from "../models/postModel.js";
import User from "../models/userModel.js";

export const postComment = async (req, res) => {
 try {
  const { id } = req.params;
  const { text } = req.body;

  const post = await Post.findById(id);
  console.log(post);
  const newComment = new Comment({
   user: req.user.id, // Yorumu yapan kullanıcının ID'si
   post: id, // Yorumun yapıldığı gönderinin ID'si
   text: text,
   likes: {},
  });

  await newComment.save();

  // Yorumu gönderiye ekleyin
  post.comments.push(newComment._id); // Yorum ID'sini ekleyin
  await post.save();

  res.status(201).json(newComment);
 } catch (err) {
  res.status(409).json({ msg: err.message });
 }
};

export const getPostComments = async (req, res) => {
 try {
  const post = await Post.findById(req.params.id).populate("comments");

  if (!post) {
   console.log("Gönderi bulunamadı");
   return null;
  }

  // Yorumlardan kullanıcı referanslarını toplar
  const userReferences = post.comments.map((comment) => comment.user);

  // Kullanıcı referanslarını doldurur
  const populatedUsers = await User.find({ _id: { $in: userReferences } });

  // Her yorumun kullanıcısıyla birlikte tamamlanmış bir nesne olarak doldurulur
  const commentsWithUsers = post.comments.map((comment) => {
   const populatedUser = populatedUsers.find((user) =>
    user._id.equals(comment.user)
   );
   return {
    text: comment.text,
    likes: comment.likes,
    createdAt: comment.createdAt,
    post: comment.post,
    _id: comment._id,
    user: {
     firstName: populatedUser.firstName,
     lastName: populatedUser.lastName,
     picturePath: populatedUser.picturePath,
    },
   };
  });

  res.status(200).json(commentsWithUsers);
 } catch (err) {
  console.error("Gönderi alınırken bir hata oluştu:", err);
  res.status(409).json({ msg: err.message });
 }
};

export const likeComment = async (req, res) => {
 try {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);
  const commentUser = await User.findById(
   comment.user,
   "firstName lastName picturePath"
  );
  const isLiked = comment.likes.get(req.user.id);
  if (isLiked) {
   comment.likes.delete(req.user.id);
  } else {
   comment.likes.set(req.user.id, true);
  }

  comment.user = commentUser;

  // const updatedComment = await Comment.findByIdAndUpdate(
  //  commentId,
  //  { likes: comment.likes },
  //  { new: true }
  // );
  const updatedComment = await comment.save();

  console.log(updatedComment);
  res.status(200).json(updatedComment);
 } catch (err) {
  res.status(404).json({ msg: err.message });
 }
};
