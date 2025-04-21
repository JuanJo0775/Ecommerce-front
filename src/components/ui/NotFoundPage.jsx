import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

const NotFoundPage = () => {
  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.notFoundContent}>
        <div className={styles.imageContainer}>
          <img src="/img/incorrect-frog.svg" alt="La Tienda Incorrecta" className={styles.notFoundImage} />
        </div>
        
        <h1 className={styles.notFoundTitle}>404</h1>
        <h2 className={styles.notFoundSubtitle}>Página incorrectamente extraviada</h2>
        
        <p className={styles.notFoundMessage}>
          Esta página se ha perdido deliberadamente como parte de nuestra filosofía de celebrar la imperfección. 
          Podríamos decir que es un error, pero preferimos pensar que es una oportunidad para explorar otros 
          rincones de nuestra tienda.
        </p>
        
        <div className={styles.notFoundBadge}>
          <span>Certificado de Ausencia Artesanal</span>
        </div>
        
        <div className={styles.actionButtons}>
          <Link to="/" className={styles.mainButton}>
            Volver a la incorrecta normalidad
          </Link>
          <Link to="/manifiesto" className={styles.secondaryButton}>
            Leer nuestro manifiesto
          </Link>
        </div>
        
        <div className={styles.notFoundFooter}>
          <p>
            "A veces, perderse es la manera más correcta de encontrarse."
          </p>
          <span className={styles.footerSignature}>— El Comité de Incorrecciones Deliberadas</span>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;