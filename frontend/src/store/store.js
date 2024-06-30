import {configureStore} from '@reduxjs/toolkit'
import userReducer from './Features/userSlice'
import postReducer from './Features/postSlice'

export default configureStore({
    reducer: {
      user: userReducer,
      post: postReducer,
    },
});