import React, { useState } from 'react'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import { Outlet, useLocation } from 'react-router-dom'

// ✅ Move constants OUTSIDE the component — defined once, never redeclared
const HIDE_HEADER_ON = ['/app/postsupload', '/app/profile', '/app/editprofile', '/app/savedposts', '/app/likedposts']
const HIDE_FOOTER_ON = ['/app/postsupload']
const FULL_PAGE_ROUTES = ['/app/postsupload']

function RootLayout() {
  const [activeTab, setActiveTab] = useState("For You")
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  // ✅ Now safe to use — constants are already defined above
  const isFullPage = FULL_PAGE_ROUTES.includes(pathname)

  const getActiveNav = () => {
    if (pathname.includes('profile'))     return 'profile'
    if (pathname.includes('postsupload')) return 'compose'
    return 'home'
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#FFFFFF", minHeight: "100vh", color: "#000" }}>

      {!HIDE_HEADER_ON.includes(pathname) && (
        <Header
          activeTab={activeTab}
          onTabChange={setActiveTab}
          menuOpen={menuOpen}
          onMenuOpen={() => setMenuOpen(o => !o)}
        />
      )}

      <main style={isFullPage ? {} : { maxWidth: 576, margin: "0 auto", padding: "20px 16px 80px" }}>
        <Outlet />
      </main>

      {/* ✅ Actually hide the footer on postsupload */}
      {!HIDE_FOOTER_ON.includes(pathname) && (
        <Footer
          activeNav={getActiveNav()}
          onCompose={() => console.log("open compose")}
        />
      )}

    </div>
  )
}

export default RootLayout