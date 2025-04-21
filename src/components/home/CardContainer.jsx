import HomeCard from "./HomeCard";
import React from "react";
import styles from "./CardContainer.module.css";

const CardContainer = ({products}) => {
  // Función para agrupar productos en filas de 3
  const groupProductsByRow = (products, itemsPerRow = 3) => {
    const rows = [];
    for (let i = 0; i < products.length; i += itemsPerRow) {
      rows.push(products.slice(i, i + itemsPerRow));
    }
    return rows;
  };

  // Agrupar productos en filas de 3
  const productRows = groupProductsByRow(products);

  return (
    <section className={styles.productsSection} id="shop">
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Nuestras Creaciones Incorrectas</h2>
        <p className={styles.sectionSubtitle}>Cada pieza cuenta su propia historia de imperfección</p>
        <div className={styles.decorativeLine}></div>
      </div>
      
      <div className="container px-4 px-lg-5 mt-5">
        <div className={styles.filterTabs}>
          <button className={`${styles.filterTab} ${styles.active}`}>Todo</button>
          <button className={styles.filterTab}>Ropa Fea</button>
          <button className={styles.filterTab}>Arte Raro</button>
          <button className={styles.filterTab}>Decoración Glitch</button>
          <button className={styles.filterTab}>Accesorios</button>
        </div>
        
        {/* Renderizar productos por filas */}
        {productRows.map((row, index) => (
          <div key={index} className="row g-4 justify-content-center mb-4">
            {row.map(product => (
              <div className="col-md-4" key={product.id}>
                <HomeCard products={product}/>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default CardContainer;