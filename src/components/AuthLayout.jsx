import {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'


export default function Protected({children, authentication = true}) {

  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const authStatus = useSelector((state) => state.auth.isAuthenticated)
  const isRehydrated = useSelector((state) => state.auth._persist?.rehydrated);

  console.log("Auth Status in Protected:", authStatus)
  console.log("Is Rehydrated: ", isRehydrated);

  useEffect(() => {

    // if(authStatus === true){
    //   navigate("/")
    // } else if(authStatus === false){
    //   navigate("/login")
    // }
    const checkAuth = () => {
      // Ensure that rehydration is complete before checking auth status
      if(isRehydrated){
        // If authentication is required and the user is not authenticated, redirect to login
        if (authentication && authStatus !== authentication) {
          navigate("/");
        } else if (!authentication && authStatus !== authentication) {
          navigate("/login");
        }
      }
      setLoading(false); //set loading outside of rehydration to prevent from setting loading to true if user is not authenticated
    };

    checkAuth();
  }, [authStatus, navigate, authentication, isRehydrated])



  return loading ? <h1>loading...</h1> : <> {children} </>
}
