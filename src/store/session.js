import { setLoading, loginSuccess, setAuthError, logout } from "./authSlice";
import { setUserData, setUserError } from "./userSlice";
import authService from "../appwrite/auth";

export const initializeSession = () => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        // First check if we have an active session
        const session = await authService.getCurrentSession();

        if (!session) {
            dispatch(logout());
            return null;
        }

        // If we have a session, get the user data
        const user = await authService.getCurrentUser();
        if (user) {
            // Set auth state
            dispatch(loginSuccess());

            // Get detailed user info from database
            const userDoc = await authService.getUser(user.$id);
            if (userDoc) {
                dispatch(setUserData(userDoc));
            } else {
                dispatch(setUserError("User document not found"));
            }
        }

        return user;
    } catch (error) {
        console.error("Session initialization error:", error);
        dispatch(setAuthError(error.message));
        dispatch(setUserError(error.message));
        return null;
    } finally {
        dispatch(setLoading(false));
    }
};


export const loginUser = ({ email, password }) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const session = await authService.login({ email, password });
        if (session ) {

                dispatch(loginSuccess());

        }
        return session;
    } catch (error) {
        dispatch(setAuthError(error.message));
        throw error;
    } finally {
        dispatch(setLoading(false));
    }
};
