import React, { useState } from 'react'
import { Plus, Trash2, ShieldCheck, Package, ShoppingBag, Clock, CheckCircle2, Truck, XCircle, UploadCloud, X } from 'lucide-react'
import { useStore } from '../store'

export function Admin() {
  const { products, addProduct, deleteProduct, orders, updateOrderStatus, formatPrice, currentUser } = useStore()
  const [activeTab, setActiveTab] = useState('orders') // 'orders' | 'products'

  const [form, setForm] = useState({
    name: '',
    category: 'Laptops',
    price: '',
    stock: 10,
    description: '',
  })
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleFile = (selectedFile) => {
    if (!selectedFile.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide.')
      return
    }
    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.name || !form.price) return

    setLoading(true)
    await addProduct({
      name: form.name,
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock) || 10,
      imageFile: file,
      description: form.description || 'Produit high-tech avec garantie officielle en Algérie.',
    })
    setLoading(false)
    setSuccess(true)
    setForm({
      name: '',
      category: 'Laptops',
      price: '',
      stock: 10,
      description: '',
    })
    setFile(null)
    setPreview(null)
    setTimeout(() => setSuccess(false), 3000)
  }

  const handleDelete = (id, name) => {
    if (confirm(`Supprimer le produit "${name}" ?`)) {
      deleteProduct(id)
    }
  }

  const getStatusBadge = (status) => {
    const s = (status || 'pending').toLowerCase()
    switch (s) {
      case 'delivered':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1"><CheckCircle2 size={12} /> Livrée</span>
      case 'shipped':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1"><Truck size={12} /> Expédiée</span>
      case 'processing':
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1"><Clock size={12} /> En préparation</span>
      case 'cancelled':
        return <span className="bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1"><XCircle size={12} /> Annulée</span>
      default:
        return <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1"><Clock size={12} /> En attente</span>
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <ShieldCheck size={24} className="text-[#e94b16]" /> Panneau d'Administration
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Connecté en tant que <strong>{currentUser?.name || 'Administrateur'}</strong> ({currentUser?.email || 'admin'})
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-full text-xs font-bold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-full transition ${
              activeTab === 'orders'
                ? 'bg-[#111] text-white shadow-xs'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            📦 Commandes ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-full transition ${
              activeTab === 'products'
                ? 'bg-[#111] text-white shadow-xs'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            💻 Produits ({products.length})
          </button>
        </div>
      </div>

      {/* TAB 1: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Gestion des Commandes Clients</h2>
            <span className="text-xs text-gray-500">{orders.length} commande(s) au total</span>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-[#eaeaea] text-gray-500 text-xs">
              Aucune commande enregistrée pour le moment.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const orderId = order._id || order.id
                const clientName = (typeof order.user === 'object' && order.user?.name) || order.customer?.name || 'Client'
                const clientEmail = (typeof order.user === 'object' && order.user?.email) || order.customer?.email || 'Email'
                const clientAddress = order.customer?.address || 'Algérie'

                return (
                  <div
                    key={orderId}
                    className="bg-white rounded-3xl border border-[#eaeaea] p-6 shadow-xs space-y-4"
                  >
                    {/* Header line */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 text-xs">Commande</span>
                          <span className="font-mono text-[#e94b16] font-bold text-xs">#{orderId}</span>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="text-[11px] text-gray-500 mt-1">
                          Client : <strong>{clientName}</strong> ({clientEmail}) · {order.customer?.phone || ''} · {clientAddress}
                        </p>
                      </div>

                      {/* Status changer dropdown */}
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-500 font-semibold">Changer le statut :</span>
                        <select
                          value={order.status || 'pending'}
                          onChange={(e) => updateOrderStatus(orderId, e.target.value)}
                          className="bg-gray-50 border border-gray-300 font-bold text-gray-800 rounded-xl px-3 py-1.5 outline-none focus:border-[#e94b16] cursor-pointer"
                        >
                          <option value="pending">⏳ En attente (Pending)</option>
                          <option value="processing">⚙️ En préparation (Processing)</option>
                          <option value="shipped">🚚 Expédiée Yalidine (Shipped)</option>
                          <option value="delivered">✅ Livrée (Delivered)</option>
                          <option value="cancelled">❌ Annulée (Cancelled)</option>
                        </select>
                      </div>
                    </div>

                    {/* Ordered items */}
                    <div className="space-y-2">
                      {(order.items || []).map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <span className="text-gray-700">
                            {item.name || item.product?.name || 'Produit'} <span className="text-gray-400">x{item.quantity}</span>
                          </span>
                          <span className="font-bold text-gray-900">
                            {formatPrice((item.price || item.product?.price || 0) * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Footer total */}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-100 text-xs">
                      <span className="text-gray-400">
                        Date : {order.createdAt ? new Date(order.createdAt).toLocaleString('fr-FR') : 'Récemment'}
                      </span>
                      <span className="text-sm font-black text-gray-900">
                        Montant Total : <span className="text-[#e94b16]">{formatPrice(order.totalPrice || order.total || 0)}</span>
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Form: Add Product */}
          <div className="bg-white p-6 rounded-3xl border border-[#eaeaea] shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <Plus size={16} className="text-[#e94b16]" /> Ajouter un Nouveau Produit
            </h2>

            {success && (
              <div className="bg-emerald-50 text-emerald-700 text-xs p-3 rounded-xl font-semibold border border-emerald-200">
                ✓ Produit ajouté avec succès dans MongoDB !
              </div>
            )}

            <form onSubmit={handleAdd} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold block mb-1 text-gray-700">Nom du produit *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="ex: Dell XPS 15"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-[#111]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1 text-gray-700">Catégorie *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-2.5 py-2 outline-none focus:border-[#111] bg-white"
                  >
                    <option value="Laptops">PC Portables</option>
                    <option value="Smartphones">Smartphones</option>
                    <option value="Tablets">Tablettes</option>
                    <option value="Audio">Audio</option>
                    <option value="Accessories">Accessoires</option>
                    <option value="Electronics">Électronique</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-gray-700">Prix (en DZ) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="ex: 85000"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-[#111]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1 text-gray-700">Quantité en Stock</label>
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  placeholder="10"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-[#111]"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-gray-700">Photo du produit</label>

                {preview ? (
                  <div className="relative border border-gray-200 rounded-2xl p-2.5 bg-gray-50 flex items-center gap-3">
                    <img
                      src={preview}
                      alt="Aperçu"
                      className="h-14 w-14 object-contain rounded-xl bg-white border border-gray-200 p-1 shrink-0"
                    />
                    <div className="min-w-0 flex-1 text-xs">
                      <p className="font-bold text-gray-900 truncate">{file?.name}</p>
                      <p className="text-[11px] text-gray-500">{(file?.size / 1024).toFixed(1)} Ko</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null)
                        setPreview(null)
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-white transition"
                      title="Supprimer la photo"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label
                    onDragOver={(e) => {
                      e.preventDefault()
                      setIsDragging(true)
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault()
                      setIsDragging(false)
                      const dropped = e.dataTransfer.files?.[0]
                      if (dropped) handleFile(dropped)
                    }}
                    className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition ${
                      isDragging
                        ? 'border-[#e94b16] bg-orange-50/50'
                        : 'border-gray-300 hover:border-gray-400 bg-gray-50/50'
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const selected = e.target.files?.[0]
                        if (selected) handleFile(selected)
                      }}
                      className="hidden"
                    />
                    <div className="h-9 w-9 rounded-full bg-white shadow-2xs border border-gray-200 grid place-items-center text-gray-500 mb-1.5">
                      <UploadCloud size={18} className={isDragging ? 'text-[#e94b16]' : 'text-gray-500'} />
                    </div>
                    <p className="text-xs font-bold text-gray-800">
                      Glissez-déposez une image ici
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      ou <span className="text-[#e94b16] underline font-semibold">cliquez pour choisir un fichier</span>
                    </p>
                  </label>
                )}
              </div>

              <div>
                <label className="font-semibold block mb-1 text-gray-700">Description</label>
                <textarea
                  rows="3"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Caractéristiques du produit..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-[#111]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#111] hover:bg-[#e94b16] text-white font-bold py-3 rounded-full transition shadow-xs disabled:opacity-50 text-xs"
              >
                {loading ? 'Enregistrement...' : 'Ajouter le Produit'}
              </button>
            </form>
          </div>

          {/* Products List Table */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-[#eaeaea] shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center justify-between">
              <span>Gestion des Produits</span>
              <span className="text-xs text-gray-500 font-normal">{products.length} articles</span>
            </h2>

            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {products.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-12 w-12 object-contain bg-gray-50 rounded-xl p-1 shrink-0 mix-blend-multiply"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{p.name}</p>
                      <p className="text-[11px] text-gray-400">
                        {p.category} · Stock: <span className="font-semibold text-gray-700">{p.stock}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-xs font-black text-gray-900">{formatPrice(p.price)}</span>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Supprimer le produit"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
