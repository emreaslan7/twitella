import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mode: 'light',
  user: null,
  token: null,
  posts: [],
  postWithComments: [],
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state, action) => {
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error('User is not logged in yet');
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },

    setPostCommentLike: (state, action) => {
      const updatedComment = state.postWithComments.map((comment) => {
        if (comment._id === action.payload.comment._id)
          return action.payload.comment;
        return comment;
      });
      state.postWithComments = updatedComment;
    },

    setPostWithComments: (state, action) => {
      if (action.payload.comment) {
        state.postWithComments.push(action.payload.comment);
      } else {
        state.postWithComments = action.payload.allComments;
      }
    },
  },
});

export const {
  setMode,
  setLogin,
  setLogout,
  setFriends,
  setPosts,
  setPost,
  setPostWithComments,
  setPostCommentLike,
} = authSlice.actions;

export default authSlice.reducer;
