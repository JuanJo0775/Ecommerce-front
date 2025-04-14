import HomeCard from "./HomeCard";
import React from "react";

const CardContainer = ({products}) => {
  return (
    <section className="py-5" id="shop">
      <h4 style={{ textAlign: "center" }}>Nuestros Productos</h4>
      <div className="container px-4 px-lg-5 mt-5">
        <div className="row justify-content-center">
          {products.map(products => <HomeCard key={products.id} products={products}/>)}
          
        </div>
      </div>
    </section>
  );
};

export default CardContainer;