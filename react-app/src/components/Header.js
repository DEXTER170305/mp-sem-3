import React from 'react';
import './Header.css'; // Import CSS for the header

const Header = () => {
  return (
    <header className="header">
      <div className="nav">
        <div className="logo">CollegeGuide</div>
        <div className="contact-info">
          <span>📞 1800-XXX-XXXX</span>
          <span>
            <a href="mailto:hello@collegeguide.com">hello@collegeguide.com</a> ✉️
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
