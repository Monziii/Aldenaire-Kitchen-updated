import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = ({ cartCount = 0 }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header>
      <div className="logo">
        <Link to="/">
          <img src={process.env.PUBLIC_URL + "/assets/images/logo.png"} alt="Logo" />
        </Link>
      </div>
      
      <nav className="main-nav">
        <ul>
          <li>
            <Link to="/" className={isActive('/') ? 'active' : ''}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className={isActive('/about') ? 'active' : ''}>
              About
            </Link>
          </li>
          <li>
            <Link to="/menu" className={isActive('/menu') ? 'active' : ''}>
              Menu
            </Link>
          </li>
          <li>
            <Link to="/reviews" className={isActive('/reviews') ? 'active' : ''}>
              Reviews
            </Link>
          </li>
          <li>
            <Link to="/contact" className={isActive('/contact') ? 'active' : ''}>
              Contact
            </Link>
          </li>
          <li>
            <Link to="/cart" className={isActive('/cart') ? 'active' : ''}>
              My Orders 🛒 
              <span className="cart-count">
                {cartCount}
              </span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="menu-icon" onClick={toggleMobileMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {isMobileMenuOpen && (
        <div className="mobile-nav">
          <ul>
            <li>
              <Link to="/" onClick={toggleMobileMenu}>Home</Link>
            </li>
            <li>
              <Link to="/about" onClick={toggleMobileMenu}>About</Link>
            </li>
            <li>
              <Link to="/menu" onClick={toggleMobileMenu}>Menu</Link>
            </li>
            <li>
              <Link to="/reviews" onClick={toggleMobileMenu}>Reviews</Link>
            </li>
            <li>
              <Link to="/contact" onClick={toggleMobileMenu}>Contact</Link>
            </li>
            <li>
              <Link to="/cart" onClick={toggleMobileMenu}>
                My Orders 🛒 
                <span className="cart-count">
                  {cartCount}
                </span>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header; 