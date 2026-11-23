import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle2, Package, ShieldCheck, Truck } from 'lucide-react'
import { useStore } from '../store'

const WILAYAS = [
  '01 - Adrar', '02 - Chlef', '03 - Laghouat', '04 - Oum El Bouaghi', '05 - Batna',
  '06 - Béjaïa', '07 - Biskra', '08 - Béchar', '09 - Blida', '10 - Bouira',
  '11 - Tamanrasset', '12 - Tébessa', '13 - Tlemcen', '14 - Tiaret', '15 - Tizi Ouzou',
  '16 - Alger', '17 - Djelfa', '18 - Jijel', '19 - Sétif', '20 - Saïda',
  '21 - Skikda', '22 - Sidi Bel Abbès', '23 - Annaba', '24 - Guelma', '25 - Constantine',
  '26 - Médéa', '27 - Mostaganem', '28 - M\'Sila', '29 - Mascara', '30 - Ouargla',
  '31 - Oran', '32 - El Bayadh', '33 - Illizi', '34 - Bordj Bou Arreridj', '35 - Boumerdès',
  '36 - El Tarf', '37 - Tindouf', '38 - Tissemsilt', '39 - El Oued', '40 - Khenchela',
  '41 - Souk Ahras', '42 - Tipaza', '43 - Mila', '44 - Aïn Defla', '45 - Naâma',
  '46 - Aïn Témouchent', '47 - Ghardaïa', '48 - Relizane'
]

export function Checkout() {
  const navigate = useNavigate()
  const { cart, cartSubtotal, shippingFee, cartTotal, createOrder, formatPrice, currentUser } = useStore()

  const [form, setForm] = useState({
    name: currentUser?.name || 'Aboubakr',
    phone: '0555 12 34 56',
    wilaya: '16 - Alger',
    address: '05 Rue Didouche Mourad',
    deliveryMethod: 'yalidine',
    paymentMethod: 'cod',
    notes: '',
  })

  const [loading, setLoading] = useState(false)
  const [successOrder, setSuccessOrder] = useState(null)

  if (cart.length === 0 && !successOrder) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold">Votre panier est vide</h2>
        <Link to="/shop" className="inline-block bg-[#111] text-white text-xs font-bold px-6 py-2.5 rounded-full">
          Retour à la boutique
        </Link>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const order = await createOrder({
      name: form.name,
      phone: form.phone,
      address: `${form.address}, ${form.wilaya}`,
      paymentMethod: 'Paiement à la livraison (Cash on Delivery)',
      notes: form.notes,
    })

    setLoading(false)
    setSuccessOrder(order)
  }

  if (successOrder) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4 bg-white p-8 rounded-3xl border border-[#eaeaea] shadow-xs my-8">
        <div className="h-14 w-14 bg-emerald-100 text-emerald-600 rounded-full grid place-items-center mx-auto">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-xl font-black text-gray-900">Commande Confirmée !</h2>
        <p className="text-xs text-gray-600 leading-relaxed">
          Merci <strong>{form.name}</strong>, votre commande a été enregistrée avec succès. Notre équipe vous contactera au <strong>{form.phone}</strong> pour confirmer l'expédition.
        </p>
        <div className="bg-gray-50 p-3 rounded-2xl text-xs font-semibold text-gray-700">
          Numéro de commande : <span className="font-mono text-[#e94b16] font-bold">{successOrder._id || successOrder.orderNumber}</span>
        </div>
        <div className="pt-4 flex flex-col gap-2">
          <Link
            to="/orders"
            className="w-full bg-[#111] hover:bg-[#e94b16] text-white font-bold py-3 rounded-full text-xs transition"
          >
            Suivre mes commandes
          </Link>
          <Link to="/shop" className="text-xs text-gray-500 hover:text-black font-semibold pt-1">
            Continuer mes achats
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-black text-gray-900 mb-6">Finaliser ma Commande</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact info */}
          <div className="bg-white p-6 rounded-3xl border border-[#eaeaea] space-y-4">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Package size={16} className="text-[#e94b16]" /> Informations de Livraison
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold block mb-1 text-gray-700">Nom et Prénom *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#111]"
                  placeholder="ex: Mohamed Amine"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-gray-700">Numéro de Téléphone *</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#111]"
                  placeholder="ex: 0555 12 34 56"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-gray-700">Wilaya *</label>
                <select
                  value={form.wilaya}
                  onChange={(e) => setForm({ ...form, wilaya: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#111] bg-white"
                >
                  {WILAYAS.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1 text-gray-700">Adresse / Commune *</label>
                <input
                  type="text"
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#111]"
                  placeholder="ex: Didouche Mourad, Alger Centre"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold block mb-1 text-gray-700">Remarques pour le livreur (Optionnel)</label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#111]"
                  placeholder="ex: Appeler avant d'arriver"
                />
              </div>
            </div>
          </div>

          {/* Delivery & Payment Method */}
          <div className="bg-white p-6 rounded-3xl border border-[#eaeaea] space-y-4">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Truck size={16} className="text-[#e94b16]" /> Mode de Livraison & Paiement
            </h2>

            <div className="space-y-3 text-xs">
              <div className="border border-[#e94b16] bg-orange-50/50 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">Yalidine Express / ZR Express</p>
                  <p className="text-[11px] text-gray-500">Livraison rapide à domicile sur 58 Wilayas (24h - 48h)</p>
                </div>
                <span className="font-bold text-[#e94b16]">{shippingFee === 0 ? 'Gratuit' : formatPrice(shippingFee)}</span>
              </div>

              <div className="border border-gray-200 p-4 rounded-2xl flex items-center justify-between bg-gray-50">
                <div>
                  <p className="font-bold text-gray-900">Paiement à la Livraison (Cash on Delivery)</p>
                  <p className="text-[11px] text-gray-500">Payez en espèces lors de la réception de votre colis</p>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  Recommandé
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white p-6 rounded-3xl border border-[#eaeaea] space-y-4 h-fit">
          <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">Articles ({cart.length})</h2>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cart.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between items-center text-xs">
                <span className="text-gray-700 truncate max-w-[160px]">
                  {product.name} <span className="text-gray-400">x{quantity}</span>
                </span>
                <span className="font-bold text-gray-900">{formatPrice(product.price * quantity)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-3 space-y-2 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Sous-total</span>
              <span className="font-bold text-gray-900">{formatPrice(cartSubtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Livraison</span>
              <span className="font-bold text-gray-900">{shippingFee === 0 ? 'Gratuit' : formatPrice(shippingFee)}</span>
            </div>
            <div className="border-t border-gray-100 pt-2 flex justify-between text-sm font-black text-gray-900">
              <span>Total</span>
              <span className="text-[#e94b16]">{formatPrice(cartTotal)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#e94b16] hover:bg-orange-600 text-white font-bold py-3.5 rounded-full text-xs transition shadow-md disabled:opacity-50"
          >
            {loading ? 'Validation...' : `Confirmer la Commande (${formatPrice(cartTotal)})`}
          </button>
        </div>
      </form>
    </div>
  )
}
