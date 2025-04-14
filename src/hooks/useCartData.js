import { useState, useEffect } from "react"
import api from "../api"

function useCartData(){
        const cart_code = localStorage.getItem("cart_code")
        const [cartitems, setCartIitems] = useState([])
        const [cartTotal, setCartTotal] = useState(0.00)
        const tax = 4.00
        const [loading, setLoading] = useState(false)


        useEffect(function(){
            setLoading(true)
            api.get(`get_cart?cart_code=${cart_code}`)
            .then(res => {
                console.log(res.data)
                setLoading(false)
                setCartIitems(res.data.items)
                setCartTotal(res.data.sum_total)
            })

            .catch(err => {
                console.log(err.message)
                setLoading(false)
            })
        }, [cart_code])

        return{cartitems, setCartIitems, cartTotal, setCartTotal, loading, tax}
}

export default useCartData