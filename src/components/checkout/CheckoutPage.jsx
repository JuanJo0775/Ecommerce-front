import React from 'react';
import OrderSummary from '../checkout/OrderSummary';
import PaySection from './PaymentSection';
import useCartData from '../../hooks/useCartData';
import styles from './CheckoutPage.module.css';
import { Link } from 'react-router-dom';

const CheckoutPage = () => {
    const {cartitems, setCartIitems, cartTotal, setCartTotal, loading, tax} = useCartData();

    if (cartitems.length === 0) {
        return (
            <div className={styles.emptyCheckoutContainer}>
                <div className={styles.emptyCheckout}>
                    <img 
                        src="/img/incorrect-frog-small.svg" 
                        alt="Checkout vacío" 
                        className={styles.emptyCheckoutImage}
                    />
                    <h2 className={styles.emptyCheckoutTitle}>No hay nada que pagar</h2>
                    <p className={styles.emptyCheckoutMessage}>
                        Parece que no tienes ningún artículo en tu carrito. 
                        Primero debes añadir algunas incorrecciones a tu colección.
                    </p>
                    <Link to="/" className={styles.backToShopBtn}>
                        Volver a la tienda
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.checkoutContainer}>
            <div className="container py-5">
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>Finalizar compra incorrecta</h1>
                    <p className={styles.pageSubtitle}>Solo unos pasos más para recibir tus imperfecciones</p>
                    <div className={styles.decorativeLine}></div>
                </div>
                
                <div className={styles.checkoutSteps}>
                    <div className={`${styles.checkoutStep} ${styles.activeStep}`}>
                        <span className={styles.stepNumber}>1</span>
                        <span className={styles.stepName}>Revisión</span>
                    </div>
                    <div className={styles.stepDivider}></div>
                    <div className={`${styles.checkoutStep} ${styles.activeStep}`}>
                        <span className={styles.stepNumber}>2</span>
                        <span className={styles.stepName}>Pago</span>
                    </div>
                    <div className={styles.stepDivider}></div>
                    <div className={styles.checkoutStep}>
                        <span className={styles.stepNumber}>3</span>
                        <span className={styles.stepName}>Confirmación</span>
                    </div>
                </div>
                
                <div className="row mt-5">
                    <OrderSummary cartitems={cartitems} cartTotal={cartTotal} tax={tax}/>
                    <PaySection />
                </div>
                
                <div className={styles.checkoutFooter}>
                    <div className={styles.footerInfo}>
                        <h4 className={styles.footerInfoTitle}>Política de entrega incorrecta</h4>
                        <p className={styles.footerInfoText}>
                            Nos esforzamos por entregar tu pedido en un plazo aproximado, nunca exacto.
                            Nuestro servicio de envío es deliberadamente impredecible, como parte de nuestra
                            filosofía de celebrar lo inesperado. Sin embargo, garantizamos la entrega en un
                            margen de 3-7 días hábiles.
                        </p>
                    </div>
                    
                    <div className={styles.footerInfo}>
                        <h4 className={styles.footerInfoTitle}>Garantía de insatisfacción</h4>
                        <p className={styles.footerInfoText}>
                            Todos nuestros productos tienen certificado de imperfección. Si encuentras que alguno
                            de ellos es accidentalmente perfecto, te lo cambiamos por uno adecuadamente defectuoso.
                            Recuerda que cada pieza es única, y las imperfecciones pueden variar.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;