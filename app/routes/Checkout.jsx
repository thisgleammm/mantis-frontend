import { useState } from "react"
import { useNavigate } from "react-router"

const dummyCart = [
  { id: 1, name: "Airpods Pro", base_price: 2500000, quantity: 1 },
  { id: 2, name: "Macbook Pro M5", base_price: 35000000, quantity: 1 },
]

export default function Checkout() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    recipient_name: "", phone_number: "", province: "",
    city: "", district: "", postal_code: "", fulladdress: "",
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const subtotal = dummyCart.reduce((acc, item) => acc + item.base_price * item.quantity, 0)
  const shipping = 50000
  const total = subtotal + shipping

  const handleCheckout = async () => {
    setLoading(true)
    setTimeout(() => navigate("/orders"), 1500)
  }

  const inputClass = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm outline-none focus:border-purple-500/40 focus:bg-purple-500/5 transition"

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 font-sans">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
          <p className="text-gray-500 text-sm mt-1">Lengkapi data pengiriman</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Form */}
          <div className="flex-1">
            <div className="bg-white/4 border border-purple-500/10 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 text-xs">📍</span>
                Alamat Pengiriman
              </h2>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Nama Penerima</label>
                  <input type="text" name="recipient_name" placeholder="John Doe" value={form.recipient_name} onChange={handleChange} className={inputClass} />
                </div>

                <div>
                  <label className="text-xs text-gray-400 mb-1 block">No. HP</label>
                  <input type="text" name="phone_number" placeholder="08xxxxxxxxxx" value={form.phone_number} onChange={handleChange} className={inputClass} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Provinsi</label>
                    <input type="text" name="province" placeholder="DKI Jakarta" value={form.province} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Kota</label>
                    <input type="text" name="city" placeholder="Jakarta Selatan" value={form.city} onChange={handleChange} className={inputClass} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Kecamatan</label>
                    <input type="text" name="district" placeholder="Kebayoran Baru" value={form.district} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Kode Pos</label>
                    <input type="text" name="postal_code" placeholder="12110" value={form.postal_code} onChange={handleChange} className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Alamat Lengkap</label>
                  <textarea name="fulladdress" placeholder="Jl. Sudirman No. 1, RT 01/RW 02" value={form.fulladdress} onChange={handleChange} rows={3} className={`${inputClass} resize-none`} />
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white/4 border border-purple-500/15 rounded-2xl p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-6">Order Summary</h2>

              <div className="flex flex-col gap-3 mb-6">
                {dummyCart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-400">{item.name} x{item.quantity}</span>
                    <span className="text-white">Rp {(item.base_price * item.quantity).toLocaleString("id-ID")}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 text-sm border-t border-white/8 pt-4 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">Rp {subtotal.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Ongkir</span>
                  <span className="text-white">Rp {shipping.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between font-bold text-base border-t border-white/8 pt-3">
                  <span>Total</span>
                  <span className="text-purple-300">Rp {total.toLocaleString("id-ID")}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-purple-50 transition text-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
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