import {Routes, Route} from "react-router-dom"
import Products from "./pages/Products"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Cart from "./pages/Cart"
import ProductDetail from "./pages/ProductDetail"
import Navbar from "./components/Navbar"

function App (){
    return (
    <>
    <Navbar/>
    <Routes>
        <Route path = "/"            element={<Home />} />
        <Route path="/products"      element={<Products />} />
        <Route path="/products/:id"  element={<ProductDetail />} /> 
        <Route path="/cart"          element={<Cart />} />
        <Route path="/login"         element={<Login />} />
        <Route path = "*"            element={<h1>404 Not Found </h1>} />
    </Routes>
    </>
    )   
}

export default App