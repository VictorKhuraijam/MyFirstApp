import { useEffect } from 'react'
import {useDispatch, useSelector} from "react-redux"
import './App.css'
import { initializeSession } from './store/session'
import {Header, Footer} from "./components"
import {Outlet} from "react-router-dom"

function App() {
  const dispatch = useDispatch()
  const {loading} = useSelector(state => state.auth.loading);

  useEffect(() => {
    dispatch(initializeSession())

  }, [dispatch]);

  return (
    <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
      <div className='w-full block'>
        <Header />

        <main>
           {/* Only show loading state for the main content */}
          {loading ? (
            <div className="w-full h-32 flex items-center justify-center">
              <div className="text-lg text-gray-600">Loading...</div>
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
