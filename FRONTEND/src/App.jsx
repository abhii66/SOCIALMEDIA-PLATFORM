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
import AccountSettings from './components/AccountSettings.jsx'
import EditProfile from './components/EditProfile.jsx'
import EditPost from './components/EditPost.jsx'
import PostDetail from './components/PostDetail.jsx'
import UserProfile from './components/UserProfile.jsx'
import RecentlyDeleted from './components/RecentlyDeleted.jsx'
//import FollowingList from './components/FollowingList.jsx'
//import FollowersList from './components/FollowersList.jsx'
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
      element: <RootLayout />,
      children: [
        { index: true,              element: <Navigate to="foryou" replace /> },
        { path: "foryou",           element: <ForYouPosts /> },
        { path: "following",        element: <Following /> },
        { path: "search",           element: <Search /> },
        { path: "savedposts",       element: <SavedPosts /> },
        { path: "likedposts",       element: <LikedPosts /> },
        { path: "postsupload",      element: <PostsUpload /> },
        { path: "profile/:id",      element: <UserProfile /> },
        { path: "settings",         element: <AccountSettings /> },
        { path:'recently-deleted', element: <RecentlyDeleted />}

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