import { useNavigate } from "react-router";

function Login (){
    const navigate = useNavigate()

    const handleLogin = () => {
        navigate("/")
    }

    return (
        <div>
            <h1>Login Page</h1>
            <button onClick={handleLogin}>Login</button>
        </div>
    )
}

export default Login