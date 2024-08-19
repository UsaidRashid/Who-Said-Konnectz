import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts(state, action) {
      if (action.payload.home) {
        state.posts = [...state.posts, ...action.payload.posts];
      } else {
        state.posts = action.payload.posts;
      }
    },
    toggleLike(state, action) {
      const { postId, userId } = action.payload;
      const postIndex = state.posts.findIndex((post) => post._id === postId);

      if (postIndex !== -1) {
        const post = state.posts[postIndex];
        const isLiked = post.likes.includes(userId);

        post.isLiked = !isLiked;

        if (isLiked) {
          post.likes = post.likes.filter((like) => like !== userId);
        } else {
          post.likes.push(userId);
        }
      }
    },
    toggleLikeComment(state, action) {
      const { commentId, postId, userId } = action.payload;
      const postIndex = state.posts.findIndex((post) => post._id === postId);
      if (postIndex !== -1) {
        const post = state.posts[postIndex];
        const commentIndex = post.comments.findIndex(
          (comment) => comment._id === commentId
        );

        if (commentIndex !== -1) {
          const comment = state.posts[postIndex].comments[commentIndex];

          const isCommentLiked = comment.likes.includes(userId);

          comment.isCommentLiked = !isCommentLiked;

          if (isCommentLiked) {
            comment.likes = comment.likes.filter((like) => like !== userId);
          } else {
            comment.likes.push(userId);
          }
        }
      }
    },
  },
});

export const { setPosts, toggleLike, toggleLikeComment } = postSlice.actions;
export default postSlice.reducer;
