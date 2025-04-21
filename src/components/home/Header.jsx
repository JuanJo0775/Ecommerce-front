import React, { useState, useEffect } from 'react';
import './Header.css'; 
import pic from '../../assets/incorrect-frog.png';

const subtitles = [
  "Diseño con errores (a propósito).",
  "Feo. Raro. Perfecto para ti.",
  "La belleza está sobrevalorada.",
  "Artesanía incorrecta desde siempre.",
  "Piezas únicas, descaradamente imperfectas.",
  "Si buscas perfección, estás en el lugar equivocado.",
  "Celebrando el lado torcido del diseño desde siempre.",
  "Donde los errores son nuestra especialidad.",
  "Arte que no pide disculpas por ser diferente.",
  "Cada imperfección cuenta una historia.",
  "Diseño art déco... con un problemita o dos.",
  "Rompiendo las reglas del buen gusto, con estilo."
];

const Header = () => {
  const [currentSubtitle, setCurrentSubtitle] = useState(subtitles[0]);

  const changeSubtitle = () => {
    const randomIndex = Math.floor(Math.random() * subtitles.length);
    setCurrentSubtitle(subtitles[randomIndex]);
  };

  useEffect(() => {
    const intervalId = setInterval(changeSubtitle, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <header className="py-5 header-incorrect">
      <div className="container px-4 px-lg-5 my-5 text-center">
        <div className="header-content">
          <div className="logo-container">
            <img src={pic} alt="La Tienda Incorrecta - Logo" className="logo-frog" />
          </div>
          <h1 className="display-4 fw-bold">La Tienda Incorrecta</h1>
          <p className="lead fw-normal subtitle-text mb-4">{currentSubtitle}</p>
          <a href="#shop" className="btn btn-shop rounded-pill px-4 py-2">
            ¡Compra algo raro!
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;