import { useCartContext } from "../hooks/useCartContext";
import CartDetails from "../components/CartDetails";


const Cart = () => {
    const { cart, totalItems, totalAmount } = useCartContext()
    
    return (  
        <div className="cart-container">
            <div className="cart">
                { cart && cart.map(item => (
                    <CartDetails key={item._id} item = {item} />
                ))}
            </div>

            <div className="total-amount">
                <h4>Total Amount ({totalItems} items): {totalAmount}</h4>
                <button>Proceed to Buy</button>
            </div>
        </div>
    );
}
 
export default Cart;