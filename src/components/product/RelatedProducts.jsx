import React from 'react';
import HomeCard from '../home/HomeCard';
import styles from './RelatedProducts.module.css';

const RelatedProducts = ({products}) => {
    if (!products || products.length === 0) {
        return null;
    }

    return (
        <section className={styles.relatedSection}>
            <div className="container px-4 px-lg-5">
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Otras Incorrecciones que podrían gustarte</h2>
                    <div className={styles.decorativeLine}></div>
                </div>
                <div className="row g-4 justify-content-center">
                    {products.map(product => <HomeCard key={product.id} products={product}/>)}
                </div>
            </div>
        </section>
    );
};

export default RelatedProducts;