import React from 'react'
import {createBrowserRouter,RouterProvider,Navigate} from 'react-router-dom'
import RootLayout from './components/RootLayout.jsx'
import Home from './components/Home.jsx'
import Register from './components/Register.jsx'
import Search from './components/Search.jsx'
import ForYouPosts from './components/ForYouPosts.jsx'
import Following from './components/Following.jsx'
import SavedPosts from './components/SavedPosts.jsx'
import LikedPosts from './components/LikedPosts.jsx'
import Login from './components/Login.jsx'
import PostsUpload from './components/PostsUpload.jsx'
function App() {
 const routerObj = createBrowserRouter([
  {
    path:"/",
    element:<Login></Login>
  },
  {
    path: "/app",
    element: <RootLayout />,
    children: [
      { path: "",          element: <Navigate to="/foryou" replace /> }, 
      { path: "foryou",    element: <ForYouPosts /> },
      { path: "following", element: <Following /> },
    ]
  },
  {
    path: "/search",
    element: <Search />
  },{
    path: "/savedposts",
    element: <SavedPosts />
  }
  ,{
    path: "/likedposts",
    element: <LikedPosts />
  },
  {
    path: "/register",
    element: <Register />
  },
   {
    path: "/postsupload",
    element: <PostsUpload />
  }
])
  return (
    <>
  <RouterProvider router={routerObj}></RouterProvider>
    </>
  )
}

export default App