
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userData: null,
    loading: false,
    error: null
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserLoading: (state, action) => {
            state.loading = action.payload;
            if (action.payload === true) {
                state.error = null;
            }
        },
        setUserData: (state, action) => {
            state.userData = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateUserData: (state, action) => {
            state.userData = { ...state.userData, ...action.payload };
        },
        clearUserData: (state) => {
            state.userData = null;
            state.loading = false;
            state.error = null;
        },
        setUserError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        updateProfileImage: (state, action) => {
            if (state.userData) {
                state.userData.imageId = action.payload.imageId;
            }
        },
        deleteProfileImage: (state) => {
            if (state.userData) {
                state.userData.imageId = null;
            }
        }
    }
});

export const {
    setUserLoading,
    setUserData,
    updateUserData,
    clearUserData,
    setUserError,
    updateProfileImage,
    deleteProfileImage
} = userSlice.actions;

export default userSlice.reducer;
