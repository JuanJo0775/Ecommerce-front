import React from 'react';
import { BASE_URL } from '../../api';
import styles from './OrderItem.module.css';

const OrderItem = ({cartitem}) => {
    // Función para determinar el texto de la categoría
    const getCategoryText = (category) => {
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
        <div className={styles.orderItem}>
            <div className={styles.itemImage}>
                <img
                    src={`${BASE_URL}${cartitem.product.image}`}
                    alt={cartitem.product.name}
                />
                <div className={styles.itemTag}>
                    {getCategoryText(cartitem.product.category)}
                </div>
            </div>
            <div className={styles.itemDetails}>
                <h5 className={styles.itemName}>{cartitem.product.name}</h5>
                <div className={styles.itemMeta}>
                    <span className={styles.itemQuantity}>Cantidad: {cartitem.quantity}</span>
                    <span className={styles.itemPrice}>${cartitem.product.price}</span>
                </div>
                <div className={styles.itemTotal}>
                    <span>Subtotal: </span>
                    <span className={styles.totalPrice}>${(cartitem.product.price * cartitem.quantity).toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

export default OrderItem;