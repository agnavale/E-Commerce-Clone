import { useAuthContext } from "../hooks/useAuthContext";
import { useCartContext } from "../hooks/useCartContext";
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { Link } from "react-router-dom";

const ProductDetails = ({ product }) => {
    const { cart, dispatch } = useCartContext()
    const { user } = useAuthContext()
    const [error, setError] = useState(null)
    const [isAdding, setIsAdding] = useState(false); 
    const navigate = useNavigate()

    const handleClick = async () => {

        if (! user) {
            setError('You must be logged in')
            return
        }

        setIsAdding(true);
        
        if (cart.some(item => item.product_id === product._id)) {
            navigate('/cart');
        } else {
            const data = { product_id: product._id}

            const response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/cart`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type':'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            })

            const json = await response.json()

            if(!response.ok) {
                setError(json.error)
            }else{
                setError(null)
                console.log('added to cart', json)
                dispatch({type: 'ADD_ITEM', payload: json})
            } 
        }
        setIsAdding(false);

    }

    return (
        <div className="product-details">
            <Link to={`/product/${product._id}`} >
                <img src={product.image} alt="product-image" />
                <h4> {product.name} </h4>
            </Link>
            <p> <strong > Price:</strong> {product.price} </p>
            <button onClick = {handleClick} disabled={isAdding}> Add to cart  </button>
            { error && <div className="error"> {error} </div> }
        </div>
    );
};

export default ProductDetails;
