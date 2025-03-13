import { useCartContext } from "../hooks/useCartContext";
import CartDetails from "../components/CartDetails";

const Cart = () => {
    const { cart, dispatch } = useCartContext()
    
    return (  
        <div className="cart">
            { cart && cart.map(item => (
                <CartDetails key={item._id} item = {item} />
            ))}
        </div>
    );
}
 
export default Cart;