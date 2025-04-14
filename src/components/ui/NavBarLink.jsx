import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";



const NavBarLink = () => {

  const {isAuthenticated, username, setIsAuthenticated}= useContext(AuthContext)

  function logout(){
    localStorage.removeItem("access")
    setIsAuthenticated(false)
  }

  return (
    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
      {isAuthenticated ? (
            <>
            <li className="nav-item">
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive ? "nav-link active fw-semibold" : "nav-link fw-semibold"
                }
                end
              >
                {`Hola ${username}`}
              </NavLink>
            </li>
            <li className="nav-item" onClick={logout}>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "nav-link active fw-semibold" : "nav-link fw-semibold"
                }
                end
              >
                Cerrar sesión
              </NavLink>
            </li>
            </>

              ):(

            <>
            <li className="nav-item">
        <NavLink
          to="/login"
          className={({ isActive }) =>
            isActive ? "nav-link active fw-semibold" : "nav-link fw-semibold"
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
            isActive ? "nav-link active fw-semibold" : "nav-link fw-semibold"
          }
          end
        >
          Registrarse
        </NavLink>
      </li>
      </>
              )
      }
      



    </ul>
  );
};

  
  export default NavBarLink;