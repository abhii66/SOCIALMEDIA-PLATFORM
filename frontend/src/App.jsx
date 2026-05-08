import { createBrowserRouter, RouterProvider } from "react-router";
import { Toaster } from "react-hot-toast";
import RootLayout from "./components/RootLayout.jsx";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Feed from "./components/Feed.jsx";
import Explore from "./components/Explore.jsx";
import PostPage from "./components/PostPage.jsx";
import CreatePost from "./components/CreatePost.jsx";
import UserProfile from "./components/UserProfile.jsx";
import OtherUserProfile from "./components/OtherUserProfile.jsx";
import SearchUsers from "./components/SearchUsers.jsx";
import AdminProfile from "./components/AdminProfile.jsx";
import Unauthorized from "./components/Unauthorized.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  const routerObj = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          // Feed: posts from users I follow + trending
          path: "feed",
          element: (
            <ProtectedRoute allowedRoles={["USER"]}>
              <Feed />
            </ProtectedRoute>
          ),
        },
        {
          // Explore: all posts from all users
          path: "explore",
          element: (
            <ProtectedRoute allowedRoles={["USER"]}>
              <Explore />
            </ProtectedRoute>
          ),
        },
        {
          // Single post detail page
          path: "post/:id",
          element: (
            <ProtectedRoute allowedRoles={["USER"]}>
              <PostPage />
            </ProtectedRoute>
          ),
        },
        {
          // Create a new post
          path: "create-post",
          element: (
            <ProtectedRoute allowedRoles={["USER"]}>
              <CreatePost />
            </ProtectedRoute>
          ),
        },
        {
          // My own profile with my posts
          path: "profile",
          element: (
            <ProtectedRoute allowedRoles={["USER"]}>
              <UserProfile />
            </ProtectedRoute>
          ),
        },
        {
          // Another user's profile
          path: "profile/:id",
          element: (
            <ProtectedRoute allowedRoles={["USER"]}>
              <OtherUserProfile />
            </ProtectedRoute>
          ),
        },
        {
          // Search users by name or username
          path: "search",
          element: (
            <ProtectedRoute allowedRoles={["USER"]}>
              <SearchUsers />
            </ProtectedRoute>
          ),
        },
        {
          // Admin: manage users (block/activate)
          path: "admin-profile",
          element: (
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminProfile />
            </ProtectedRoute>
          ),
        },
        {
          path: "unauthorized",
          element: <Unauthorized />,
        },
      ],
    },
  ]);

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={routerObj} />
    </div>
  );
}

export default App;
