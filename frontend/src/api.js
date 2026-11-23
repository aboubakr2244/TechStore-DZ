export const API_URL = 'http://localhost:5000'

export const getToken = () => localStorage.getItem('token')
export const setToken = (token) => {
  if (token) localStorage.setItem('token', token)
  else localStorage.removeItem('token')
}

export function formatPrice(price) {
  if (!price && price !== 0) return '0 DZ'
  return `${Number(price).toLocaleString('fr-FR')} DZ`
}

export function getImageUrl(image) {
  if (!image) return 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=85'
  if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('data:')) {
    return image
  }
  const clean = image.replace(/^\/+/, '').replace(/^Uploads[\\/]/i, '')
  return `${API_URL}/Uploads/${clean}`
}

async function request(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`
  const token = getToken()
  const headers = { ...options.headers }

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`
  }

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(url, { ...options, headers })
  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data.message || data.error || `Erreur (${res.status})`)
  }
  return data
}

export const api = {
  // Auth
  login: (email, password) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name, email, password) =>
    request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  getProfile: () => request('/api/users/profile'),

  // Products
  getProducts: () => request('/api/products'),
  getProduct: (id) => request(`/api/products/${id}`),
  createProduct: (data) =>
    request('/api/products', {
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),
  updateProduct: (id, data) =>
    request(`/api/products/${id}`, {
      method: 'PUT',
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),
  deleteProduct: (id) => request(`/api/products/${id}`, { method: 'DELETE' }),

  // Categories
  getCategories: () => request('/api/categories'),
  createCategory: (name) =>
    request('/api/categories', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),

  // Cart
  getCart: () => request('/api/cart'),
  addToCart: (productId, quantity = 1) =>
    request('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    }),
  updateCart: (productId, quantity) =>
    request(`/api/cart/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    }),
  removeFromCart: (productId) =>
    request(`/api/cart/${productId}`, { method: 'DELETE' }),

  // Orders
  createOrder: () => request('/api/orders', { method: 'POST' }),
  getMyOrders: () => request('/api/orders/my'),
  getAllOrders: () => request('/api/orders'),
  updateOrderStatus: (id, status) =>
    request(`/api/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
}
