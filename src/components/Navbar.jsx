import { Link } from "react-router";

function Navbar() {
    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            <Link to="/cart">Cart</Link>
        </nav>
    )
}

export default Navbar