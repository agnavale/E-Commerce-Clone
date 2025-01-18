import ProductList from './ProductList';
import useFetch from './useFetch';

const Home = () => {
    const {data: products, isPending, error} = useFetch('https://e-commerce-clone-n2x6.onrender.com/products')

    return (  
        <div className="home">
            { error && <div>{ error }</div>}
            { isPending && <div> Loading...</div>}
            { products && <ProductList products = {products} /> }
        </div>
    );
}
 
export default Home;
