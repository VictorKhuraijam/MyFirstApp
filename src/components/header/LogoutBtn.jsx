import {useDispatch} from 'react-redux'
import authService from '../../appwrite/auth'
import {logout} from  '../../store/authSlice'
import { useNavigate } from 'react-router-dom'
import { clearUserData } from '../../store/userSlice'


function LogoutBtn() {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const logoutHandler = () => {
      authService.logout()
      .then(() => {
          dispatch(logout())
          dispatch(clearUserData())
          navigate('/');
      }) .catch(error => {
        console.error("Logout failed:", error);
    });
  }
  return (
    <button
    className='w-full px-3 py-2 text-white text-left rounded-lg bg-gray-500
                        hover:bg-gray-600 transition-colors duration-200
                        md:hover:bg-blue-100 md:hover:text-gray-900'
    onClick={logoutHandler}
    >Logout</button>
  )
}

export default LogoutBtn
