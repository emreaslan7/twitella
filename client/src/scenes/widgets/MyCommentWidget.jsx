import React from 'react';
import { InputBase, useTheme, Button } from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import UserImage from 'components/UserImage';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPostWithComments } from 'state';
import CustomAlert from 'components/CustomAlert';

const MyCommentWidget = ({ postId }) => {
  const dispatch = useDispatch();
  const [post, setPost] = useState('');
  const { palette } = useTheme();
  const { picturePath } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  console.log(postId);
  // snackbar alerts start
  const [openAlert, setOpenAlert] = useState(false);
  const handleOpenAlert = () => {
    setOpenAlert(true);
  };
  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };
  // snackbar alerts end

  const handlePost = async () => {
    const formData = new FormData();
    formData.append('text', post);

    try {
      const response = await fetch(
        `http://localhost:3001/posts/${postId}/comments`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const responseComment = await response.json();
      console.log('responseComment', responseComment);
      handleOpenAlert();
      dispatch(setPostWithComments({ comment: responseComment }));
      setPost('');
    } catch (error) {
      console.error('Error posting:', error);
    }
  };

  return (
    <FlexBetween gap="0.5rem" mt={2}>
      <UserImage image={picturePath} size="30px" />
      <InputBase
        placeholder="What will you say..."
        onChange={(e) => setPost(e.target.value)}
        value={post}
        sx={{
          width: '100%',
          backgroundColor: palette.neutral.light,
          borderRadius: '2rem',
          padding: '0 0 0 1rem',
        }}
      />

      <Button
        disabled={!post}
        onClick={handlePost}
        sx={{
          padding: '0.2rem 0',
          color: palette.background.alt,
          backgroundColor: palette.primary.main,
          borderRadius: '1rem',
        }}
      >
        REPLY
      </Button>
      <CustomAlert
        open={openAlert}
        onClose={handleCloseAlert}
        message="Congrats! You added new comment!"
        severity="info"
      />
    </FlexBetween>
  );
};

export default MyCommentWidget;
