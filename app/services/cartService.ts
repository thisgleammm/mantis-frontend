const BASE_URL = "https://mantis-backend.fly.dev/api/v1";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
});

export const getCart = async () => {
  const res = await fetch(`${BASE_URL}/carts`, {
    headers: authHeaders(), 
  });
  const data = await res.json();
  return data;
};

export const getCartItems = async (cartId: string) => {
  const res = await fetch(`${BASE_URL}/carts/${cartId}/items`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  return data;
};

export const addToCart = async (
  cartId: string,
  productId: number,
  variantId?: number | null,
  quantity: number = 1,
) => {
  const res = await fetch(`${BASE_URL}/carts/${cartId}/items`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      product_id: productId,
      product_variant_id: variantId ?? null,
      quantity,
    }),
  });
  const data = await res.json();
  return data;
};

export const updateCartItem = async (cartId: string, itemId: string, quantity: number) => {
  const res = await fetch(`${BASE_URL}/carts/items/${itemId}`, {
    method: "PATCH", 
    headers: authHeaders(),
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) throw new Error(`Update failed: ${res.status}`);
  const text = await res.text();
  return text ? JSON.parse(text) : {};
};

export const removeCartItem = async (cartId: string, itemId: string) => {
  const res = await fetch(`${BASE_URL}/carts/items/${itemId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return res.ok;
};
