import { useQuery } from "@tanstack/react-query";
import { getAllProducts, getProductById } from "../services/productService";
import { getCart } from "../services/cartService";
import { getCurrentUser } from "../services/authService";

export const productKeys = {
  all: ["products"] as const,
  detail: (id: string | undefined) => ["products", id] as const,
};

export const cartKeys = {
  all: ["cart"] as const,
};

export const authKeys = {
  user: ["user", "me"] as const,
};

export function useProducts() {
  return useQuery({
    queryKey: productKeys.all,
    queryFn: getAllProducts,
  });
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProductById(id),
    enabled: !!id,
    staleTime: 0,
  });
}

export function useCart() {
  const isLoggedIn = typeof window !== "undefined" && localStorage.getItem("is_logged_in") === "true";

  return useQuery({
    queryKey: cartKeys.all,
    queryFn: getCart,
    enabled: isLoggedIn,
  });
}

export function useCurrentUser() {
  const isLoggedIn = typeof window !== "undefined" && localStorage.getItem("is_logged_in") === "true";

  return useQuery({
    queryKey: authKeys.user,
    queryFn: getCurrentUser,
    enabled: isLoggedIn,
    staleTime: 1000 * 60 * 10,
  });
}
