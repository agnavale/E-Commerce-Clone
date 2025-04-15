import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import { useCartContext } from "../hooks/useCartContext";
import { useState } from "react";


const Navbar = () => {
    const { logout } = useLogout()
    const { user } = useAuthContext()
    const { totalItems } = useCartContext()
    const [dropdownOpen, setDropdownOpen] = useState(false);


    const handleClick = () => {
        logout()
        setDropdownOpen(false); 
    }
    return (
        <header>
            <div className="container">
                <Link to="/">
                 <h1>Shoppings.ai</h1>
                </Link>
                <nav>
                    <div className="nav-links">

                        <div className="profile-dropdown">
                            <span
                                className="material-symbols-outlined profile-icon"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                account_circle
                            </span>

                            { dropdownOpen && (
                                <div className="dropdown-menu">
                                    {user ? (
                                        <>
                                            <span className="user-email">{user.email}</span>
                                            <button className="logout-btn" onClick={handleClick}>Log out</button>
                                        </>
                                    ) : (
                                        <>
                                            <Link to="/login" className="dropdown-item" onClick={() => setDropdownOpen(false)}>Login</Link>
                                            <Link to="/signup" className="dropdown-item" onClick={() => setDropdownOpen(false)}>Signup</Link>
                                            <Link to="/addproduct" class="dropdown-item" onClick={() =>setDropdownOpen(false)}>Add Product</Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                        <Link to="/cart" className="cart-link">
                                <span className="material-symbols-outlined" onClick={() => setDropdownOpen(false)}>shopping_cart</span>
                                {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                        </Link>
                    </div> 
                </nav>
            </div>
        </header>
    );
}

export default Navbar;