import { useState, useEffect } from "react";
import ProductDetails from "../components/ProductDetails";


const Home = () => {
    const [products, setProducts] = useState(null)
    

    useEffect(() => {
        const fetchProducts = async () => {
            
            const response = await fetch('/api/products')
            const json = await response.json()
            console.log(json)

            if(response.ok){
                setProducts(json)
            }
        }
        fetchProducts()
    }, [setProducts])
    
    return ( 
        <div className="home">
            <div className="products">
                {products && products.map((product) => (
                    <ProductDetails key= {product._id} product={product} />
                ))}
            </div>
        </div>
    );
}
 
export default Home;