import { useState, type ChangeEvent } from "react"
import { useNavigate } from "react-router"
import { Button } from "@heroui/react"
import { z } from "zod"
import { useCart, useAddresses, addressKeys } from "../hooks/queries"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { cartKeys } from "../hooks/queries"
import type { CartItemResponse } from "../types/cart"
import { checkout } from "../services/orderService"
import { createAddress, deleteAddress } from "../services/addressService"
import type { Address } from "../services/addressService"
import { useTheme } from "../hooks/ThemeContext"

const checkoutSchema = z.object({
  recipient_name: z.string().min(1, "Nama penerima harus diisi"),
  phone_number: z.string().min(1, "No. HP harus diisi").min(10, "No. HP minimal 10 digit"),
  province: z.string().min(1, "Provinsi harus diisi"),
  city: z.string().min(1, "Kota harus diisi"),
  district: z.string().min(1, "Kecamatan harus diisi"),
  postal_code: z.string().min(1, "Kode pos harus diisi").min(5, "Kode pos minimal 5 digit"),
  fulladdress: z.string().min(1, "Alamat harus diisi").min(10, "Alamat minimal 10 karakter"),
});

const emptyForm = {
  recipient_name: "", phone_number: "", province: "",
  city: "", district: "", postal_code: "", fulladdress: "",
}

