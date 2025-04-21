import { useState } from "react";
import api, { BASE_URL } from "../../api";
import { toast } from "react-toastify";
import styles from "./CartItem.module.css";
import { FaTrashAlt, FaSync } from "react-icons/fa";

const CartItem = ({ item, setCartTotal, cartitems, setNumberCartItems, setCartIitems }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [loading, setLoading] = useState(false);

  const itemData = { quantity: quantity, item_id: item.id };
  const itemID = {item_id: item.id};

  function deleteCartitem() {
    const confirmDelete = window.confirm("¿Seguro que quieres eliminar este artículo imperfecto de tu colección?");

    if (confirmDelete) {
      api.post("delete_cartitem/", itemID)
      .then(res => {
        console.log(res.data);

        toast.success("Artículo eliminado de tu colección incorrecta", {
          position: "bottom-right",
          style: {
            background: '#3E3E3E',
            color: '#F4F1ED',
            borderLeft: '5px solid #D9A5A0'
          }
        });

        setCartIitems(cartitems.filter(cartitems => cartitems.id != item.id));

        setCartTotal(cartitems.filter(cartitems =>
          cartitems.id != item.id
        ).reduce((acc, curr) => acc + curr.total, 0));

        setNumberCartItems(cartitems.filter(cartitems => cartitems.id != item.id
        ).reduce((acc, curr) => acc + curr.quantity, 0));
      })
      .catch(err => {
        console.log(err.message);
        toast.error("Algo salió incorrectamente mal", {
          position: "bottom-right",
          style: {
            background: '#3E3E3E',
            color: '#F4F1ED',
            borderLeft: '5px solid #D9A5A0'
          }
        });
      });
    }
  }

  function updateCartItem() {
    setLoading(true);
    api.patch("update_quantity/", itemData)
      .then(res => {
        console.log(res.data);
        setLoading(false);
        toast.success("Cantidad actualizada perfectamente imperfecta", {
          position: "bottom-right",
          style: {
            background: '#3E3E3E',
            color: '#F4F1ED',
            borderLeft: '5px solid #9EBA9B'
          }
        });
        
        setCartTotal(cartitems.map(cartitem =>
          cartitem.id === item.id ? res.data.data : cartitem
        ).reduce((acc, curr) => acc + curr.total, 0));

        setNumberCartItems(cartitems.map(cartitem =>
          cartitem.id === item.id ? res.data.data : cartitem
        ).reduce((acc, curr) => acc + curr.quantity, 0));
      })
      .catch(err => {
        console.log(err.message);
        setLoading(false);
        toast.error("Oh no, algo salió mal... pero de la manera incorrecta correcta", {
          position: "bottom-right",
          style: {
            background: '#3E3E3E',
            color: '#F4F1ED',
            borderLeft: '5px solid #D9A5A0'
          }
        });
      });
  }

  return (
    <div className={styles.cartItemContainer}>
      <div className={styles.cartItem}>
        <div className={styles.productImage}>
          <img
            src={`${BASE_URL}${item.product.image}`}
            alt={item.product.name}
          />
        </div>
        
        <div className={styles.productInfo}>
          <h4 className={styles.productName}>{item.product.name}</h4>
          <p className={styles.productCategory}>
            {item.product.category === "ropa-fea" && "Ropa Fea con Intención"}
            {item.product.category === "ceramica-feista" && "Arte Raro y Cerámica Feísta"}
            {item.product.category === "decoracion-glitch" && "Decoración Glitch-Artesanal"}
            {item.product.category === "accesorios" && "Accesorios de Mal Gusto Elegante"}
            {!item.product.category && "Producto Incorrecto"}
          </p>
          <div className={styles.productPrice}>${item.product.price}</div>
          
          <div className={styles.certBadge}>
            Certificado de Imperfección <span>#INCO-{item.id}</span>
          </div>
        </div>
        
        <div className={styles.quantityControls}>
          <div className={styles.quantityWrapper}>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className={styles.quantityInput}
            />
            <button 
              className={styles.updateBtn}
              onClick={updateCartItem}
              disabled={loading}
            >
              {loading ? (
                <FaSync className={styles.spinIcon} />
              ) : (
                "Actualizar"
              )}
            </button>
          </div>
          
          <button 
            className={styles.deleteBtn}
            onClick={deleteCartitem}
          >
            <FaTrashAlt />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;