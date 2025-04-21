import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CartSummary.module.css';

const CartSummary = ({cartTotal, tax}) => {
    const subTotal = cartTotal.toFixed(2);
    const cartTax = tax.toFixed(2);
    const total = (cartTotal + tax).toFixed(2);

    return (
        <div className="col-lg-4">
            <div className={styles.summaryCard}>
                <div className={styles.summaryHeader}>
                    <h3 className={styles.summaryTitle}>Resumen de tu colección</h3>
                </div>
                
                <div className={styles.summaryBody}>
                    <div className={styles.summaryRow}>
                        <span className={styles.summaryLabel}>Subtotal:</span>
                        <span className={styles.summaryValue}>${subTotal}</span>
                    </div>
                    
                    <div className={styles.summaryRow}>
                        <span className={styles.summaryLabel}>Impuesto de imperfección:</span>
                        <span className={styles.summaryValue}>${cartTax}</span>
                    </div>
                    
                    <div className={styles.summaryRow}>
                        <span className={styles.summaryLabel}>Envío deliberadamente impreciso:</span>
                        <span className={styles.summaryValue}>Gratis</span>
                    </div>
                    
                    <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                        <span className={styles.totalLabel}>Total:</span>
                        <span className={styles.totalValue}>${total}</span>
                    </div>
                </div>
                
                <div className={styles.summaryFooter}>
                    <Link to="/checkout" className={styles.checkoutButton}>
                        Proceder al pago incorrecto
                    </Link>
                    
                    <div className={styles.secureInfo}>
                        <div className={styles.secureText}>
                            <span>Pago 99% seguro</span>
                            <small className={styles.secureSubtext}>
                                (Dejamos un 1% a la incertidumbre artística)
                            </small>
                        </div>
                    </div>
                </div>
                
                <div className={styles.guaranteeBox}>
                    <span className={styles.guaranteeText}>
                        Garantía de insatisfacción incorrecta
                    </span>
                    <p className={styles.guaranteeMessage}>
                        Si encuentras que alguno de nuestros productos es accidentalmente perfecto, 
                        te lo cambiamos por uno adecuadamente imperfecto.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CartSummary;