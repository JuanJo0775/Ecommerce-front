import { BASE_URL } from "../../api";
import styles from "./HomeCard.module.css";
import { Link } from 'react-router-dom';

const HomeCard = ({products}) => {
  // Función para determinar el texto de la etiqueta según la categoría
  const getTagText = (category) => {
    switch(category) {
      case "ropa-fea":
        return "Ropa Fea";
      case "ceramica-feista":
        return "Arte Raro";
      case "decoracion-glitch":
        return "Glitch-Deco";
      case "accesorios":
        return "Mal Gusto";
      default:
        return "Incorrecta";
    }
  };

  return (
    <div className={styles.col}>
      <Link to={`/products/${products.slug}`} className={styles.link}>
        <div className={styles.card}>
          <div className={styles.tagContainer}>
            <span className={styles.tag}>{getTagText(products.category)}</span>
          </div>
          <div className={styles.cardImgWrapper}>
            <img
              src={`${BASE_URL}${products.image}`}
              className={styles.cardImgTop}
              alt={products.name}
            />
            <div className={styles.cardHoverEffect}></div>
          </div>
          <div className={styles.cardBody}>
            <h5 className={styles.cardTitle}>{products.name}</h5>
            <div className={styles.cardDetails}>
              <p className={styles.cardDescription}>{products.description && products.description.substring(0, 60)}...</p>
              <h6 className={styles.cardPrice}>${products.price}</h6>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default HomeCard;