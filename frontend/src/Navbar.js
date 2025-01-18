import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <div className="navbar">
            <Link to="/"><h1>Shoppings.ai </h1> </Link>
            <div className="links">
                <Link to="#" className="profile-link">
                    <div className="icon">
                        <img src="images/user.png" alt =""/>
                        <p>Profile</p>
                        <div className="pop-up">
                            <Link to="/"> Account </Link>
                            <Link to="/"> My Orders </Link>
                            <hr />
                            <Link to="/"> Sign in </Link>
                        </div>
                    </div>
                </Link>
                <Link to="/cart">
                    <div className="icon">
                        <img src="images\cart.png" alt =""/>
                        <p>Cart</p>
                        
                    </div>
                </Link>
                
            </div>
            
        </div>
    );
}

export default Navbar;