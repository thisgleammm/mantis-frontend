import { index, route } from "@react-router/dev/routes";

export default [
  index("routes/Home.jsx"),
  route("products", "routes/Products.jsx"),
  route("products/:id", "routes/ProductDetail.jsx"),
  route("cart", "routes/Cart.jsx"),
  route("checkout", "routes/Checkout.jsx"), 
  route("orders", "routes/Orders.jsx"),  
  route("login", "routes/Login.jsx"),
  route("register", "routes/Register.jsx"),
];