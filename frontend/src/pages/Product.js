import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import ProductPage from '../components/ProductPage'

const Product = () => {
    const { id } = useParams()
    const [product, setProduct] = useState()
    
    useEffect(() => {
        const fetchProduct = async () => {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/products/${id}`)
            const json = await response.json();
            console.log(json)

            if (response.status === 404) {
                Navigate("/404", { replace: true }); // Redirect to 404 page
                return;
            }

            if (response.ok) {
                setProduct(json);
            }
        }
        fetchProduct()
    }, [id])

    return (
        <>
            {product ? <ProductPage product={product} /> : <div>...loading </div>}
        </>
    )
}
 
export default Product;