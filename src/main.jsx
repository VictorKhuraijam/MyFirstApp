import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import store, {persistor} from "./store/store.js"
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { AuthLayout, Login } from './components/index.js'
import {Home, AllPost, AddPost, EditPost, Post, Signup} from './pages/index.js'
import Explore from './pages/Explore.jsx'
import ProfileView from './components/ProfileView.jsx'
import ProfileEdit from './components/ProfileEdit.jsx'


const router = createBrowserRouter([
 {
  path: '/',
  element: <App />,
  children:[
    {
      path: '/',
      element: <Home />
    },
    {
      path:'/login',
      element:(
        <AuthLayout authentication={false}>
          <Login />
        </AuthLayout>
      )
    },
    {
      path:'/signup',
      element:(
        <AuthLayout authentication={false}>
          <Signup />
        </AuthLayout>
      )
    },
    {
      path:'/profile/:id',
      element: <ProfileView />
    },
    {
      path:'/profile/edit/:id',
      element:(
          <ProfileEdit />
       
      )
    },
    {
      path:'/all-posts',
      element:(
        <AuthLayout authentication>
          {" "}
          <AllPost />
        </AuthLayout>
      )
    },
    {
      path:'/add-post',
      element:(
        <AuthLayout authentication>
          {" "}
          <AddPost />
        </AuthLayout>
      )
    },
    {
      path:'/edit-post/:id',
      element:(
        <AuthLayout authentication>
          {" "}
          <EditPost />
        </AuthLayout>
      )
    },
    {
      path:'/post/:id',
      element: <Post />
    },
    {
      path: '/explore',
      element: <Explore />
    }
  ]
 }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<h1>Loading...</h1>} persistor={persistor}>
        <RouterProvider router={router}/>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
