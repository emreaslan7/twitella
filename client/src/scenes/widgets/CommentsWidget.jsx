import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider, useTheme, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import UserImage from 'components/UserImage';
import FlexBetween from 'components/FlexBetween';
import {
  FavoriteBorderOutlined,
  FavoriteOutlined,
  MoreVertOutlined,
} from '@mui/icons-material';
import createdTimeConvert from 'utils/createdTimeConvert.js';
import { setPostCommentLike } from 'state';

const CommentsWidget = ({ comment }) => {
  console.log(comment);
  const [timeAgo, setTimeAgo] = useState(null);
  const dispatch = useDispatch();

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;
  const medium = palette.neutral.medium;

  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(comment?.likes[loggedInUserId]);
  const likeCount = Object.keys(comment?.likes).length;

  const patchLikeComment = async () => {
    const response = await fetch(`http://localhost:3001/posts/${comment._id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const updatedComment = await response.json();
    dispatch(setPostCommentLike({ comment: updatedComment }));
    console.log(updatedComment);
  };

  useEffect(() => {
    setTimeAgo(createdTimeConvert(comment.createdAt));
  }, []); // eslint-disable

  return (
    <Box>
      <Divider />
      <FlexBetween mt={1}>
        <FlexBetween>
          <UserImage image={comment.user.picturePath} size={'30px'} />
          <Box display={'flex'} ml={1} alignItems={'center'}>
            <Typography
              color={main}
              variant="p"
              fontWeight="500"
              fontSize={'0.85rem'}
              sx={{
                '&:hover': {
                  color: palette.primary.light,
                  cursor: 'pointer',
                },
              }}
            >
              {`${comment.user.firstName} ${comment.user.lastName}`}
            </Typography>
            <Typography color={medium} fontSize="0.75rem" ml={1} variant="p">
              {timeAgo}
            </Typography>
          </Box>
        </FlexBetween>
        <MoreVertOutlined fontSize="small" />
      </FlexBetween>

      <Typography sx={{ color: main, mt: '0.5rem' }}>{comment.text}</Typography>
      <FlexBetween>
        <FlexBetween alignItems={'center'}>
          <FlexBetween>
            <IconButton onClick={patchLikeComment}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary, fontSize: 'small' }} />
              ) : (
                <FavoriteBorderOutlined fontSize="small" />
              )}
            </IconButton>
            <Typography sx={{ color: main, fontSize: '12px' }}>
              {likeCount}
            </Typography>
          </FlexBetween>
        </FlexBetween>
        <Box></Box>
      </FlexBetween>
    </Box>
  );
};

export default CommentsWidget;
