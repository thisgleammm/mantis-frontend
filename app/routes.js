import { index, route } from "@react-router/dev/routes";

export default [
  index("routes/Home.jsx"),
  route("products", "routes/Products.jsx"),
  route("cart", "routes/Cart.jsx"),
  route("login", "routes/Login.jsx"),
  route("register", "routes/Register.jsx"),
];
