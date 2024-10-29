import {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'


export default function Protected({children, authentication = true}) {

  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

  console.log("Auth Status in Protected:", isAuthenticated)

  useEffect(() => {

          // if(isAuthenticated === true){
          //   navigate("/")
          // } else if(isAuthenticated === false){
          //   navigate("/login")
          // }

        // If authentication is required and the user is not authenticated, redirect to login
        if (authentication && isAuthenticated !== authentication) {
          navigate("/login");
        }
        // If authentication is not required (public route) and user is authenticated
         else if (!authentication && isAuthenticated !== authentication) {
          navigate("/");
        }
        setLoading(false);


  }, [isAuthenticated, navigate, authentication])


  return loading ? <h1>loading...</h1> : <> {children} </>
}
