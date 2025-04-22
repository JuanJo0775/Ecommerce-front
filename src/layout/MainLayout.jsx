// src/layout/MainLayout.jsx
import NavBar from '../components/ui/NavBar';
import Footer from '../components/ui/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Outlet, useLocation } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../components/context/AuthContext';

const MainLayout = ({numCartItems}) => {
  const { isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  // Cargar el script de Chatbase directamente para evitar duplicación de botones
  useEffect(() => {
    if (isAuthenticated && location.pathname !== '/chat') {
      // Inicializar Chatbase directamente en el DOM
      const scriptId = "9n0GIwiCpgFkyUxwqfl0l";
      if (!document.getElementById(scriptId)) {
        const script = document.createElement("script");
        script.src = "https://www.chatbase.co/embed.min.js";
        script.id = scriptId;
        script.domain = "www.chatbase.co";
        document.body.appendChild(script);
      }
    }
  }, [isAuthenticated, location.pathname]);

  return (
    <>
      <NavBar numCartItems={numCartItems}/>
      <ToastContainer />
      <Outlet />
      <Footer />

    </>
  );
};

export default MainLayout;