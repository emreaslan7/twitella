import React from 'react';
import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
} from '@mui/icons-material';
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import Dropzone from 'react-dropzone';
import UserImage from 'components/UserImage';
import WidgetWrapper from 'components/WidgetWrapper';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from 'state';
import CustomAlert from 'components/CustomAlert';

const MyCommentWidget = ({ picturePath }) => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [post, setPost] = useState('');
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery('(min-width: 1000px)');
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;

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

  // const handlePost = async () => {
  //   const formData = new FormData();
  //   formData.append('userId', _id);
  //   formData.append('description', post);

  //   if (image) {
  //     formData.append('picture', image);
  //   }

  //   try {
  //     const response = await fetch('http://localhost:3001/posts', {
  //       method: 'POST',
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: formData,
  //     });

  //     const posts = await response.json();
  //     console.log('posts', posts);
  //     handleOpenAlert();
  //     dispatch(setPosts({ posts }));
  //     setImage(null);
  //     setPost('');
  //   } catch (error) {
  //     console.error('Error posting:', error);
  //   }
  // };

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
        // disabled={!post}
        // onClick={handlePost}
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
