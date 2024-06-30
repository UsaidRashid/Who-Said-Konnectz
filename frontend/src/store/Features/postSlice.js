import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: [],
};


const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts(state, action) {
        state.posts = action.payload.map((post) => ({
            ...post,
            isLiked: false, 
        }));
    },
    toggleLike(state, action) {
        const { postId, userId } = action.payload;
        const postIndex = state.posts.findIndex((post) => post._id === postId);
  
        if (postIndex !== -1) {
          const post = state.posts[postIndex];
          const isLiked = post.likes.includes(userId);
  
          post.isLiked = !isLiked; 
  
          if (isLiked) {
            post.likes = post.likes.filter(like => like !== userId);
          } else {
            post.likes.push(userId); 
          }
        }
    },
  },
});

export const { setPosts, toggleLike } = postSlice.actions;
export default postSlice.reducer;