export default function Checkout() {
  const navigate = useNavigate()
  useTheme()
  const queryClient = useQueryClient()

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false)
  const [saveNewAddress, setSaveNewAddress] = useState(false)
  const [addressLabel, setAddressLabel] = useState("")

  const [form, setForm] = useState(emptyForm)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState("")

  const isLoggedIn = typeof window !== "undefined" && localStorage.getItem("is_logged_in") === "true";
  const { data: cart, isLoading: cartLoading } = useCart()
  const { data: savedAddresses = [], isLoading: addressesLoading } = useAddresses()
  const cartItems: CartItemResponse[] = cart?.items ?? []

  const deleteMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: addressKeys.all }),
  })

  const handleAddressSelect = (address: Address) => {
    setSelectedAddressId(address.id)
    setIsAddingNewAddress(false)
    setForm({
      recipient_name: address.recipient_name,
      phone_number: address.phone_number,
      province: address.province,
      city: address.city,
      district: address.district,
      postal_code: address.postal_code,
      fulladdress: address.full_address,
    })
    setFieldErrors({})
  }

  const handleAddNewAddress = () => {
    setSelectedAddressId(null)
    setIsAddingNewAddress(true)
    setForm(emptyForm)
    setFieldErrors({})
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }))
  }

  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.product_price) || 0) * item.quantity, 0)
  const shipping = 50000
  const total = subtotal + shipping

  const handleCheckout = async () => {
    const currentlyLoggedIn = typeof window !== "undefined" && localStorage.getItem("is_logged_in") === "true";
    if (!currentlyLoggedIn) {
      navigate("/login")
      return
    }

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

    const shippingAddress = `${form.recipient_name}, ${form.phone_number}, ${form.fulladdress}, Kec. ${form.district}, ${form.city}, ${form.province} ${form.postal_code}`

    setLoading(true)
    setApiError("")
    try {
      if (isAddingNewAddress && saveNewAddress) {
        await createAddress({
          recipient_name: form.recipient_name,
          phone_number: form.phone_number,
          province: form.province,
          city: form.city,
          district: form.district,
          postal_code: form.postal_code,
          full_address: form.fulladdress,
          label: addressLabel,
          is_primary: savedAddresses.length === 0,
        })
        queryClient.invalidateQueries({ queryKey: addressKeys.all })
      }

      await checkout({ shipping_address: shippingAddress })
      queryClient.invalidateQueries({ queryKey: cartKeys.all })
      navigate("/orders")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Checkout gagal, silakan coba lagi."
      setApiError(message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-3 rounded-xl border text-sm outline-none transition bg-white border-black/10 text-black placeholder-gray-400 focus:border-purple-500/40 focus:bg-purple-500/5 dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-gray-600 dark:focus:border-purple-500/40 dark:focus:bg-purple-500/5"
  const labelClass = "text-xs mb-1 block text-gray-500 dark:text-gray-400"

  const hasSavedAddresses = savedAddresses.length > 0
  const showForm = isAddingNewAddress || !hasSavedAddresses

  return (
    <div className="min-h-screen px-6 py-10 font-sans bg-gray-50 text-black dark:bg-black dark:text-white">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">Checkout</h1>
          <p className="text-sm mt-1 text-gray-400 dark:text-gray-500">Lengkapi data pengiriman</p>
        </div>

        {cartLoading || addressesLoading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 rounded-full animate-spin border-purple-500/20 border-t-purple-500" />
          </div>
        ) : !isLoggedIn ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">Silakan login untuk melanjutkan checkout.</p>
            <Button onPress={() => navigate("/login")}>Login</Button>
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

              {/* Saved Addresses */}
              {hasSavedAddresses && (
                <div className="mb-5">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Pilih alamat tersimpan</p>
                  <div className="flex flex-col gap-2">
                    {savedAddresses.map((address) => {
                      const isSelected = selectedAddressId === address.id
                      return (
                        <div
                          key={address.id}
                          onClick={() => handleAddressSelect(address)}
                          className={`relative cursor-pointer rounded-xl border px-4 py-3 text-sm transition-all ${
                            isSelected
                              ? "border-purple-500/50 bg-purple-500/8 dark:bg-purple-500/10"
                              : "border-black/8 bg-gray-50 hover:border-purple-500/30 dark:border-white/8 dark:bg-white/3 dark:hover:border-purple-500/30"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-black dark:text-white">{address.recipient_name}</span>
                                {address.label && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/20">
                                    {address.label}
                                  </span>
                                )}
                                {address.is_primary && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/20">
                                    Utama
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed truncate">{address.phone_number}</p>
                              <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed line-clamp-2">
                                {address.full_address}, Kec. {address.district}, {address.city}, {address.province} {address.postal_code}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {isSelected && (
                                <span className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center text-white text-[8px]">✓</span>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteMutation.mutate(address.id)
                                }}
                                className="text-gray-400 hover:text-red-400 transition-colors text-xs"
                                title="Hapus alamat"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <button
                    onClick={handleAddNewAddress}
                    className={`mt-3 w-full rounded-xl border border-dashed px-4 py-3 text-sm transition-all ${
                      isAddingNewAddress
                        ? "border-purple-500/50 bg-purple-500/8 text-purple-400 dark:bg-purple-500/10"
                        : "border-black/10 text-gray-400 hover:border-purple-500/30 hover:text-purple-400 dark:border-white/10 dark:hover:border-purple-500/30"
                    }`}
                  >
                    + Tambah Alamat Baru
                  </button>
                </div>
              )}

              {/* Address Form */}
              {showForm && (
                <div className="flex flex-col gap-4">
                  {hasSavedAddresses && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">Isi alamat baru</p>
                  )}

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

                  {/* Save address option */}
                  <div className="flex flex-col gap-3 pt-1 border-t border-black/6 dark:border-white/6">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={saveNewAddress}
                        onChange={(e) => setSaveNewAddress(e.target.checked)}
                        className="w-4 h-4 rounded accent-purple-500"
                      />
                      <span className="text-xs text-gray-500 dark:text-gray-400">Simpan alamat ini untuk digunakan lagi</span>
                    </label>

                    {saveNewAddress && (
                      <div>
                        <label className={labelClass}>Label Alamat (opsional)</label>
                        <input
                          type="text"
                          placeholder="Contoh: Rumah, Kantor"
                          value={addressLabel}
                          onChange={(e) => setAddressLabel(e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
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

              {apiError && (
                <p className="text-xs text-red-500 mb-3 text-center">{apiError}</p>
              )}

              <Button
                onPress={handleCheckout}
                isPending={loading}
                isDisabled={hasSavedAddresses && !selectedAddressId && !isAddingNewAddress}
                className="w-full"
              >
                Bayar Sekarang
              </Button>

              {hasSavedAddresses && !selectedAddressId && !isAddingNewAddress && (
                <p className="text-[10px] text-center mt-2 text-gray-400 dark:text-gray-500">
                  Pilih alamat pengiriman terlebih dahulu
                </p>
              )}
            </div>
          </div>

        </div>
        )}
      </div>
    </div>
  )
}