import { useQuery } from "@tanstack/react-query";
import { getAllProducts, getProductById } from "../services/productService";
import { getCart, getCartItems } from "../services/cartService";
import { getCurrentUser } from "../services/authService";
import type { Product } from "../types";
import type { CartItemResponse } from "../types/cart";

export const productKeys = {
  all: ["products"] as const,
  detail: (id: string | undefined) => ["products", id] as const,
};

export const cartKeys = {
  all: ["cart"] as const,
  items: (cartId: string | null) => ["cart", "items", cartId] as const,
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

export function useCartItems(cartId: string | null) {
  return useQuery({
    queryKey: cartKeys.items(cartId),
    queryFn: () => getCartItems(cartId!),
    enabled: !!cartId,
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
