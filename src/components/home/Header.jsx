import React, { useState, useEffect } from 'react';

const subtitles = [
  "Descubre las últimas tendencias con nuestra moderna colección.",
  "Encuentra todo lo que necesitas en nuestra tienda favorita.",
  "Explora nuestra amplia variedad de productos exclusivos.",
  "Sumérgete en un mundo de estilo y elegancia.",
  "Viste a la moda con nuestras últimas novedades.",
  "Renueva tu estilo con piezas únicas y sofisticadas.",
  "Calidad y diseño se unen en cada uno de nuestros productos.",
  "Atrévete a destacar con nuestra selección de artículos premium.",
  "Tu próxima compra favorita te espera aquí.",
  "El mejor lugar para encontrar lo que realmente te gusta.",
  "Diseños que marcan la diferencia en cada temporada.",
  "Compra fácil, rápido y con la mejor calidad garantizada.",
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
    <header className="py-5" style={{ backgroundColor: '#6050DC' }}>
      <div className="container px-4 px-lg-5 my-5">
        <div className="text-center text-white">
          <h1 className="display-4 fw-bold">Bienvenido a tu tienda favorita</h1>
          <p className="lead fw-normal text-white-75 mb-4">{currentSubtitle}</p>
          <a href="#shop" className="btn btn-light btn-lg rounded-pill px-4 py-2">¡¡Compra ahora!!</a>
        </div>
      </div>
    </header>
  );
};

export default Header;