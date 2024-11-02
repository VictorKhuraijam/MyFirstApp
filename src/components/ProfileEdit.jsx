import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Container } from '../components';
import appwriteService from '../appwrite/config';
import authService from '../appwrite/auth';
import {
  setUserData,
  updateProfileImage,
  deleteProfileImage
} from '../store/userSlice';
import { getCurrentUserData } from '../store/getCurrentUserData';

const ProfileEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localUserData, setLocalUserData] = useState({
    name: '',
    username: '',
    bio: '',
    imageId: '',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const verifyAndFetchUser = async () => {
      try {
        setLoading(true);
        // Verify current user owns this profile
        const currentUser = await authService.getCurrentUser();
        const currentUserDocId = await authService.getUserDocumentId(currentUser.$id)
        if (currentUserDocId !== id) {
          navigate(`/profile/${id}`);
          return;
        }

        // Fetch user data
        const userResponse = await authService.getUserByDocumentId(id);
        setLocalUserData({
          name: userResponse.name,
          username: userResponse.username,
          bio: userResponse.bio || '',
          imageId: userResponse.imageId || '',
        });
        setPreviewImage(
          userResponse.imageId
            ? appwriteService.getProfilePicturePreview(userResponse.imageId)
            : userResponse.imageUrl
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    verifyAndFetchUser();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const wasImageDeleted = localUserData.imageId && !localUserData.imageId;
      let imageId = null;

      if (selectedImage) {
        const newImageFile = await appwriteService.uploadProfilePicture(selectedImage);
        if (newImageFile.$id) {
          imageId = newImageFile.$id;
          dispatch(updateProfileImage({ imageId }));
        } else {
          throw new Error('Failed to upload image');
        }
      } else if (!wasImageDeleted) {
        imageId = localUserData.imageId;
      }

      const updatedProfileData = {
        ...localUserData,
        imageId,
      };

      const updatedProfile = await authService.updateUserProfile(id, updatedProfileData);
      if (updatedProfile) {
        const refreshedUser = await authService.getUserByDocumentId(id);
        dispatch(setUserData(refreshedUser));
        dispatch(getCurrentUserData());
        navigate(`/profile/${id}`);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteImage = async () => {
    try {
      setIsSubmitting(true);
      if (localUserData.imageId) {
        // Delete image from Appwrite storage
        await appwriteService.deleteProfilePicture(localUserData.imageId);

        // Update profile data in database
        const updatedProfileData = {
          ...localUserData,
          imageId: null,
        };

        // Update user profile in database
        const updatedProfile = await authService.updateUserProfile(id, updatedProfileData);
        if (!updatedProfile) {
          throw new Error("Failed to update profile after image deletion");
        }

        // Update Redux state
        dispatch(deleteProfileImage());

        // Update local state
        setLocalUserData(prev => ({ ...prev, imageId: null }));
        setPreviewImage(updatedProfile.imageUrl ||'/assets/profile-placeholder.svg');
        setSelectedImage(null);

        // Refresh user data from database
        const refreshedUser = await authService.getUserByDocumentId(id);
        dispatch(setUserData(refreshedUser));
        dispatch(getCurrentUserData());
      }
    } catch (error) {
      console.error('Error deleting profile picture:', error);
      alert('Error deleting profile picture: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Edit Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center gap-4">
            <img
              src={previewImage || '/assets/profile-placeholder.svg'}
              alt="profile"
              className="h-32 w-32 rounded-full object-cover"
            />
            <div className="flex gap-3">
            {!localUserData.imageId ? (
                // Show only Add Photo when no image exists
                <label className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg cursor-pointer">
                  Add Photo
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageChange}
                    accept="image/*"
                    disabled={isSubmitting}
                  />
                </label>
              ) : (
                // Show both Delete and Change Photo buttons when image exists
                <>
                  <button
                    type="button"
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                    onClick={handleDeleteImage}
                    disabled={isSubmitting}
                  >
                    Delete Photo
                  </button>
                  <label className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg cursor-pointer">
                    Change Photo
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleImageChange}
                      accept="image/*"
                      disabled={isSubmitting}
                    />
                  </label>
                </>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={localUserData.name}
                onChange={handleInputChange}
                className="mt-1 w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={localUserData.username}
                onChange={handleInputChange}
                className="mt-1 w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                name="bio"
                value={localUserData.bio}
                onChange={handleInputChange}
                rows={6}
                className="mt-1 w-full p-2 border rounded-lg resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/profile/${id}`)}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Container>
  );
};

export default ProfileEdit;
