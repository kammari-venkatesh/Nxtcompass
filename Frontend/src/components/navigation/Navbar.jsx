import React, { useState } from "react"
import { Link } from "react-router-dom"
import "./Navbar.css"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="navbar-logo-icon">◆</span>
          NxtCompass
        </Link>

        {/* Hamburger */}
        <button
          className={`navbar-toggle ${isOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {/* Menu */}
        <ul className={`navbar-menu ${isOpen ? "active" : ""}`}>
          <li className="navbar-item">
            <Link to="/" className="navbar-link" onClick={closeMenu}>
              Home
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/quiz" className="navbar-link" onClick={closeMenu}>
              Quiz
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/predictor" className="navbar-link" onClick={closeMenu}>
              Predictor
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/dashboard" className="navbar-link" onClick={closeMenu}>
              Dashboard
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
