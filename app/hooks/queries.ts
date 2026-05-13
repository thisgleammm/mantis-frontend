import { useQuery } from "@tanstack/react-query";
import { getAllProducts, getProductById } from "../services/productService";
import { getCart } from "../services/cartService";
import { getCurrentUser } from "../services/authService";
import { getAddresses } from "../services/addressService";

export const productKeys = {
  all: ["products"] as const,
  list: (limit: number, offset: number, search: string) => ["products", "list", { limit, offset, search }] as const,
  detail: (id: string | undefined) => ["products", id] as const,
};

export const cartKeys = {
  all: ["cart"] as const,
};

export const authKeys = {
  user: ["user", "me"] as const,
};

export function useProducts(limit = 20, offset = 0, search = "") {
  return useQuery({
    queryKey: productKeys.list(limit, offset, search),
    queryFn: () => getAllProducts(limit, offset, search),
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

export const addressKeys = {
  all: ["addresses"] as const,
};

export function useAddresses() {
  const isLoggedIn = typeof window !== "undefined" && localStorage.getItem("is_logged_in") === "true";

  return useQuery({
    queryKey: addressKeys.all,
    queryFn: getAddresses,
    enabled: isLoggedIn,
  });
}
