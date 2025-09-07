import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-pro">
      <div className="footer-content">
        <div className="footer-brand">
          <img src={process.env.PUBLIC_URL + "/assets/images/logo.png"} alt="Aldenaire Kitchen Logo" className="footer-logo" />
          <span className="footer-title">Aldenaire Kitchen</span>
          <p className="footer-tagline">Delicious food, exceptional service</p>
        </div>
        <div className="footer-info">
          <div className="footer-section">
            <h4>Contact Info</h4>
            <p>📍 123 Restaurant Street, City</p>
            <p>📞 (555) 123-4567</p>
            <p>✉️ info@aldenaire.com</p>
          </div>
          <div className="footer-section">
            <h4>Opening Hours</h4>
            <p>Monday - Friday: 11:00 AM - 10:00 PM</p>
            <p>Saturday - Sunday: 12:00 PM - 11:00 PM</p>
          </div>
        </div>
        <div className="footer-social">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="https://facebook.com" className="footer-social-icon" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0" fill="currentColor"/></svg>
            </a>
            <a href="https://youtube.com" className="footer-social-icon" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23.498 6.186a2.994 2.994 0 0 0-2.108-2.116C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.39.57A2.994 2.994 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a2.994 2.994 0 0 0 2.108 2.116C4.495 20.5 12 20.5 12 20.5s7.505 0 9.39-.57a2.994 2.994 0 0 0 2.108-2.116C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="currentColor"/></svg>
            </a>
            <a href="https://twitter.com" className="footer-social-icon" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195A4.916 4.916 0 0 0 16.616 3c-2.72 0-4.924 2.206-4.924 4.924 0 .386.044.763.127 1.124C7.728 8.807 4.1 6.884 1.671 3.965c-.423.724-.666 1.561-.666 2.475 0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.212c9.057 0 14.009-7.513 14.009-14.009 0-.213-.005-.425-.014-.636A10.012 10.012 0 0 0 24 4.557z" fill="currentColor"/></svg>
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Aldenaire Kitchen. All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer; 