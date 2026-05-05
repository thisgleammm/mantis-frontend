import { useState, type ChangeEvent, useEffect } from "react"
import { useNavigate, redirect } from "react-router"

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

function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return true
    return (localStorage.getItem("theme") || "dark") === "dark"
  })
  useEffect(() => {
    const handler = () => setIsDark((localStorage.getItem("theme") || "dark") === "dark")
    window.addEventListener("themechange", handler)
    return () => window.removeEventListener("themechange", handler)
  }, [])
  return isDark
}

export default function Checkout() {
  const navigate = useNavigate()
  const isDark = useTheme()
  const d = isDark
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

  const inputClass = d
    ? "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm outline-none focus:border-purple-500/40 focus:bg-purple-500/5 transition"
    : "w-full px-4 py-3 rounded-xl bg-white border border-black/10 text-black placeholder-gray-400 text-sm outline-none focus:border-purple-500/40 focus:bg-purple-500/5 transition"

  const labelClass = `text-xs mb-1 block ${d ? "text-gray-400" : "text-gray-500"}`

  return (
    <div className={`min-h-screen px-6 py-10 font-sans transition-colors duration-300 ${d ? "bg-black text-white" : "bg-gray-50 text-black"}`}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold tracking-tight ${d ? "text-white" : "text-black"}`}>Checkout</h1>
          <p className={`text-sm mt-1 ${d ? "text-gray-500" : "text-gray-400"}`}>Lengkapi data pengiriman</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Form */}
          <div className="flex-1">
            <div className={`border border-purple-500/10 rounded-2xl p-6 ${d ? "bg-white/4" : "bg-white shadow-sm"}`}>
              <h2 className={`text-lg font-semibold mb-6 flex items-center gap-2 ${d ? "text-white" : "text-black"}`}>
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
            <div className={`border border-purple-500/15 rounded-2xl p-6 sticky top-24 ${d ? "bg-white/4" : "bg-white shadow-sm"}`}>
              <h2 className={`text-lg font-semibold mb-6 ${d ? "text-white" : "text-black"}`}>Order Summary</h2>

              <div className="flex flex-col gap-3 mb-6">
                {dummyCart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className={d ? "text-gray-400" : "text-gray-500"}>{item.name} x{item.quantity}</span>
                    <span className={d ? "text-white" : "text-black"}>Rp {(item.base_price * item.quantity).toLocaleString("id-ID")}</span>
                  </div>
                ))}
              </div>

              <div className={`flex flex-col gap-3 text-sm border-t pt-4 mb-6 ${d ? "border-white/8" : "border-black/8"}`}>
                <div className={`flex justify-between ${d ? "text-gray-400" : "text-gray-500"}`}>
                  <span>Subtotal</span>
                  <span className={d ? "text-white" : "text-black"}>Rp {subtotal.toLocaleString("id-ID")}</span>
                </div>
                <div className={`flex justify-between ${d ? "text-gray-400" : "text-gray-500"}`}>
                  <span>Ongkir</span>
                  <span className={d ? "text-white" : "text-black"}>Rp {shipping.toLocaleString("id-ID")}</span>
                </div>
                <div className={`flex justify-between font-bold text-base border-t pt-3 ${d ? "border-white/8" : "border-black/8"}`}>
                  <span className={d ? "text-white" : "text-black"}>Total</span>
                  <span className="text-purple-400">Rp {total.toLocaleString("id-ID")}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className={`w-full py-3 font-semibold rounded-xl transition text-sm disabled:opacity-50 flex items-center justify-center gap-2 ${d ? "bg-white text-black hover:bg-gray-100" : "bg-black text-white hover:bg-zinc-800"}`}
              >
                {loading ? (
                  <>
                    <div className={`w-4 h-4 border-2 rounded-full animate-spin ${d ? "border-black/20 border-t-black" : "border-white/20 border-t-white"}`} />
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