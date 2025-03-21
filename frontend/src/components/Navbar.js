import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import { useCartContext } from "../hooks/useCartContext";


const Navbar = () => {
    const { logout } = useLogout()
    const { user } = useAuthContext()
    const { totalItems } = useCartContext()


    const handleClick = () => {
        logout()
    }
    return (
        <header>
            <div className="container">
                <Link to="/">
                 <h1>Shoppings.ai</h1>
                </Link>
                <nav>
                    {user && (
                        <div>
                            <span> {user.email} </span>
                            <button onClick={handleClick}>Log out</button>
                        </div>
                    )}
                    <div>
                        <Link to="/cart">Cart({totalItems})</Link>
                        {!user && (
                            <>
                                <Link to="/login">Login</Link>
                                <Link to="/signup">Signup</Link> 
                            </>
                        )}     
                    </div> 
                </nav>
            </div>
        </header>
    );
}

export default Navbar;