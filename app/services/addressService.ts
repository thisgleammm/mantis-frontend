import { apiFetch } from "./apiClient";

export interface Address {
  id: string;
  user_id: string;
  recipient_name: string;
  phone_number: string;
  province: string;
  city: string;
  district: string;
  postal_code: string;
  full_address: string;
  label: string;
  coordinates: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAddressPayload {
  recipient_name: string;
  phone_number: string;
  province: string;
  city: string;
  district: string;
  postal_code: string;
  full_address: string;
  label: string;
  is_primary: boolean;
}

export const getAddresses = async (): Promise<Address[]> => {
  const data = await apiFetch<Address[] | null>("/addresses");
  return data ?? [];
};

export const createAddress = async (payload: CreateAddressPayload): Promise<Address> => {
  return apiFetch<Address>("/addresses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const deleteAddress = async (id: string): Promise<void> => {
  await apiFetch(`/addresses/${id}`, { method: "DELETE" });
};

export const setPrimaryAddress = async (id: string): Promise<void> => {
  await apiFetch(`/addresses/${id}/primary`, { method: "PATCH" });
};
