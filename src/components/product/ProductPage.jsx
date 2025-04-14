import { useParams } from "react-router-dom";
import ProductPagePlaceHolder from "./ProductPagePlaceHolder";
import RelatedProducts from "./RelatedProducts";
import { useEffect, useState } from "react";
import api, { BASE_URL } from "../../api";
import { toast } from "react-toastify";

const ProductPage = ({ setNumberCartItems }) => {
  const { slug } = useParams();
  const [product, setProduct] = useState({});
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [quantity, setQuantity] = useState(1);  
  const cart_code = localStorage.getItem("cart_code");

  useEffect(() => {
    if (product.id) {
      api.get(`product_in_cart?cart_code=${cart_code}&product_id=${product.id}`)
        .then(res => {
          setInCart(res.data.product_in_cart);
        })
        .catch(err => {
          console.log(err.message);
        });
    }
  }, [cart_code, product.id]);

  const newItem = {
    cart_code: cart_code,
    product_id: product.id,
    quantity: quantity  
  };

  function add_item() {
    api.post("add_item/", newItem)
      .then(res => {
        console.log(res.data);
        setInCart(true);
        toast.success("Articulo añadido al carrito!")
        setNumberCartItems(curr => curr + quantity);  
      })
      .catch(err => {
        console.log(err.message);
      });
  }

  useEffect(() => {
    setLoading(true);
    api.get(`product_detail/${slug}`)
      .then(res => {
        setProduct(res.data);
        setSimilarProducts(res.data.similar_products || []);
        setLoading(false);
      })
      .catch(err => {
        console.log(err.message);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return <ProductPagePlaceHolder />;
  }

  return (
    <div>
      <section className="py-3">
        <div className="container px-4 px-lg-5 my-5">
          <div className="row gx-4 gx-lg-5 align-items-center">
            <div className="col-md-6">
              <img
                className="card-img-top mb-5 mb-md-0"
                src={`${BASE_URL}${product.image}`}
                alt={product.name || "Product Image"}
              />
            </div>
            <div className="col-md-6">
              <div className="small mb-1">SKU: {product.sku || "N/A"}</div>
              <h1 className="display-5 fw-bolder">{product.name || "Shop item template"}</h1>
              <div className="fs-5 mb-5">
                <span className="text-decoration-line-through">${product.old_price || ""}</span>
                <span>${product.price || "Precio no disponible"}</span>
              </div>
              <p className="lead">{product.description || "Descripción no disponible"}</p>
              <div className="d-flex">
                <input
                  type="number"
                  min="1"
                  className="form-control me-3"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))} 
                  style={{ width: '70px' }}
                />
                <button className="btn btn-outline-dark flex-shrink-0"
                  type="button"
                  onClick={add_item}
                  disabled={inCart}
                >
                  <i className="bi-cart-fill me-1"></i>
                  {inCart ? "Producto añadido al carrito" : "Añadir al carrito"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <RelatedProducts products={similarProducts} />
    </div>
  );
};

export default ProductPage;
