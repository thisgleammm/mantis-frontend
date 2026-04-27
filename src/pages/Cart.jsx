import { useNavigate } from "react-router";

function Cart (){
    const navigate = useNavigate ()

    const handleCheckout = () => {
        navigate("/checkout")
    }
}