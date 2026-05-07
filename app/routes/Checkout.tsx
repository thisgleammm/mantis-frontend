import { useState, type ChangeEvent } from "react"
import { useNavigate, redirect } from "react-router"
import { useTheme } from "../hooks/useTheme"

export const loader = async () => {
  const authStatus = typeof window !== "undefined"
    ? localStorage.getItem("is_logged_in") === "true"
    : false;

  if (!authStatus) {
    return redirect("/login");
  }
  return null;
};


interface CartItem {
  id: number;
  name: string;
  base_price: number;
  quantity: number;
}

const dummyCart: CartItem[] = [
  { id: 1, name: "Airpods Pro", base_price: 2500000, quantity: 1 },
  { id: 2, name: "Macbook Pro M5", base_price: 35000000, quantity: 1 },
]


export default function Checkout() {
  const navigate = useNavigate()
  useTheme()
  const [form, setForm] = useState({
    recipient_name: "", phone_number: "", province: "",
    city: "", district: "", postal_code: "", fulladdress: "",
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [e.target.name]: e.target.value })

  const subtotal = dummyCart.reduce((acc, item) => acc + item.base_price * item.quantity, 0)
  const shipping = 50000
  const total = subtotal + shipping

  const handleCheckout = async () => {
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
                </div>

                <div>
                  <label className={labelClass}>No. HP</label>
                  <input type="text" name="phone_number" placeholder="08xxxxxxxxxx" value={form.phone_number} onChange={handleChange} className={inputClass} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Provinsi</label>
                    <input type="text" name="province" placeholder="DKI Jakarta" value={form.province} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Kota</label>
                    <input type="text" name="city" placeholder="Jakarta Selatan" value={form.city} onChange={handleChange} className={inputClass} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Kecamatan</label>
                    <input type="text" name="district" placeholder="Kebayoran Baru" value={form.district} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Kode Pos</label>
                    <input type="text" name="postal_code" placeholder="12110" value={form.postal_code} onChange={handleChange} className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Alamat Lengkap</label>
                  <textarea name="fulladdress" placeholder="Jl. Sudirman No. 1, RT 01/RW 02" value={form.fulladdress} onChange={handleChange} rows={3} className={`${inputClass} resize-none`} />
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="border border-purple-500/15 rounded-2xl p-6 sticky top-24 bg-white shadow-sm dark:bg-white/4 dark:shadow-none">
              <h2 className="text-lg font-semibold mb-6 text-black dark:text-white">Order Summary</h2>

              <div className="flex flex-col gap-3 mb-6">
                {dummyCart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">{item.name} x{item.quantity}</span>
                    <span className="text-black dark:text-white">Rp {(item.base_price * item.quantity).toLocaleString("id-ID")}</span>
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

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full py-3 font-semibold rounded-xl transition text-sm disabled:opacity-50 flex items-center justify-center gap-2 bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-gray-100"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 rounded-full animate-spin border-white/20 border-t-white dark:border-black/20 dark:border-t-black" />
                    Memproses...
                  </>
                ) : "Bayar Sekarang →"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}