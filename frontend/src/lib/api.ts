const api = {
  getProducts: async () => {
    const res = await fetch('/api/products');
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },
  getCart: async (sessionId: string) => {
    const res = await fetch(`/api/cart?sessionId=${encodeURIComponent(sessionId)}`);
    if (!res.ok) throw new Error('Failed to fetch cart');
    return res.json(); // { items, total }
  },
  addToCart: async (productId: string, qty: number, sessionId: string) => {
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, qty, sessionId })
    });
    if (!res.ok) throw new Error('Failed to add to cart');
    return res.json();
  },
  updateCartItem: async (itemId: string, qty: number) => {
    const res = await fetch(`/api/cart/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qty })
    });
    if (!res.ok) throw new Error('Failed to update cart item');
    return res.json();
  },
  removeCartItem: async (itemId: string) => {
    const res = await fetch(`/api/cart/${itemId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to remove cart item');
    return res.json();
  },
  checkout: async (sessionId: string, customer: { name: string; email: string }) => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, customer })
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error('Checkout failed: ' + txt);
    }
    return res.json();
  }
};

export default api;
