import { setUserLoading, setUserData, setUserError } from "./userSlice";
import { loginSuccess, setAuthError } from "./authSlice";
import authService from "../appwrite/auth";

export const getCurrentUserData = () => async (dispatch) => {
    dispatch(setUserLoading(true));
    try {
        // Get basic user data
        const userData = await authService.getCurrentUser();
        console.log("User Data by using this.account.get:", userData);

        if (userData) {
            // If we have a user, they are authenticated
            dispatch(loginSuccess());

            // Get detailed user document
            const userDoc = await authService.getUser(userData.$id);
            console.log("Serialized User Data:", userDoc);

            if (userDoc) {
                dispatch(setUserData(userDoc));
            }
        } else {
            dispatch(setUserError("No user data found"));
        }
    } catch (error) {
        console.log("Error fetching current user data:", error);
        dispatch(setAuthError(error.message));
        dispatch(setUserError(error.message));
        throw error;
    } finally {
        dispatch(setUserLoading(false));
    }
};
