import React from "react";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
    return (
      <footer className="py-3" style={{ backgroundColor: '#6050DC', color: 'white' }}>
        <div className="container text-center">
          {/* Quick Links Section */}
          <div className="mb-2">
            <a href="#" className="text-white text-decoration-none mx-2">
              Inicio
            </a>
            <a href="#" className="text-white text-decoration-none mx-2">
              Sobre nosotros
            </a>
            <a href="#" className="text-white text-decoration-none mx-2">
              Comprar
            </a>
            <a href="#" className="text-white text-decoration-none mx-2">
              Contacto
            </a>
          </div>
  
          {/* Social Media Icons Section */}
          <div className="mb-2">
            <a href="#" className="text-white mx-2">
              <FaFacebookF />
            </a>
            <a href="#" className="text-white mx-2">
              <FaXTwitter />
            </a>
            <a href="#" className="text-white mx-2">
              <FaInstagram />
            </a>
          </div>
          <p className="samll mb-0">© 2025 Shoppit</p>
        </div>
      </footer>
    );
  };
  
  export default Footer;