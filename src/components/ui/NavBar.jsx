import React, { useState, useContext } from 'react';
import NavBarLink from './NavBarLink';
import { FaCartShopping } from 'react-icons/fa6';
import styles from './NavBar.module.css';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Chatbot from '../chatbot/Chatbot';

const NavBar = ({numCartItems}) => {
  const [showChatbot, setShowChatbot] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  return (
    <>
      <nav className={`navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3 ${styles.stickyNav}`}>
        <div className="container">
          <Link className="navbar-brand fw-bold text-uppercase" to="/">
            SHOPPIT
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarContent">
            <NavBarLink toggleChatbot={toggleChatbot} />
            <Link to="/cart" className={`btn btn-dark ms-3 rounded-pill position-relative ${styles.responsiveCart}`}>
              <FaCartShopping />
              {numCartItems == 0 || <span
                className="position-absolute top-6 start-100 translate-middle badge rounded-pill"
                style={{ fontSize: '0.85rem', padding: '0.5em 0.65em', backgroundColor: '#60549f' }}
              >
                {numCartItems}
              </span>}
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Solo mostrar el chatbot si el usuario está autenticado y ha hecho clic en el botón */}
      {isAuthenticated && showChatbot && <Chatbot toggleChat={toggleChatbot} />}
    </>
  );
};

export default NavBar;