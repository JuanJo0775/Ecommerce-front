import React, { useContext } from "react";
import { NavLink, Link } from "react-router-dom"; 
import { AuthContext } from "../context/AuthContext";
import { FaComments } from "react-icons/fa";
import styles from './NavBarLink.module.css';

const NavBarLink = ({ toggleChatbot }) => {
  const { isAuthenticated, username, setIsAuthenticated } = useContext(AuthContext);

  function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsAuthenticated(false);
  }

  return (
    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
      <li className="nav-item">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
          end
        >
          Inicio
        </NavLink>
      </li>
      <li className="nav-item dropdown">
        <a 
          className={styles.navLink}
          href="#" 
          id="categoriesDropdown" 
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Categorías <span className={styles.dropdownArrow}>▼</span>
        </a>
        <ul className={`dropdown-menu ${styles.dropdownMenu}`} aria-labelledby="categoriesDropdown">
          <li>
            <Link to="/categoria/ropa-fea" className={styles.dropdownItem}>
              Ropa Fea con Intención
            </Link>
          </li>
          <li>
            <Link to="/categoria/ceramica-feista" className={styles.dropdownItem}>
              Arte Raro y Cerámica Feísta
            </Link>
          </li>
          <li>
            <Link to="/categoria/decoracion-glitch" className={styles.dropdownItem}>
              Decoración Glitch-Artesanal
            </Link>
          </li>
          <li>
            <Link to="/categoria/accesorios" className={styles.dropdownItem}>
              Accesorios de Mal Gusto Elegante
            </Link>
          </li>
        </ul>
      </li>
      <li className="nav-item">
        <NavLink
          to="/manifiesto"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          Nuestro Manifiesto
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink
          to="/procesos"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          Procesos Incorrectos
        </NavLink>
      </li>

      {isAuthenticated ? (
        <>
          <li className="nav-item">
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
              end
            >
              {`Hola ${username}`}
            </NavLink>
          </li>
          <li className="nav-item">
            <Link 
              to="/chat"
              className={styles.navLink}
            >
              <FaComments className={styles.chatIcon} /> Asistente
            </Link>
          </li>
          <li className="nav-item" onClick={logout}>
            <NavLink
              to="/"
              className={styles.navLinkLogout}
              end
            >
              Salir
            </NavLink>
          </li>
        </>
      ) : (
        <>
          <li className="nav-item">
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
              end
            >
              Iniciar sesión
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/register"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
              end
            >
              Registrarse
            </NavLink>
          </li>
        </>
      )}
    </ul>
  );
};

export default NavBarLink;