import { useEffect, useState } from 'react'
import {useDispatch} from "react-redux"
import './App.css'
import {Header, Footer} from "./components"
import {Outlet} from "react-router-dom"
import { getCurrentUserData } from './store/getCurrentUserData'

function App() {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
        try {
            dispatch(getCurrentUserData()); // Dispatch your new function to fetch user data
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        } finally {
          setLoading(false);
        }
      };
   initializeAuth()
  }, [dispatch]);

  return (
    <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
      <div className='w-full block'>
        <Header />

        <main>
           {/* Only show loading state for the main content */}
          {loading ? (
            <div className="w-full h-32 flex items-center justify-center">
              <div className="text-lg text-gray-600">Loading</div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default App
