import { useState, useEffect, type ChangeEvent } from "react"
import { useNavigate, redirect, type LoaderFunctionArgs } from "react-router"
import { Button } from "@heroui/react"
import { z } from "zod"
import { getCart, getCartItems } from "../services/cartService"
import type { CartItemResponse } from "../types/cart"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie") || "";
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((c) => c.trim().split("="))
  );
  
  const authStatus = cookies.is_logged_in === "true" || !!cookies.token;

  if (!authStatus) {
    return redirect("/login");
  }
  return null;
};

const checkoutSchema = z.object({
  recipient_name: z.string().min(1, "Nama penerima harus diisi"),
  phone_number: z.string().min(1, "No. HP harus diisi").min(10, "No. HP minimal 10 digit"),
  province: z.string().min(1, "Provinsi harus diisi"),
  city: z.string().min(1, "Kota harus diisi"),
  district: z.string().min(1, "Kecamatan harus diisi"),
  postal_code: z.string().min(1, "Kode pos harus diisi").min(5, "Kode pos minimal 5 digit"),
  fulladdress: z.string().min(1, "Alamat harus diisi").min(10, "Alamat minimal 10 karakter"),
});


export default function Checkout() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    recipient_name: "", phone_number: "", province: "",
    city: "", district: "", postal_code: "", fulladdress: "",
  })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [cartItems, setCartItems] = useState<CartItemResponse[]>([])
  const [cartLoading, setCartLoading] = useState(true)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }))
  }

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cart = await getCart()
        if (!cart?.id) {
          navigate("/cart")
          return
        }
        const items = await getCartItems(cart.id)
        if (items.length === 0) {
          navigate("/cart")
          return
        }
        setCartItems(items)
      } catch (err) {
        console.error(err)
      } finally {
        setCartLoading(false)
      }
    }
    fetchCart()
  }, [])

  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.product_price) || 0) * item.quantity, 0)
  const shipping = 50000
  const total = subtotal + shipping

  const handleCheckout = async () => {
    const result = checkoutSchema.safeParse(form)
    if (!result.success) {
      const errors: Record<string, string> = {}
      const fieldErrs = result.error.flatten().fieldErrors
      for (const [key, msgs] of Object.entries(fieldErrs)) {
        if (msgs?.[0]) errors[key] = msgs[0]
      }
      setFieldErrors(errors)
      return
    }

    setLoading(true)
    setTimeout(() => navigate("/orders"), 1500)
  }

  const inputClass = "w-full px-4 py-3 rounded-xl border text-sm outline-none transition bg-white border-black/10 text-black placeholder-gray-400 focus:border-purple-500/40 focus:bg-purple-500/5 dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-gray-600 dark:focus:border-purple-500/40 dark:focus:bg-purple-500/5"
  const labelClass = "text-xs mb-1 block text-gray-500 dark:text-gray-400"

  return (
    <div className="min-h-screen px-6 py-10 font-sans bg-gray-50 text-black dark:bg-black dark:text-white">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">Checkout</h1>
          <p className="text-sm mt-1 text-gray-400 dark:text-gray-500">Lengkapi data pengiriman</p>
        </div>

        {cartLoading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 rounded-full animate-spin border-purple-500/20 border-t-purple-500" />
          </div>
        ) : (
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Form */}
          <div className="flex-1">
            <div className="border border-purple-500/10 rounded-2xl p-6 bg-white shadow-sm dark:bg-white/4 dark:shadow-none">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-black dark:text-white">
                <span className="w-6 h-6 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 text-xs">📍</span>
                Alamat Pengiriman
              </h2>

              <div className="flex flex-col gap-4">
                <div>
                  <label className={labelClass}>Nama Penerima</label>
                  <input type="text" name="recipient_name" placeholder="John Doe" value={form.recipient_name} onChange={handleChange} className={inputClass} />
                  {fieldErrors.recipient_name && <p className="text-[10px] text-red-500 mt-1">{fieldErrors.recipient_name}</p>}
                </div>

                <div>
                  <label className={labelClass}>No. HP</label>
                  <input type="text" name="phone_number" placeholder="08xxxxxxxxxx" value={form.phone_number} onChange={handleChange} className={inputClass} />
                  {fieldErrors.phone_number && <p className="text-[10px] text-red-500 mt-1">{fieldErrors.phone_number}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Provinsi</label>
                    <input type="text" name="province" placeholder="DKI Jakarta" value={form.province} onChange={handleChange} className={inputClass} />
                    {fieldErrors.province && <p className="text-[10px] text-red-500 mt-1">{fieldErrors.province}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Kota</label>
                    <input type="text" name="city" placeholder="Jakarta Selatan" value={form.city} onChange={handleChange} className={inputClass} />
                    {fieldErrors.city && <p className="text-[10px] text-red-500 mt-1">{fieldErrors.city}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Kecamatan</label>
                    <input type="text" name="district" placeholder="Kebayoran Baru" value={form.district} onChange={handleChange} className={inputClass} />
                    {fieldErrors.district && <p className="text-[10px] text-red-500 mt-1">{fieldErrors.district}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Kode Pos</label>
                    <input type="text" name="postal_code" placeholder="12110" value={form.postal_code} onChange={handleChange} className={inputClass} />
                    {fieldErrors.postal_code && <p className="text-[10px] text-red-500 mt-1">{fieldErrors.postal_code}</p>}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Alamat Lengkap</label>
                  <textarea name="fulladdress" placeholder="Jl. Sudirman No. 1, RT 01/RW 02" value={form.fulladdress} onChange={handleChange} rows={3} className={`${inputClass} resize-none`} />
                  {fieldErrors.fulladdress && <p className="text-[10px] text-red-500 mt-1">{fieldErrors.fulladdress}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="border border-purple-500/15 rounded-2xl p-6 sticky top-24 bg-white shadow-sm dark:bg-white/4 dark:shadow-none">
              <h2 className="text-lg font-semibold mb-6 text-black dark:text-white">Order Summary</h2>

              <div className="flex flex-col gap-3 mb-6">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">{item.product_name} x{item.quantity}</span>
                    <span className="text-black dark:text-white">Rp {((Number(item.product_price) || 0) * item.quantity).toLocaleString("id-ID")}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 text-sm border-t pt-4 mb-6 border-black/8 dark:border-white/8">
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-black dark:text-white">Rp {subtotal.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Ongkir</span>
                  <span className="text-black dark:text-white">Rp {shipping.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between font-bold text-base border-t pt-3 border-black/8 dark:border-white/8">
                  <span className="text-black dark:text-white">Total</span>
                  <span className="text-purple-400">Rp {total.toLocaleString("id-ID")}</span>
                </div>
              </div>

              <Button
                onPress={handleCheckout}
                isPending={loading}
                className="w-full"
              >
                Bayar Sekarang
              </Button>
            </div>
          </div>

        </div>
        )}
      </div>
    </div>
  )
}