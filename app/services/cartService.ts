import { apiFetch } from "./apiClient";
import type { CartResponse, CartItemResponse } from "../types/cart";

export const getCart = async (): Promise<CartResponse | null> => {
  const data = await apiFetch<any>("/carts");
  if (Array.isArray(data)) return data[0] ?? null;
  if (data?.data) {
    const arr = Array.isArray(data.data) ? data.data : [data.data];
    return arr[0] ?? null;
  }
  return data ?? null;
};

export const getCartItems = async (cartId: string): Promise<CartItemResponse[]> => {
  const data = await apiFetch<any>(`/carts/${cartId}/items`);
  if (Array.isArray(data)) return data;
  if (data?.items) return data.items;
  if (data?.data) return data.data;
  return [];
};

export const addToCart = async (
  cartId: string,
  productId: number,
  variantId?: number | null,
  quantity: number = 1,
): Promise<CartItemResponse> => {
  return apiFetch<CartItemResponse>(`/carts/${cartId}/items`, {
    method: "POST",
    body: JSON.stringify({
      product_id: productId,
      product_variant_id: variantId ?? null,
      quantity,
    }),
  });
};

export const updateCartItem = async (cartId: string, itemId: string, quantity: number): Promise<CartItemResponse> => {
  return apiFetch<CartItemResponse>(`/carts/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
};

export const removeCartItem = async (cartId: string, itemId: string) => {
  try {
    await apiFetch(`/carts/items/${itemId}`, {
      method: "DELETE",
    });
    return true;
  } catch {
    return false;
  }
};
