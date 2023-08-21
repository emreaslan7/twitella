import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from '@mui/icons-material';
import { Box, Divider, IconButton, Typography, useTheme } from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import Friend from 'components/Friend';
import WidgetWrapper from 'components/WidgetWrapper';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import state, { setPost, setPostWithComments } from 'state';
import CommentsWidget from './CommentsWidget';
import createdTimeConvert from 'utils/createdTimeConvert.js';
import MyCommentWidget from './MyCommentWidget';

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  createdAt,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [timeAgo, setTimeAgo] = useState(null);
  const dispatch = useDispatch();
  // const posts = useSelector((state) => state.posts);
  // const post = posts.find((post) => post._id === postId);
  // const postComments = post.comments;
  const postComments = useSelector((state) => state.postWithComments);
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(
      `https://twitella-api.vercel.app/posts/${postId}/like`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      },
    );
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const getPostComments = async () => {
    const response = await fetch(
      `https://twitella-api.vercel.app/posts/${postId}/comments`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const postComments = await response.json();
    dispatch(setPostWithComments({ allComments: postComments }));
  };

  const handleShowComments = () => {
    if (!isComments) {
      getPostComments();
    }
    setIsComments(!isComments);
  };
  useEffect(() => {
    setTimeAgo(createdTimeConvert(createdAt));
  }, []); //eslint-disable
  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
        timeAgo={timeAgo}
      />
      <Typography color={main} sx={{ mt: '1rem' }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: '0.75rem', marginTop: '0.75rem' }}
          src={`${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => handleShowComments()}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments?.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          {postComments?.map((comment, i) => (
            <CommentsWidget comment={comment} key={comment._id} />
          ))}
          <Divider />
          <MyCommentWidget picturePath={userPicturePath} postId={postId} />
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
