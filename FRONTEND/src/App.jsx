import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
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
import Profile from './components/Profile.jsx'
import EditProfile from './components/EditProfile.jsx'
import EditPost from './components/EditPost.jsx'
import PostDetail from './components/PostDetail.jsx'
import { useAuth } from './store/authStore.js'
import { useEffect } from 'react'
function App() {
  const checkAuth = useAuth((state) => state.checkAuth)

  useEffect(() => {
    checkAuth()
  }, [])
  const routerObj = createBrowserRouter([
    {
      path: "/",
      element: <Login />
    },
    {
      path: "/register",
      element: <Register />
    },
    {
      path: "/app",
      element: <RootLayout />,   // Footer lives here, Outlet renders children
      children: [
        { index: true,              element: <Navigate to="foryou" replace /> },
        { path: "foryou",           element: <ForYouPosts /> },
        { path: "following",        element: <Following /> },
        { path: "search",           element: <Search /> },
        { path: "savedposts",       element: <SavedPosts /> },
        { path: "likedposts",       element: <LikedPosts /> },
        { path: "postsupload",      element: <PostsUpload /> },
        { path: "profile/:id",          element: <Profile /> },
      ]
    },
      
      { path: "/editprofile",      element: <EditProfile /> },
      { path: "/edit-post", element: <EditPost /> },
      { path: "/post/:id",      element: <PostDetail /> }
  ])
  return (
    <>
  <RouterProvider router={routerObj}></RouterProvider>
    </>
  )
}

export default App