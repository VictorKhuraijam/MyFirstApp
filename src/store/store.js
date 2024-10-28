import {configureStore} from "@reduxjs/toolkit"
import authSlice from './authSlice'
import postSlice from "./postSlice";
import commentSlice from "./commentSlice";
import userSlice from "./userSlice";



const store = configureStore({
  reducer: {
    auth: authSlice,
    posts: postSlice,
    comments: commentSlice,
    user: userSlice
  },

});


export default store
