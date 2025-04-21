import { useParams } from "react-router-dom";
import ProductPagePlaceHolder from "./ProductPagePlaceHolder";
import RelatedProducts from "./RelatedProducts";
import { useEffect, useState } from "react";
import api, { BASE_URL } from "../../api";
import { toast } from "react-toastify";
import styles from "./ProductPage.module.css";
import { FaShoppingBag, FaHeart, FaShareAlt } from "react-icons/fa";

const ProductPage = ({ setNumberCartItems }) => {
  const { slug } = useParams();
  const [product, setProduct] = useState({});
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [quantity, setQuantity] = useState(1);  
  const cart_code = localStorage.getItem("cart_code");
  const [selectedImage, setSelectedImage] = useState(0);

  // Simulamos tener múltiples imágenes para cada producto
  const getProductImages = (mainImage) => {
    if (!mainImage) return [];
    
    // En un escenario real, obtendrías todas las imágenes del producto desde la API
    // Aquí lo simulamos con la misma imagen en diferentes ángulos
    return [
      mainImage,
      mainImage, // En producción, estas serían diferentes imágenes
      mainImage,
    ];
  };

  // Texto aleatorio de certificación de imperfección
  const imperfectionCertificate = [
    "Certificamos que este producto tiene al menos 3 imperfecciones artesanales.",
    "Esta pieza incluye defectos intencionales que la hacen única.",
    "Nuestros artesanos trabajaron duro para asegurar que este producto no sea perfecto.",
    "Orgullosamente imperfecto y deliberadamente incorrecto."
  ];
  
  const randomCertificate = () => {
    const random = Math.floor(Math.random() * imperfectionCertificate.length);
    return imperfectionCertificate[random];
  };

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
        toast.success("¡Añadido a tu colección incorrecta!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          style: {
            background: '#3E3E3E',
            color: '#F4F1ED',
            borderLeft: '5px solid #9EBA9B'
          }
        });
        setNumberCartItems(curr => curr + quantity);  
      })
      .catch(err => {
        console.log(err.message);
        toast.error("Algo salió mal... apropiadamente incorrecto.", {
          position: "bottom-right",
          style: {
            background: '#3E3E3E',
            color: '#F4F1ED',
            borderLeft: '5px solid #D9A5A0'
          }
        });
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

  // Obtener todas las imágenes del producto
  const productImages = getProductImages(`${BASE_URL}${product.image}`);

  // Determinamos la categoría del producto para mostrar el texto adecuado
  const getCategoryText = (category) => {
    switch(category) {
      case "ropa-fea":
        return "Ropa Fea con Intención";
      case "ceramica-feista":
        return "Arte Raro y Cerámica Feísta";
      case "decoracion-glitch":
        return "Decoración Glitch-Artesanal";
      case "accesorios":
        return "Accesorios de Mal Gusto Elegante";
      default:
        return "Producto Incorrecto";
    }
  };

  return (
    <div className={styles.productPage}>
      <section className={styles.productSection}>
        <div className="container">
          <div className={styles.breadcrumbs}>
            <a href="/">Inicio</a> / 
            <a href={`/categoria/${product.category || 'productos'}`}> {getCategoryText(product.category)}</a> / 
            <span> {product.name}</span>
          </div>
          
          <div className="row">
            <div className="col-md-7">
              <div className={styles.productGallery}>
                <div className={styles.mainImage}>
                  <img 
                    src={productImages[selectedImage]} 
                    alt={product.name || "Producto Incorrecto"} 
                  />
                </div>
                {productImages.length > 1 && (
                  <div className={styles.thumbnails}>
                    {productImages.map((img, idx) => (
                      <div 
                        key={idx} 
                        className={`${styles.thumbnail} ${selectedImage === idx ? styles.active : ''}`}
                        onClick={() => setSelectedImage(idx)}
                      >
                        <img src={img} alt={`Vista ${idx + 1}`} />
                      </div>
                    ))}
                  </div>
                )}
                <div className={styles.certificationBadge}>
                  <span>{randomCertificate()}</span>
                </div>
              </div>
            </div>
            
            <div className="col-md-5">
              <div className={styles.productInfo}>
                <div className={styles.productCategory}>
                  {getCategoryText(product.category)}
                </div>
                <h1 className={styles.productTitle}>{product.name || "Producto Maravillosamente Incorrecto"}</h1>
                
                <div className={styles.productPrice}>
                  {product.old_price && (
                    <span className={styles.oldPrice}>${product.old_price}</span>
                  )}
                  <span className={styles.currentPrice}>${product.price || "Precio Incorrecto"}</span>
                </div>
                
                <div className={styles.productDescription}>
                  <p>{product.description || "Una descripción adecuadamente imperfecta para este producto pronto aparecerá aquí."}</p>
                </div>
                
                <div className={styles.skuInfo}>
                  <span>SKU: {product.sku || "INCORRECTA-" + Math.floor(Math.random() * 1000)}</span>
                </div>
                
                <div className={styles.addToCart}>
                  <div className={styles.quantity}>
                    <button 
                      className={styles.quantityBtn} 
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      min="1" 
                      value={quantity} 
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className={styles.quantityInput}
                    />
                    <button 
                      className={styles.quantityBtn} 
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  
                  <button 
                    className={styles.addToCartBtn}
                    onClick={add_item}
                    disabled={inCart}
                  >
                    <FaShoppingBag className={styles.btnIcon} />
                    {inCart ? "En tu colección incorrecta" : "Añadir a la colección"}
                  </button>
                </div>
                
                <div className={styles.productActions}>
                  <button className={styles.actionBtn}>
                    <FaHeart /> Añadir a favoritos
                  </button>
                  <button className={styles.actionBtn}>
                    <FaShareAlt /> Compartir
                  </button>
                </div>
                
                <div className={styles.shipping}>
                  <p>Envío: Entrega deliberadamente impredecible (3-7 días)</p>
                  <p>Devoluciones: Aceptamos devoluciones de productos si los encuentras accidentalmente perfectos.</p>
                </div>
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