import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/Home.tsx"),
  route("products", "routes/Products.tsx"),
  route("products/:id", "routes/ProductDetail.tsx"),
  route("cart", "routes/Cart.tsx"),
  route("checkout", "routes/Checkout.tsx"),
  route("orders", "routes/Orders.tsx"),
  route("login", "routes/Login.tsx"),
  route("register", "routes/Register.tsx"),
  route("forgot-password", "routes/ForgotPassword.tsx"),
  route("reset-password", "routes/ResetPassword.tsx"),
] satisfies RouteConfig;