import { useState, useEffect } from "react"
import { useAuthContext } from "../hooks/useAuthContext"
import { useCartContext } from "../hooks/useCartContext"

const CartDetails = ({item}) => {
    const { dispatch } = useCartContext()
    const { user } = useAuthContext()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // check if enough stock
    useEffect(() => {
        if (item.qty > item.stock) {
            setError("Not enough stock");
        } else {
            setError(""); 
        }
    }, [item.qty, item.stock]); 

    const handleDelete = async () => {
        if (!user) {
            return
        }
        setLoading(true)
        const BASE_URL = process.env.REACT_APP_BACKEND_URI;
        
        const response = await fetch(`${BASE_URL}/api/cart/${item.product_id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()
        console.log(json)

        if (response.ok){
            dispatch({type:'DELETE_ITEM', payload: {_id: item._id}})
        }
        setLoading(false)
    }

    const handleQtyChange = (val) => {
        return async() => {
            if (!user) {
                return
            }
            if (item.qty + val === 0) {
                await handleDelete();  
                return;
            }
            if( item.qty + val > item.stock){
                setError('not enough stock')
                return
            }

            setLoading(true)
            const BASE_URL = process.env.REACT_APP_BACKEND_URI;
            
            const response = await fetch(`${BASE_URL}/api/cart/${item.product_id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({qty: item.qty + val})
            })
            const json = await response.json()
    
            if (response.ok){
                dispatch({type:'UPDATE_ITEM', payload: json})
            }
            setLoading(false)
        }
    }

    return ( 
        <div className="cart-details">
            <div> 
                <img src= "images/product.avif" alt="product-image" />
            </div>
            <div className= {item.stock === 0 ? "strike": ""}>
                <h4> {item.name} </h4>
                <p> <strong >Price:</strong>  {item.price} </p>
                <p> <strong >Stock:</strong>  {item.stock} </p>

                { item.stock === 0 ? (
                    <div className="error"> Out of Stock </div>
                ):(
                     <div className="quantity">
                        <button onClick={handleQtyChange(-1)} disabled={loading}>-</button>
                        <p> {item.qty} </p>
                        <button onClick={handleQtyChange(+1)}  disabled={loading}>+</button>
                        {error && <div className="error"> {error} </div>}
                    </div>
                )}

                <button className="material-symbols-outlined delete-btn" 
                    onClick={handleDelete} 
                    disabled={loading}
                > 
                    delete 
                </button>
            </div>
        </div>
    );
}
 
export default CartDetails;
