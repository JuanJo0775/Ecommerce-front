import { useEffect, useState } from "react";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import Spinner from "../ui/Spinner";
import useCartData from "../../hooks/useCartData";
import styles from "./CartPage.module.css";
import { Link } from "react-router-dom";
import pic from '../../assets//empty-cart-frog.png';

const CartPage = ({setNumberCartItems}) => {
    const {cartitems, setCartIitems, cartTotal, setCartTotal, loading, tax} = useCartData();

    if (loading) {
        return <Spinner loading={loading} />;
    }

    if (cartitems.length < 1) {
        return (
            <div className={styles.emptyCartContainer}>
                <div className={styles.emptyCart}>
                    <img 
                        src={pic} 
                        alt="Carrito vacío" 
                        className={styles.emptyCartImage}
                    />
                    <h2 className={styles.emptyCartTitle}>Tu colección incorrecta está vacía</h2>
                    <p className={styles.emptyCartMessage}>
                        Parece que aún no has añadido ninguna pieza incorrecta a tu colección. 
                        ¿Te animas a descubrir nuestras imperfecciones deliberadas?
                    </p>
                    <Link to="/" className={styles.continueShopping}>
                        Explorar productos incorrectos
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.cartPageContainer}>
            <div className="container py-5">
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>Tu colección incorrecta</h1>
                    <p className={styles.pageSubtitle}>Cada imperfección cuenta una historia</p>
                    <div className={styles.decorativeLine}></div>
                </div>
                
                <div className="row mt-5">
                    <div className="col-lg-8">
                        <div className={styles.cartItemsContainer}>
                            {cartitems.map(item => (
                                <CartItem 
                                    key={item.id} 
                                    item={item} 
                                    cartitems={cartitems} 
                                    setCartIitems={setCartIitems} 
                                    setCartTotal={setCartTotal} 
                                    setNumberCartItems={setNumberCartItems}
                                />
                            ))}
                        </div>
                        
                        <div className={styles.cartActions}>
                            <Link to="/" className={styles.continueShoppingBtn}>
                                Seguir explorando incorrecciones
                            </Link>
                        </div>
                    </div>
                    
                    <CartSummary cartTotal={cartTotal} tax={tax} />
                </div>
            </div>
        </div>
    );
};

export default CartPage;