import { useNavigate } from "react-router";

function Cart (){
    const navigate = useNavigate()

    const handleCheckout = () => {
        navigate("/checkout")
    }

    return (
        <div>
            <h1>Cart Page</h1>
            <button onClick={handleCheckout}>Checkout</button>
        </div>
    )
}

export default Cart