import React from 'react';
import styles from './ManifiestoPage.module.css';

const ManifiestoPage = () => {
    return (
        <div className={styles.manifestoContainer}>
            <div className="container py-5">
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>Nuestro Manifiesto Incorrecto</h1>
                    <div className={styles.decorativeLine}></div>
                </div>
                
                <div className={styles.manifestoContent}>
                    <div className={styles.manifestoIntro}>
                        <div className={styles.introImage}>
                            <img src="/img/incorrect-frog.svg" alt="La Tienda Incorrecta" />
                        </div>
                        <div className={styles.introText}>
                            <p className={styles.introParagraph}>
                                <span className={styles.bigQuote}>"</span>
                                La Tienda Incorrecta nace del deseo de romper las reglas del buen gusto, 
                                celebrando lo extraño, lo roto, lo fuera de lugar. Cada producto, publicación 
                                y detalle es una declaración: <strong>no necesitas encajar para destacar</strong>.
                                <span className={styles.bigQuote}>"</span>
                            </p>
                            <p className={styles.introSignature}>— El Comité de Incorrecciones Deliberadas</p>
                        </div>
                    </div>
                    
                    <div className={styles.manifestoSection}>
                        <h2 className={styles.sectionTitle}>Antimoda artesanal</h2>
                        <p>
                            Valoramos lo hecho a mano, incluso si está "mal hecho". Nuestros productos 
                            son deliberadamente imperfectos, creados por artesanos que han dominado el 
                            arte de equivocarse con intención. Cada costura torcida, cada corte asimétrico, 
                            cada color fuera de lugar está ahí porque queremos que esté ahí.
                        </p>
                        <div className={styles.manifestoQuote}>
                            <blockquote>"La belleza está sobrevalorada."</blockquote>
                        </div>
                    </div>
                    
                    <div className={styles.manifestoSection}>
                        <h2 className={styles.sectionTitle}>Con actitud y pasado</h2>
                        <p>
                            Nos inspiramos en lo vintage, pero sin caer en lo clásico. Tomamos elementos 
                            del art déco y los deformamos, les damos un giro inesperado. Nuestras piezas 
                            se sienten como si hubieran sido rescatadas de un universo paralelo donde 
                            las reglas de diseño se escribieron de manera diferente.
                        </p>
                        <p>
                            Cada prenda, cada pieza de cerámica, cada accesorio tiene su propia historia 
                            de rebeldía estética. Son objetos con personalidad, que no temen ser diferentes.
                        </p>
                    </div>
                    
                    <div className={styles.manifestoSection}>
                        <h2 className={styles.sectionTitle}>Humor de taller</h2>
                        <p>
                            Entre la ironía y la ternura de lo manual, construimos una narrativa que desafía 
                            lo convencional. No nos tomamos demasiado en serio, pero nos tomamos muy en serio 
                            no tomarnos en serio. ¿Suena contradictorio? Perfecto.
                        </p>
                        <div className={styles.manifestoQuote}>
                            <blockquote>"Diseño con errores (a propósito)."</blockquote>
                        </div>
                    </div>
                    
                    <div className={styles.manifestoSection}>
                        <h2 className={styles.sectionTitle}>Certificado de imperfección</h2>
                        <p>
                            Cada producto viene con nuestro "Certificado de Imperfección Artesanal", 
                            que garantiza que la pieza contiene al menos tres imperfecciones deliberadas. 
                            Si encuentras alguna de nuestras creaciones accidentalmente perfecta, te la 
                            cambiamos por una adecuadamente incorrecta.
                        </p>
                    </div>
                    
                    <div className={styles.manifestoConclusion}>
                        <p>
                            "La Tienda Incorrecta" fusiona lo art déco, lo artesanal y lo absurdo en una propuesta 
                            estética única. La imperfección no solo se acepta, se enmarca como virtud. Si estás 
                            cansado del diseño perfecto... aquí es donde empieza lo bueno.
                        </p>
                        <div className={styles.manifestoSignature}>
                            <img src="/img/incorrect-frog-small.svg" alt="Firma" />
                            <span>Artesanía incorrecta desde siempre.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManifiestoPage;