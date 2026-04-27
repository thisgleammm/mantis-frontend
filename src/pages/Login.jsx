import { useNavigate } from "react-router";

function Login (){
    const navigate = useNavigate ()

    const handleLogin = () => {
        navigate ("/")
    }
}