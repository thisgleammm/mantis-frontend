import { apiFetch } from "./apiClient";

export interface CheckoutPayload {
  shipping_address: string;
}

export interface OrderResponse {
  id: string;
  user_id: string;
  invoice_number: string;
  status: string;
  total_amount: number;
  shipping_cost: number;
  grand_total: number;
  shipping_address: string;
  tracking_number?: string;
  courier_name?: string;
  created_at: string;
  updated_at: string;
}

export const checkout = async (payload: CheckoutPayload): Promise<OrderResponse> => {
  return apiFetch<OrderResponse>("/orders/checkout", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const getOrders = async (): Promise<OrderResponse[]> => {
  return apiFetch<OrderResponse[]>("/orders");
};
