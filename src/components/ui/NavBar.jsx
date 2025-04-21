import React, { useState, useContext } from 'react';
import NavBarLink from './NavBarLink';
import { FaShoppingBag } from 'react-icons/fa';
import styles from './NavBar.module.css';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Chatbot from '../chatbot/Chatbot';
import pic from '../../assets/incorrect-frog.png';

const NavBar = ({numCartItems}) => {
  const [showChatbot, setShowChatbot] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  return (
    <>
      <nav className={`navbar navbar-expand-lg navbar-light py-3 ${styles.stickyNav}`}>
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            <div className={styles.brandContainer}>
              <img 
                src={pic}
                alt="La Tienda Incorrecta" 
                className={styles.navLogo} 
              />
              <span className={styles.brandText}>La Tienda Incorrecta</span>
            </div>
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
            <Link to="/cart" className={`position-relative ${styles.cartButton} ${styles.responsiveCart}`}>
              <FaShoppingBag />
              {numCartItems > 0 && (
                <span className={styles.cartBadge}>
                  {numCartItems}
                </span>
              )}
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