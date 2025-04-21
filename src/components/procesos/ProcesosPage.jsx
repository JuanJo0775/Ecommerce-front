import React from 'react';
import styles from './ProcesosPage.module.css';
import { Link } from 'react-router-dom';

const ProcesosPage = () => {
    return (
        <div className={styles.procesosContainer}>
            <div className="container py-5">
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>Procesos Incorrectos</h1>
                    <p className={styles.pageSubtitle}>Cómo se crean nuestras imperfecciones deliberadas</p>
                    <div className={styles.decorativeLine}></div>
                </div>
                
                <div className={styles.procesosIntro}>
                    <p>
                        En La Tienda Incorrecta, elaboramos cada pieza a través de un proceso deliberadamente 
                        imperfecto. Nuestros artesanos han perfeccionado el arte de la inexactitud, la asimetría 
                        y la discontinuidad, creando obras que desafían las convenciones del "buen gusto".
                    </p>
                </div>
                
                <div className={styles.procesosGrid}>
                    <div className={styles.procesoCard}>
                        <div className={styles.procesoNumber}>01</div>
                        <div className={styles.procesoContent}>
                            <h3 className={styles.procesoTitle}>Concepción torcida</h3>
                            <p className={styles.procesoDesc}>
                                Cada producto comienza como un diseño convencional que luego sometemos 
                                a un riguroso proceso de "incorrectificación". Deliberadamente introducimos 
                                elementos disonantes, proporciones inesperadas y combinaciones improbables.
                            </p>
                            <div className={styles.procesoImagePlaceholder}>
                                <img src="/img/proceso-1.jpg" alt="Concepción torcida" />
                            </div>
                        </div>
                    </div>
                    
                    <div className={styles.procesoCard}>
                        <div className={styles.procesoNumber}>02</div>
                        <div className={styles.procesoContent}>
                            <h3 className={styles.procesoTitle}>Selección de materiales incongruentes</h3>
                            <p className={styles.procesoDesc}>
                                Utilizamos materiales reciclados, rescatados y reinterpretados. Mezclamos 
                                texturas que no deberían ir juntas y colores que tradicionalmente "chocan". 
                                La paleta se inspira en tonos vintage deliberadamente deslavados o intensificados.
                            </p>
                            <div className={styles.procesoImagePlaceholder}>
                                <img src="/img/proceso-2.jpg" alt="Materiales incongruentes" />
                            </div>
                        </div>
                    </div>
                    
                    <div className={styles.procesoCard}>
                        <div className={styles.procesoNumber}>03</div>
                        <div className={styles.procesoContent}>
                            <h3 className={styles.procesoTitle}>Elaboración con errores deliberados</h3>
                            <p className={styles.procesoDesc}>
                                Nuestros artesanos trabajan bajo el principio de la "imperfección consciente". 
                                Cada costura desequilibrada, cada corte asimétrico, cada detalle fuera de lugar 
                                es producto de una decisión meditada. Documentamos cada error para asegurar 
                                su intencionalidad.
                            </p>
                            <div className={styles.procesoImagePlaceholder}>
                                <img src="/img/proceso-3.jpg" alt="Elaboración imperfecta" />
                            </div>
                        </div>
                    </div>
                    
                    <div className={styles.procesoCard}>
                        <div className={styles.procesoNumber}>04</div>
                        <div className={styles.procesoContent}>
                            <h3 className={styles.procesoTitle}>Control de calidad al revés</h3>
                            <p className={styles.procesoDesc}>
                                Mientras que otras marcas inspeccionan sus productos en busca de imperfecciones, 
                                nosotros los revisamos para asegurar que tienen al menos tres imperfecciones notables. 
                                Si un producto resulta accidentalmente perfecto, vuelve al taller para ser 
                                adecuadamente incorrectificado.
                            </p>
                            <div className={styles.procesoImagePlaceholder}>
                                <img src="/img/proceso-4.jpg" alt="Control de calidad inverso" />
                            </div>
                        </div>
                    </div>
                    
                    <div className={styles.procesoCard}>
                        <div className={styles.procesoNumber}>05</div>
                        <div className={styles.procesoContent}>
                            <h3 className={styles.procesoTitle}>Certificación de imperfección</h3>
                            <p className={styles.procesoDesc}>
                                Cada producto recibe su "Certificado de Imperfección Artesanal", un documento 
                                que identifica y celebra sus errores deliberados. Este certificado garantiza 
                                la autenticidad de lo incorrectamente hecho.
                            </p>
                            <div className={styles.procesoImagePlaceholder}>
                                <img src="/img/proceso-5.jpg" alt="Certificación" />
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className={styles.workshopSection}>
                    <h2 className={styles.workshopTitle}>Visita nuestro taller imperfecto</h2>
                    <p className={styles.workshopDesc}>
                        Abrimos las puertas de nuestro espacio creativo para que conozcas de cerca 
                        cómo elaboramos nuestras piezas incorrectas. Podrás conversar con nuestros 
                        artesanos y participar en el proceso de "incorrectificación".
                    </p>
                    <div className={styles.workshopDetails}>
                        <div className={styles.workshopDetail}>
                            <h4>Ubicación</h4>
                            <p>Calle Torcida #404, Barrio Extraño</p>
                        </div>
                        <div className={styles.workshopDetail}>
                            <h4>Horarios</h4>
                            <p>De martes a sábado, horarios deliberadamente imprecisos</p>
                        </div>
                        <div className={styles.workshopDetail}>
                            <h4>Reservas</h4>
                            <p>Envía un mensaje textualmente incorrecto a visitas@tiendaincorrecta.com</p>
                        </div>
                    </div>
                </div>
                
                <div className={styles.ctaSection}>
                    <div className={styles.ctaContent}>
                        <h2 className={styles.ctaTitle}>Descubre nuestros productos incorrectos</h2>
                        <p className={styles.ctaDesc}>
                            Ahora que conoces nuestro proceso, te invitamos a explorar nuestra colección 
                            de imperfecciones deliberadas. Cada pieza es única, como debe ser todo lo 
                            adecuadamente incorrecto.
                        </p>
                        <Link to="/" className={styles.ctaButton}>
                            Ver colección incorrecta
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProcesosPage;