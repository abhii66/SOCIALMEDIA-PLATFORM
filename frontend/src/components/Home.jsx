import { NavLink } from "react-router";
import { useAuth } from "../store/authStore";
import { primaryBtn, secondaryBtn } from "../styles/common.js";

function Home() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);

  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      <div className="max-w-3xl text-center space-y-8">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Welcome to <span className="text-[#0066cc]">SocialApp</span>
        </h1>

        <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Share your moments, follow the people you love, and discover posts that inspire you.
          Your feed, your community.
        </p>

        {!isAuthenticated && (
          <div className="flex justify-center gap-4 pt-4">
            <NavLink to="/register" className={primaryBtn}>
              Get Started
            </NavLink>
            <NavLink to="/login" className={secondaryBtn}>
              Sign In
            </NavLink>
          </div>
        )}

        {isAuthenticated && (
          <div className="flex justify-center gap-4 pt-4">
            <NavLink to="/feed" className={primaryBtn}>
              View Feed
            </NavLink>
            <NavLink to="/explore" className={secondaryBtn}>
              Explore
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
