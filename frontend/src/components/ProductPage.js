import { useAuthContext } from "../hooks/useAuthContext";
import { useCartContext } from "../hooks/useCartContext";
import { useNavigate } from 'react-router-dom';
import { useState } from "react";


const ProductPage = ({ product }) => {
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
        <div className="product-page">
            <div className="left">
                <img src={product.image} alt="product-image" />
            </div>
            <div className="right">
                <h1> {product.name} </h1>
                <hr />
                <p> <strong > Price:</strong> {product.price} </p>
                <p> <strong > Stock:</strong>  {product.stock} </p>
               
                <p> {product.description} </p>
               
                <button onClick = {handleClick} disabled={isAdding}> Add to cart  </button>
                { error && <div className="error"> {error} </div> }
            </div>
        </div>
    );
};

export default ProductPage;
