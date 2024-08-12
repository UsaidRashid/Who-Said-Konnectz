import {configureStore} from '@reduxjs/toolkit'
import postReducer from './Features/postSlice'

export default configureStore({
    reducer: {
      post: postReducer,
    },
});