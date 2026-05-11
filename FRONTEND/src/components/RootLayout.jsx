import React, { useState } from 'react'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import { Outlet } from 'react-router-dom'

function RootLayout() {
  const [activeTab, setActiveTab] = useState("For You")
  const [activeNav, setActiveNav] = useState("home")
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#FFFFFF", minHeight: "100vh", color: "#000" }}>
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        menuOpen={menuOpen}
        onMenuOpen={() => setMenuOpen(o => !o)}
      />

      <main style={{ maxWidth: 576, margin: "0 auto", padding: "20px 16px 80px" }}>
        <Outlet />
      </main>

      <Footer
        activeNav={activeNav}
        onNavChange={setActiveNav}
        onCompose={() => console.log("open compose")}
      />
    </div>
  )
}

export default RootLayout