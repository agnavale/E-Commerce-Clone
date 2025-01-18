const ProductList = ({ products }) => {
    return ( 
        <div className="product-list">
            {products.map((product) =>(
                <div className="product-preview" key={product.id}>
                    <img src = {`./images/${product.image}`} alt="product-image"/>
                    <h2>{ product.name }</h2>
                    <hr />
                    <p> ${product.price} </p>
                    <button> Add to cart</button>
                </div>
            ))}
        </div>
     );
}
 
export default ProductList;