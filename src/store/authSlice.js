import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,
    loading: false,
    error: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
            if (action.payload === true) {
                state.error = null;
            }
        },
        loginSuccess: (state) => {
            state.isAuthenticated = true;
            state.loading = false;
            state.error = null;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
        },
        setAuthError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        }
    }
});

export const {
    setLoading,
    loginSuccess,
    logout,
    setAuthError
} = authSlice.actions;

export default authSlice.reducer;
