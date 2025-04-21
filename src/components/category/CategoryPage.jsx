import React, { useState, useEffect } from 'react';
import styles from './CategoryPage.module.css';
import api from '../../api';
import HomeCard from '../home/HomeCard';
import Spinner from '../ui/Spinner';
import Error from '../ui/Error';

const CategoryPage = ({ category, title }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Descripciones para cada categoría
    const categoryDescriptions = {
        'ropa-fea': "Prendas con bordados torcidos, cortes inesperados y combinaciones de color deliberadamente extrañas. Cada pieza está diseñada para celebrar la belleza de la imperfección y desafiar las convenciones de la moda tradicional.",
        'ceramica-feista': "Vasijas con formas erráticas, figuritas con expresiones bizarras y tazas que parecen reliquias defectuosas. Nuestras piezas de cerámica están creadas con la intención de ser gloriosamente incorrectas.",
        'decoracion-glitch': "Posters hechos en serigrafía con errores visibles, espejos con marcos desiguales y bordados con mensajes sin sentido. Decoración que celebra las fallas técnicas y las traduce al mundo físico.",
        'accesorios': "Bolsos artesanales con formas extrañas, aretes de arcilla cocida con formas torcidas y gafas con marcos de diseño imposible. Accesorios que complementan tu estilo con un toque de mal gusto elegante."
    };

    // Imágenes de banner para cada categoría
    const categoryBanners = {
        'ropa-fea': "/img/banner-ropa-fea.jpg",
        'ceramica-feista': "/img/banner-ceramica-feista.jpg",
        'decoracion-glitch': "/img/banner-decoracion-glitch.jpg",
        'accesorios': "/img/banner-accesorios.jpg"
    };

    useEffect(() => {
        setLoading(true);
        setError("");

        // Obtener productos filtrados por categoría
        api.get(`/products?category=${category}`)
            .then(res => {
                setProducts(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err.message);
                setError("Ha ocurrido un error al cargar los productos. Tal vez sea una imperfección intencional, pero igualmente lo sentimos.");
                setLoading(false);
            });
    }, [category]);

    return (
        <div className={styles.categoryContainer}>
            <div className={styles.categoryBanner} style={{backgroundImage: `url(${categoryBanners[category]})`}}>
                <div className={styles.bannerOverlay}>
                    <div className="container">
                        <h1 className={styles.categoryTitle}>{title}</h1>
                        <p className={styles.categoryDescription}>
                            {categoryDescriptions[category]}
                        </p>
                    </div>
                </div>
            </div>

            <div className="container py-5">
                {error && <Error error={error} />}
                
                {loading ? (
                    <div className={styles.spinnerContainer}>
                        <Spinner loading={loading} />
                    </div>
                ) : products.length > 0 ? (
                    <>
                        <div className={styles.categoryIntro}>
                            <h2 className={styles.introTitle}>Nuestra colección de {title.toLowerCase()}</h2>
                            <div className={styles.decorativeLine}></div>
                            <p className={styles.introText}>
                                Explora nuestra selección de piezas deliberadamente incorrectas. Cada una cuenta 
                                una historia de imperfección artística que desafía las convenciones del diseño.
                            </p>
                        </div>
                        
                        <div className={styles.filtersSection}>
                            <div className={styles.filterChips}>
                                <span className={`${styles.filterChip} ${styles.active}`}>Todos</span>
                                <span className={styles.filterChip}>Más incorrectos</span>
                                <span className={styles.filterChip}>Novedades</span>
                                <span className={styles.filterChip}>Populares</span>
                            </div>
                            
                            <div className={styles.sortDropdown}>
                                <select className={styles.sortSelect}>
                                    <option value="newest">Más recientes</option>
                                    <option value="price-asc">Precio: menor a mayor</option>
                                    <option value="price-desc">Precio: mayor a menor</option>
                                    <option value="name">Alfabéticamente</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="row g-4">
                            {products.map(product => (
                                <HomeCard key={product.id} products={product} />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className={styles.emptyState}>
                        <img src="/img/incorrect-frog-small.svg" alt="No hay productos" className={styles.emptyStateImage} />
                        <h2 className={styles.emptyStateTitle}>¡Ops! No hay productos en esta categoría</h2>
                        <p className={styles.emptyStateDesc}>
                            Parece que nuestros artesanos están demasiado ocupados creando nuevas incorrecciones. 
                            Vuelve pronto para descubrir piezas únicas en esta categoría.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;