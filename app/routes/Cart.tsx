import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useTheme } from "../hooks/ThemeContext";
import { Surface } from "../components/Surface";
import { Button } from '@heroui/react';
import type { CartItemResponse } from "../types/cart";
import { useCart } from "../hooks/queries";
import { useUpdateCartItemMutation, useRemoveCartItemMutation } from "../hooks/mutations";

interface CartItem extends CartItemResponse {
  category?: string;
  product?: {
    name: string;
    price: number;
  };
}

export default function Cart() {
  const navigate = useNavigate();
  useTheme();

  const isLoggedIn = typeof window !== "undefined" && localStorage.getItem("is_logged_in") === "true";
  const { data: cart, isLoading: cartLoading } = useCart();
  const cartId = cart?.id ?? null;
  const cartItems = cart?.items ?? [];
  const updateMutation = useUpdateCartItemMutation();
  const removeMutation = useRemoveCartItemMutation();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    return null;
  }

  const handleUpdateQty = async (
    itemId: string,
    delta: number,
    currentQty: number,
  ) => {
    const newQty = Math.max(1, currentQty + delta);
    if (!cartId) return;

    updateMutation.mutate(
      { cartId, itemId, quantity: newQty },
      {
        onError: () => {
          // Revert is handled by invalidateQueries on settle
        },
      }
    );
  };

  const handleRemove = (itemId: string) => {
    if (!cartId) return;
    removeMutation.mutate({ cartId, itemId });
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (Number(item.product_price) || 0) * item.quantity,
    0,
  );
  const shipping = 50000;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen px-6 py-24  font-sans bg-gray-50 text-black dark:bg-black dark:text-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">
            Your Cart
          </h1>
          <p className="text-sm mt-1 text-gray-400 dark:text-gray-500">
            <span className="text-purple-400">{cartItems.length}</span> items in
            your cart
          </p>
        </div>

        {cartLoading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 rounded-full animate-spin border-purple-500/20 border-t-purple-500" />
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-4xl mb-6">
              🛒
            </div>
            <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">
              Cart kosong nih!
            </h2>
            <p className="text-sm mb-6 text-gray-400 dark:text-gray-500">
              Yuk belanja dulu
            </p>
            <Link to="/products">
              <button className="px-6 py-3 font-semibold rounded-xl transition text-sm bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-gray-100">
                Shop Now
              </button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1 flex flex-col gap-4">
              {cartItems.map((item) => {
                const harga = Number(item.product_price) || 0;
                const nama = item.product_name || "Product";
                const gambar = item.product_image || "";
                return (
                <div
                  key={item.id}
                  className="group border rounded-2xl p-4 flex gap-4 items-center hover:border-purple-500/20 hover:shadow-md hover:shadow-purple-500/5 transition-all duration-200 bg-white border-black/8 dark:bg-white/4 dark:border-white/8"
                >
                  {/* Image */}
                  <div className="w-20 h-20 rounded-xl border flex items-center justify-center text-3xl flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 border-black/5 dark:from-zinc-900 dark:to-zinc-800 dark:border-white/5">
                    {gambar ? (
                      <img
                        src={gambar}
                        alt={nama}
                        className="object-cover rounded-xl"
                      />
                    ) : (
                      "🛍️"
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <span className="text-xs text-purple-400/70 bg-purple-500/10 border border-purple-500/20 px-2 py-1 rounded-full">
                      {(item as CartItem).category || "General"}
                    </span>
                    <h3 className="text-sm font-semibold mt-2 transition text-black group-hover:text-purple-700 dark:text-white dark:group-hover:text-purple-100">
                      {nama}
                    </h3>
                    <p className="text-base font-bold mt-1 text-black dark:text-white">
                      Rp{" "}
                      {(harga * item.quantity).toLocaleString(
                        "id-ID",
                      )}
                    </p>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateQty(item.id, -1, item.quantity)}
                      className="w-8 h-8 rounded-lg border flex items-center justify-center text-lg transition border-black/10 text-black hover:border-purple-500/40 hover:text-purple-600 dark:border-white/10 dark:text-white dark:hover:border-purple-500/40 dark:hover:text-purple-300"
                    >
                      −
                    </button>
                    <span className="text-sm font-semibold w-6 text-center text-black dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQty(item.id, 1, item.quantity)}
                      className="w-8 h-8 rounded-lg border flex items-center justify-center text-lg transition border-black/10 text-black hover:border-purple-500/40 hover:text-purple-600 dark:border-white/10 dark:text-white dark:hover:border-purple-500/40 dark:hover:text-purple-300"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-gray-500 hover:text-red-400 transition text-lg ml-2"
                  >
                    ✕
                  </button>
                </div>
              )})}
            </div>

            <div className="w-full lg:w-80 flex-shrink-0">
              <Surface variant="default" className="border border-purple-500/15 rounded-2xl p-6 sticky top-24 shadow-sm dark:shadow-none">
                <h2 className="text-lg font-semibold mb-6 text-black dark:text-white">
                  Order Summary
                </h2>

                <div className="flex flex-col gap-3 text-sm mb-6">
                  <div className="flex justify-between text-gray-500 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span className="text-black dark:text-white">
                      Rp {subtotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-500 dark:text-gray-400">
                    <span>Shipping</span>
                    <span className="text-black dark:text-white">
                      Rp {shipping.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold text-base border-black/8 dark:border-white/8">
                    <span className="text-black dark:text-white">Total</span>
                    <span className="text-purple-400">
                      Rp {total.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button 
                    className="w-full" 
                    onPress={() => navigate("/checkout")}
                  >
                    Checkout
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="w-full mt-2" 
                    onPress={() => navigate("/products")}
                  >
                    Lanjut Belanja
                  </Button>
                </div>
              </Surface>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
