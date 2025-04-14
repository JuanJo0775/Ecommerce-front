import Header from "./Header";
import CardContainer from "./CardContainer";
import api from "../../api";
import { useEffect, useState } from "react";
import PlaceHolderContainer from "../ui/PlaceHolderContainer";
import Error from "../ui/Error";
import ProductPage from "../product/ProductPage";
import { randomValue } from "../../GenerateCartCode";

const HomePage = () => { 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("cart_code") === null) {
      localStorage.setItem("cart_code", randomValue);
    }
  }, []);

  useEffect(() => {
    setLoading(true);

    api.get("/products")  
      .then((res) => {
        console.log(res.data);
        setProducts(res.data);
        setError("");
      })
      .catch((err) => {
        console.error(err.message);
        setError(err.message || "Ocurrió un error inesperado");
      })
      .finally(() => {
        setLoading(false); 
      });

  }, []);

  return (
    <>
      <Header />
      {error && <Error error={error} />}
      {loading && <PlaceHolderContainer />}
      {!loading && !error && <CardContainer products={products} />}
    </>
  );
};

export default HomePage;
