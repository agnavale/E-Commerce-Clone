const CartDetails = ({item}) => {
    return ( 
        <div className="cart-details">
            <h4> {item.name} </h4>
            <p> price: {item.price} </p>
            <p> qty: {item.qty} </p>
            <button></button>
        </div>
    );
}
 
export default CartDetails;