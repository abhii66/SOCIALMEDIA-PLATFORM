import React, { useState } from 'react'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import { useAuth } from '../store/authStore.js'
import { useEffect } from 'react'
import { Outlet,useLocation } from 'react-router'

const HIDE_HEADER_ON = ['/app/postsupload', '/app/profile', '/app/editprofile', '/app/savedposts', '/app/likedposts','/app/followingpeople']
const HIDE_FOOTER_ON = ['/app/postsupload']
const FULL_PAGE_ROUTES = ['/app/postsupload']

function RootLayout() {
  const [activeTab, setActiveTab] = useState("For You")
  const [activeNav, setActiveNav] = useState("home")
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#FFFFFF", minHeight: "100vh", color: "#000" }}>
      {!HIDE_HEADER_ON.some(path => pathname.startsWith(path)) && (
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        menuOpen={menuOpen}
        onMenuOpen={() => setMenuOpen(o => !o)}
      />
      )}

      <main style={{ maxWidth: 576, margin: "0 auto", padding: "20px 16px 80px" }}>
        <Outlet />
      </main>
      {!HIDE_FOOTER_ON.includes(pathname) && (
      <Footer
        activeNav={activeNav}
        onNavChange={setActiveNav}
        onCompose={() => console.log("open compose")}
      />
      )}
    </div>
  )
}

export default RootLayout