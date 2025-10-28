
const BASE = process.env.BASE || 'http://localhost:4000';
const sessionId = 'smoke_test_session_1';

async function run() {
  try {
    console.log('BASE:', BASE);

    // 1) products
    const prodRes = await fetch(`${BASE}/api/products`);
    const products = await prodRes.json();
    console.log('\n1) /api/products -> status', prodRes.status);
    console.log('products count:', Array.isArray(products) ? products.length : 'unexpected', '\n');

    if (!Array.isArray(products) || products.length === 0) {
      console.error('No products available; aborting smoke test');
      process.exit(1);
    }

    const first = products[0];
    const productId = first.id || first._id;
    console.log('Using product id:', productId, 'name:', first.name);

    // 2) add to cart
    const addRes = await fetch(`${BASE}/api/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, qty: 2, sessionId })
    });
    const added = await addRes.json();
    console.log('\n2) POST /api/cart ->', addRes.status, added);

    // 3) get cart
    const getCartRes = await fetch(`${BASE}/api/cart?sessionId=${encodeURIComponent(sessionId)}`);
    const cart = await getCartRes.json();
    console.log('\n3) GET /api/cart ->', getCartRes.status, cart);

    const itemId = cart.items && cart.items[0] && (cart.items[0].id || cart.items[0]._id);
    if (!itemId) {
      console.error('No cart item found; aborting');
      process.exit(1);
    }

    // 4) update qty
    const patchRes = await fetch(`${BASE}/api/cart/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qty: 3 })
    });
    const patched = await patchRes.json();
    console.log('\n4) PATCH /api/cart/:id ->', patchRes.status, patched);

    // 5) delete item
    const delRes = await fetch(`${BASE}/api/cart/${itemId}`, { method: 'DELETE' });
    const delOut = await delRes.json();
    console.log('\n5) DELETE /api/cart/:id ->', delRes.status, delOut);

    // add again to checkout
    await fetch(`${BASE}/api/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, qty: 1, sessionId })
    });

    // 6) checkout
    const checkoutRes = await fetch(`${BASE}/api/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, customer: { name: 'Smoke Tester', email: 'smoke@example.com' } })
    });
    const receipt = await checkoutRes.json();
    console.log('\n6) POST /api/checkout ->', checkoutRes.status, receipt);

    console.log('\nSmoke test completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Smoke test failed:', err);
    process.exit(2);
  }
}

run();
