import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addToCart,
  updateCartItem,
  removeCartItem,
} from "../services/cartService";
import { logout } from "../services/authService";
import { cartKeys } from "./queries";
import type { CartItemResponse } from "../types/cart";

export function useAddToCartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      cartId,
      productId,
      variantId,
      quantity,
    }: {
      cartId: string;
      productId: number;
      variantId?: number | null;
      quantity?: number;
    }) => addToCart(cartId, productId, variantId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

export function useUpdateCartItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      cartId,
      itemId,
      quantity,
    }: {
      cartId: string;
      itemId: string;
      quantity: number;
    }) => updateCartItem(cartId, itemId, quantity),
    onMutate: async ({ itemId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.all });

      const queries = queryClient.getQueriesData<CartItemResponse[]>({
        queryKey: ["cart", "items"],
      });

      const previousQueries = new Map(queries.map(([key, data]) => [JSON.stringify(key), data]));

      queries.forEach(([queryKey, data]) => {
        if (data) {
          queryClient.setQueryData(
            queryKey,
            data.map((item) =>
              item.id === itemId ? { ...item, quantity } : item
            )
          );
        }
      });

      return { previousQueries };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach((data, keyStr) => {
          queryClient.setQueryData(JSON.parse(keyStr), data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

export function useRemoveCartItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      cartId,
      itemId,
    }: {
      cartId: string;
      itemId: string;
    }) => {
      const success = await removeCartItem(cartId, itemId);
      if (!success) throw new Error("Failed to remove item");
    },
    onMutate: async ({ itemId }) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.all });

      const queries = queryClient.getQueriesData<CartItemResponse[]>({
        queryKey: ["cart", "items"],
      });

      const previousQueries = new Map(queries.map(([key, data]) => [JSON.stringify(key), data]));

      queries.forEach(([queryKey, data]) => {
        if (data) {
          queryClient.setQueryData(
            queryKey,
            data.filter((item) => item.id !== itemId)
          );
        }
      });

      return { previousQueries };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach((data, keyStr) => {
          queryClient.setQueryData(JSON.parse(keyStr), data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
