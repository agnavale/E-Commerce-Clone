import { useState, useEffect } from "react";
import ProductDetails from "../components/ProductDetails";
import SearchBar from "../components/SearchBar";


const Home = () => {
    const [products, setProducts] = useState([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        if( query.trim() === "") {
            setProducts([])
            return
        }
        const fetchProducts = async () => {
            const response = await fetch(`/api/products?search=${query}`);
            const json = await response.json();

            if (response.ok) {
                setProducts(json);
            }
        };
        const delayDebounce = setTimeout(fetchProducts, 500); 
        return () => clearTimeout(delayDebounce);
    }, [query]);

    return (
        <div className="home">
            <div className="products">
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductDetails key={product._id} product={product} />
                    ))
                ) : (
                    query && <p>No products found.</p>
                )}
            </div>
            <SearchBar setQuery={setQuery} />
        </div>
    );
};

export default Home;
