import React from "react";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import './Footer.css';
import pic from '../../assets/incorrect-frog.png';

const Footer = () => {
    return (
      <footer className="footer-incorrect py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-4 mb-md-0">
              <div className="footer-branding">
                <img src={pic} alt="La Tienda Incorrecta" className="footer-logo" />
                <p className="footer-slogan mt-2">"Si está torcido, es perfecto"</p>
              </div>
            </div>
            
            <div className="col-md-4 mb-4 mb-md-0">
              <h5 className="footer-heading">Enlaces Incorrectos</h5>
              <ul className="footer-links">
                <li><a href="/" className="footer-link">Inicio</a></li>
                <li><a href="/manifiesto" className="footer-link">Nuestro Manifiesto</a></li>
                <li><a href="/procesos" className="footer-link">Procesos Incorrectos</a></li>
                <li><a href="/contact" className="footer-link">Contáctanos (si te atreves)</a></li>
              </ul>
            </div>
            
            <div className="col-md-4">
              <h5 className="footer-heading">Síguenos en lo Raro</h5>
              <div className="social-icons">
                <a href="#" className="social-icon">
                  <FaInstagram />
                </a>
                <a href="#" className="social-icon">
                  <FaFacebookF />
                </a>
                <a href="#" className="social-icon">
                  <FaXTwitter />
                </a>
              </div>
              <p className="newsletter-invite">
                Suscríbete a nuestra newsletter para descubrir nuevas maneras de romper las reglas:
              </p>
              <div className="newsletter-form">
                <input type="email" placeholder="tu@email.com" className="newsletter-input" />
                <button type="submit" className="newsletter-button">Unirse</button>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p className="mb-0">© {new Date().getFullYear()} La Tienda Incorrecta • Artesanía incorrecta desde siempre</p>
            <p className="footer-disclaimer">Todos los errores son intencionales (o eso decimos)</p>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;