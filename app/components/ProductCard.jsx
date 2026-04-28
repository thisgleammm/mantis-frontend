import { Link } from "react-router";

function ProductCard({ ProductCard }) {
    return (
        <div>
            <h2>{product.name}</h2>
            <Link to={'/products/${product.id}'}>Lihat Detail</Link>
        </div>
    )
}