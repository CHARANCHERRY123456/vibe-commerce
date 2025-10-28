-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  description TEXT,
  image_url TEXT,
  stock INTEGER DEFAULT 100 CHECK (stock >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  session_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table for checkout history
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  items JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Products are publicly readable
CREATE POLICY "Products are viewable by everyone"
  ON public.products FOR SELECT
  USING (true);

-- Cart items are publicly accessible (session-based)
CREATE POLICY "Cart items are viewable by everyone"
  ON public.cart_items FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert cart items"
  ON public.cart_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update cart items"
  ON public.cart_items FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete cart items"
  ON public.cart_items FOR DELETE
  USING (true);

-- Orders are publicly accessible
CREATE POLICY "Anyone can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Orders are viewable by everyone"
  ON public.orders FOR SELECT
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for cart_items
CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert mock products
INSERT INTO public.products (name, price, description, image_url) VALUES
  ('Wireless Headphones', 79.99, 'Premium noise-cancelling wireless headphones with 30-hour battery life', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'),
  ('Smart Watch', 299.99, 'Fitness tracking smartwatch with heart rate monitor and GPS', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'),
  ('Laptop Backpack', 49.99, 'Water-resistant laptop backpack with USB charging port', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62'),
  ('Bluetooth Speaker', 129.99, 'Portable waterproof bluetooth speaker with 360° sound', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1'),
  ('Wireless Mouse', 34.99, 'Ergonomic wireless mouse with precision tracking', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46'),
  ('USB-C Hub', 59.99, 'Multi-port USB-C hub with HDMI, USB 3.0, and SD card reader', 'https://images.unsplash.com/photo-1625948515291-69613efd103f'),
  ('Phone Stand', 24.99, 'Adjustable aluminum phone stand for desk', 'https://images.unsplash.com/photo-1601524909162-ae8725290836'),
  ('Webcam HD', 89.99, '1080p HD webcam with auto-focus and dual microphones', 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04'),
  ('Mechanical Keyboard', 149.99, 'RGB mechanical gaming keyboard with customizable switches', 'https://images.unsplash.com/photo-1595225476474-87563907a212'),
  ('Desk Lamp', 39.99, 'LED desk lamp with adjustable brightness and color temperature', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c');