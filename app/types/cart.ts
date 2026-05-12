export interface CartResponse {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CartItemResponse {
  id: string;
  cart_id: string;
  product_id: number;
  product_name: string;
  product_price: number;
  product_slug: string;
  product_variant_id: number | null;
  quantity: number;
  variant_name?: string;
  variant_price_extra?: number;
  created_at: string;
  updated_at: string;
}
