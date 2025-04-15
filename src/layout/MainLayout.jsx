// src/layout/MainLayout.jsx
import NavBar from '../components/ui/NavBar';
import Footer from '../components/ui/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Outlet } from 'react-router-dom';
import Chatbot from '../components/chatbot/Chatbot';
import { useContext } from 'react';
import { AuthContext } from '../components/context/AuthContext';

const MainLayout = ({numCartItems}) => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <>
      <NavBar numCartItems={numCartItems}/>
      <ToastContainer />
      <Outlet />
      <Footer />
      {isAuthenticated && <Chatbot />}
    </>
  );
};

export default MainLayout;