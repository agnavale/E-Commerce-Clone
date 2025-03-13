
const CartDetails = ({item}) => {
    const handleClick = () => {
        
    }
    return ( 
        <div className="cart-details">
            <div> 
                <img src= "images/product.avif" />
            </div>
            <div>
                <h4> {item.name} </h4>
                <p> price: {item.price} </p>
                <p> qty: {item.qty} </p>
                <button onClick={ handleClick}> delete </button>
            </div>
        </div>
    );
}
 
export default CartDetails;
