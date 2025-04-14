import React from 'react'
import OrderSummary from '../checkout/OrderSummary';
import PaySection from './PaymentSection';
import useCartData from '../../hooks/useCartData';

const CheckoutPage = () => {

    const {cartitems, setCartIitems, cartTotal, setCartTotal, loading, tax} = useCartData()

    return (
        <div className="container my-3">
            <div className="row">
                <OrderSummary cartitems={cartitems} cartTotal={cartTotal} tax={tax}/>
                <PaySection />
            </div>
        </div>
    )
}

export default CheckoutPage