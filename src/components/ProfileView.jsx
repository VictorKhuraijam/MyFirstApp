import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '../components';
import { UserSavedPosts, UserPosts } from '../components/index';
import authService from '../appwrite/auth';
import appwriteService from '../appwrite/config'

const ProfileView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [currentUserDocId, setCurrentUserDocId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch profile data
        const userResponse = await authService.getUserByDocumentId(id);
        setUserData(userResponse);
        console.log("current user collection:",userResponse)

        //Get current user's custom document ID
        const currentUser = await authService.getCurrentUser()
        const currentUserdoc = await authService.getUserDocumentId(currentUser.$id)

        setCurrentUserDocId(currentUserdoc);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const onSaveToggle = (postId, isSaved) => {
    console.log(`Profile: Save toggled for post ${postId}, isSaved: ${isSaved}`);
  };

  if (loading) return <div>Loading user profile...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!userData) return <div>User not found</div>;

  const isOwnProfile = currentUserDocId === id;

  return (
    <Container>
      <div className="flex flex-col items-center px-4 sm:px-6 lg:px-8 my-8">
        <div className="flex flex-col md:flex-row items-start justify-between w-full max-w-4xl gap-6 md:gap-8 lg:gap-12">
          {/* Profile Image */}
          <div className="relative w-full md:w-auto flex justify-center md:justify-start">
            <img
              src={ userData.imageId
                ? appwriteService.getProfilePicturePreview(userData.imageId)
                : userData?.imageUrl || '/assets/profile-placeholder.svg'}
              alt="profile"
              className="h-28 w-28 sm:h-32 sm:w-32 md:h-40 md:w-40 lg:h-48 lg:w-48 rounded-full object-cover shadow-lg"
              onError={(e) => {
                e.target.src = '/assets/profile-placeholder.svg';
              }}
            />
            {isOwnProfile && (
              <button
                className="absolute bottom-0 right-1/2 md:right-0 translate-x-12 md:translate-x-0 bg-gray-700 text-white p-2 rounded-full shadow-md hover:bg-gray-600 transition-colors"
                onClick={() => navigate(`/profile/edit/${id}`)}
              >
                <img src="/assets/icons-edit.png" alt="edit" className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* User Details */}
          <div className="flex-1 w-full md:w-auto">
            <div className="text-center md:text-left space-y-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{userData.name}</h1>
              <p className="text-lg sm:text-xl text-gray-600">@{userData.username}</p>
              <div className="mt-4">
                <h2 className="text-lg text-center mb-2 font-semibold">Bio</h2>
                <p className="text-md p-2 rounded-sm bg-gray-200">
                  {userData.bio || 'User has no bio.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="w-full max-w-4xl mt-12">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-8">
            Posts by {userData.name}
          </h2>
          <div className="flex justify-center gap-3 mb-8">
            <button
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'posts'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setActiveTab('posts')}
            >
              User Posts
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'saved'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setActiveTab('saved')}
            >
              Saved Posts
            </button>
          </div>
          <div className="w-full">
            {activeTab === 'posts' ? (
              <UserPosts id={id} onSaveToggle={onSaveToggle} />
            ) : (
              <UserSavedPosts id={id} onSaveToggle={onSaveToggle} />
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ProfileView
