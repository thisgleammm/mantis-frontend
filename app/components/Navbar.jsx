import { Link } from "react-router";

function Navbar() {
    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>  
        </nav>
    )
}

export default Navbar