import { useNavigate } from "react-router"

function Register(){
    const navigate = useNavigate()

    const handleRegister = () => {

        navigate ("/login")
    }

    return (
        <div>
            <h1>Register Page</h1>
            <button onClick={handleRegister}>Daftar</button>
        </div>
    )
}

export default Register