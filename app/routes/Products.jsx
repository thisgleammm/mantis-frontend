import { useEffect, useState } from "react"
import { getAllProducts } from "../services/productService"

function Products() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getAllProducts()
            .then(data => {
                setProducts(data)
                setLoading(false)
            })
    }, [])

    if (loading) return <h2>Loading...</h2>

    return (
        <div>
            <h1>Products</h1>
            {products.map(product => (
                <div key={product.id}>
                    <h2>{product.name}</h2>
                    <p>{product.description}</p>
                    <p>Rp {product.base_price}</p>
                </div>
            ))}
        </div>
    )
}

export default Products