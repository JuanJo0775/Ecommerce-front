import React from 'react';
import NavBarLink from './NavBarLink';
import { FaCartShopping } from 'react-icons/fa6';
import styles from './NavBar.module.css';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

const NavBar = ({numCartItems}) => {
  const { isAuthenticated } = useContext(AuthContext);

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
            <NavBarLink />
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
    </>
  );
};

export default NavBar;