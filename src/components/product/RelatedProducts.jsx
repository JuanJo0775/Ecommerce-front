import React from 'react'
import HomeCard from '../home/HomeCard';

const RelatedProducts = ({products}) => {
    return (
        <section className="py-3 bg-light">
            <div className="container px-4 px-lg-5 mt-3">
                <h2 className="fw-bolder mb-4">Productos relacionados</h2>
                <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
                    {products.map(products => <HomeCard key={products.id} products={products}/> )}
                    {/* <HomeCard /> */}
                </div>
            </div>
        </section>
    );
};

export default RelatedProducts;