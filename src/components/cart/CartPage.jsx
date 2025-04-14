import { useEffect, useState } from "react"
import CartItem from "./CartItem"
import CartSummary from "./CartSummary"
import api from "../../api"
import Spinner from "../ui/Spinner"
import { useActionData } from "react-router-dom"
import useCartData from "../../hooks/useCartData"

const CartPage = ({setNumberCartItems}) => {

        const {cartitems, setCartIitems, cartTotal, setCartTotal, loading, tax} = useCartData()

       
        if (loading){
            return <Spinner loading={loading}/>
        }

        if(cartitems.length < 1){
            return (<div className="alert alert-primary my-5" role="alert">
                Ningún artículo en tu carrito.
              </div>)
        }

    return (
        <div className="container my-3 py-3" style={{ height: "80vh", overflow: "scroll" }}>
            <h5 className="mb-4">Carrito de la compra</h5>
            <div className="row">
                <div className="col-md-8">
                    {cartitems.map(item => <CartItem key={item.id} item={item} cartitems={cartitems} 
                    setCartIitems= {setCartIitems} setCartTotal={setCartTotal} setNumberCartItems={setNumberCartItems}/>)}
                    
                </div>
                <CartSummary  cartTotal={cartTotal} tax={tax}/>
            </div>
        </div>
    )
}

export default CartPage