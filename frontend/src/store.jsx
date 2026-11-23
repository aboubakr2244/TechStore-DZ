import React, { createContext, useContext, useEffect, useState } from 'react'
import { api, formatPrice, getImageUrl, getToken, setToken } from './api'

const StoreContext = createContext()

export const useStore = () => {
  const context = useContext(StoreContext)
  if (!context) throw new Error('useStore must be used within StoreProvider')
  return context
}

export function StoreProvider({ children }) {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [favorites, setFavorites] = useState([])
  const [orders, setOrders] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // 1. Initial Load: Load local storage & sync backend
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) setCart(JSON.parse(savedCart))

      const savedFavs = localStorage.getItem('favs')
      if (savedFavs) setFavorites(JSON.parse(savedFavs))

      const savedUser = localStorage.getItem('user')
      if (savedUser) setCurrentUser(JSON.parse(savedUser))
    } catch (_) {}

    loadProducts()
    checkAuth()
  }, [])

  // Sync cart & favs to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem('favs', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    if (currentUser) localStorage.setItem('user', JSON.stringify(currentUser))
    else localStorage.removeItem('user')
  }, [currentUser])

  // Products
  const loadProducts = async () => {
    try {
      setLoading(true)
      const res = await api.getProducts()
      if (res?.data && Array.isArray(res.data)) {
        const mapped = res.data.map((p) => ({
          id: p._id,
          name: p.name,
          description: p.description,
          price: p.price,
          stock: p.stock || 10,
          image: getImageUrl(p.image),
          category: typeof p.category === 'object' ? p.category?.name : p.category,
          brand: p.name.split(' ')[0] || 'TechStore',
        }))
        setProducts(mapped)
      }
    } catch (err) {
      console.warn('Could not load products from backend:', err)
    } finally {
      setLoading(false)
    }
  }

  const addProduct = async (productData) => {
    try {
      // Find or create category in backend
      const catRes = await api.getCategories()
      let catId = catRes.data?.find(
        (c) => c.name.toLowerCase() === (productData.category || '').toLowerCase()
      )?._id

      if (!catId && productData.category) {
        const newCat = await api.createCategory(productData.category)
        catId = newCat.data?._id
      }

      let body
      if (productData.imageFile instanceof File) {
        body = new FormData()
        body.append('name', productData.name)
        body.append('description', productData.description || '')
        body.append('price', String(productData.price))
        body.append('stock', String(productData.stock || 10))
        if (catId) body.append('category', catId)
        body.append('image', productData.imageFile)
      } else {
        body = {
          ...productData,
          category: catId || undefined,
        }
      }

      const res = await api.createProduct(body)
      if (res?.data) {
        await loadProducts()
        return res.data
      }
    } catch (err) {
      alert(err.message || 'Erreur lors de la création du produit')
    }
  }

  const deleteProduct = async (id) => {
    try {
      await api.deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      alert(err.message || 'Erreur lors de la suppression')
    }
  }

  const getProductById = (id) => products.find((p) => p.id === id)

  // Cart
  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.product.id === product.id)
      if (exists) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { product, quantity }]
    })

    if (getToken()) {
      api.addToCart(product.id, quantity).catch(() => {})
    }
  }

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
    if (getToken()) {
      api.updateCart(productId, quantity).catch(() => {})
    }
  }

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId))
    if (getToken()) {
      api.removeFromCart(productId).catch(() => {})
    }
  }

  const clearCart = () => setCart([])

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0)
  const cartSubtotal = cart.reduce(
    (acc, item) => acc + (item.product.price || 0) * item.quantity,
    0
  )
  const shippingFee = cartSubtotal >= 20000 || cartSubtotal === 0 ? 0 : 600
  const cartTotal = cartSubtotal + shippingFee

  // Wishlist
  const toggleFavorite = (id) =>
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  const isFavorite = (id) => favorites.includes(id)

  // Auth
  const checkAuth = async () => {
    const token = getToken()
    if (!token) return
    try {
      const res = await api.getProfile()
      if (res?.data) {
        const user = {
          id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
        }
        setCurrentUser(user)
        loadOrders(user.role)
      }
    } catch (_) {
      setToken(null)
      setCurrentUser(null)
    }
  }

  const login = async (email, password) => {
    const res = await api.login(email.trim().toLowerCase(), password)
    if (res?.token && res?.user) {
      setToken(res.token)
      const user = {
        id: res.user._id,
        name: res.user.name,
        email: res.user.email,
        role: res.user.role,
      }
      setCurrentUser(user)
      loadOrders(user.role)
      return { success: true }
    }
    return { success: false, error: 'Identifiants invalides' }
  }

  const signup = async (name, email, password) => {
    await api.register(name, email.trim().toLowerCase(), password)
    return await login(email, password)
  }

  const logout = () => {
    setToken(null)
    setCurrentUser(null)
    setCart([])
    setOrders([])
  }

  // Orders
  const loadOrders = async (role = currentUser?.role) => {
    try {
      const res = role === 'admin' ? await api.getAllOrders() : await api.getMyOrders()
      if (res?.data) setOrders(res.data)
    } catch (_) {}
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus)
      setOrders((prev) =>
        prev.map((o) =>
          (o._id === orderId || o.id === orderId) ? { ...o, status: newStatus } : o
        )
      )
    } catch (err) {
      alert(err.message || 'Erreur lors de la mise à jour du statut')
    }
  }

  const createOrder = async (customerData) => {
    let orderResult = null
    if (getToken()) {
      try {
        // sync items to backend cart first
        for (const item of cart) {
          try {
            await api.addToCart(item.product.id, item.quantity)
          } catch (_) {}
        }
        const res = await api.createOrder()
        if (res?.data) orderResult = res.data
      } catch (_) {}
    }

    if (!orderResult) {
      orderResult = {
        _id: `DZ-${Date.now()}`,
        items: cart.map((c) => ({
          name: c.product.name,
          price: c.product.price,
          quantity: c.quantity,
          image: c.product.image,
        })),
        totalPrice: cartTotal,
        status: 'pending',
        customer: customerData,
        createdAt: new Date().toISOString(),
      }
    }

    setOrders((prev) => [orderResult, ...prev])
    clearCart()
    return orderResult
  }

  return (
    <StoreContext.Provider
      value={{
        products,
        loading,
        addProduct,
        deleteProduct,
        getProductById,
        refreshProducts: loadProducts,

        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        shippingFee,
        cartTotal,

        favorites,
        toggleFavorite,
        isFavorite,

        currentUser,
        login,
        signup,
        logout,

        orders,
        createOrder,
        updateOrderStatus,
        refreshOrders: loadOrders,

        formatPrice,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}
