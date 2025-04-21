import React from 'react';
import styles from './OrderSummary.module.css';
import OrderItem from './OrderItem';

const OrderSummary = ({ cartitems, cartTotal, tax }) => {
    const total = (cartTotal + tax).toFixed(2);

    return (
        <div className="col-lg-7">
            <div className={styles.summaryCard}>
                <div className={styles.summaryHeader}>
                    <h3 className={styles.summaryTitle}>Resumen de tu colección incorrecta</h3>
                </div>
                
                <div className={styles.summaryBody}>
                    <div className={styles.itemsContainer}>
                        {cartitems.map((item) => (
                            <OrderItem key={item.id} cartitem={item} />
                        ))}
                    </div>
                    
                    <div className={styles.summaryTotals}>
                        <div className={styles.summaryRow}>
                            <span className={styles.summaryLabel}>Subtotal:</span>
                            <span className={styles.summaryValue}>${cartTotal.toFixed(2)}</span>
                        </div>
                        
                        <div className={styles.summaryRow}>
                            <span className={styles.summaryLabel}>Impuesto de imperfección (5%):</span>
                            <span className={styles.summaryValue}>${tax.toFixed(2)}</span>
                        </div>
                        
                        <div className={styles.summaryRow}>
                            <span className={styles.summaryLabel}>Envío intencionalmente tardío:</span>
                            <span className={styles.summaryValue}>Gratis</span>
                        </div>
                        
                        <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                            <span className={styles.totalLabel}>Total:</span>
                            <span className={styles.totalValue}>${total}</span>
                        </div>
                    </div>
                </div>
                
                <div className={styles.certificateSection}>
                    <div className={styles.certificateBox}>
                        <div className={styles.certificateHeader}>
                            <img 
                                src="/img/incorrect-frog-small.svg" 
                                alt="La Tienda Incorrecta - Logo" 
                                className={styles.certificateLogo} 
                            />
                            <h4 className={styles.certificateTitle}>Certificado de imperfección</h4>
                        </div>
                        <p className={styles.certificateText}>
                            Este pedido incluye una colección de artículos deliberadamente imperfectos, 
                            seleccionados con esmero para celebrar la belleza de lo incorrecto.
                            Cada pieza ha sido verificada para asegurar que contenga al menos 3 imperfecciones visibles.
                        </p>
                        <div className={styles.certificateStamp}>
                            <span>Garantizado incorrectamente perfecto</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;