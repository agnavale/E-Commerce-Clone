import { useState } from "react";
import ProductDetails from "../components/ProductDetails";
import SearchBar from "../components/SearchBar";


const Home = () => {
    const [products, setProducts] = useState([]);
  
    return (
        <div className="home">
            <div className="products">
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductDetails key={product._id} product={product} />
                    ))
                ) : (
                    <p></p>
                )}
            </div>
            <SearchBar setProducts={setProducts} />
        </div>
    );
};

export default Home;
