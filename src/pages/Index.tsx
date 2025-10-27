import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/ProductCard";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutDialog } from "@/components/CheckoutDialog";
import { ProductGridSkeleton } from "@/components/LoadingSkeleton";
import { toast } from "sonner";
import { ShoppingBag, Store } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
}

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  products: {
    name: string;
    price: number;
    image_url: string;
  };
}

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingCart, setIsLoadingCart] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [sessionId] = useState(() => {
    let id = localStorage.getItem("cartSessionId");
    if (!id) {
      id = `session_${Date.now()}_${Math.random()}`;
      localStorage.setItem("cartSessionId", id);
    }
    return id;
  });

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name");

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products. Please refresh the page.");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const fetchCart = async () => {
    try {
      const { data, error } = await supabase
        .from("cart_items")
        .select(`
          *,
          products (name, price, image_url)
        `)
        .eq("session_id", sessionId);

      if (error) throw error;
      setCartItems(data || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const handleAddToCart = async (productId: string) => {
    setIsLoadingCart(true);
    try {
      const existingItem = cartItems.find(item => item.product_id === productId);

      if (existingItem) {
        const { error } = await supabase
          .from("cart_items")
          .update({ quantity: existingItem.quantity + 1 })
          .eq("id", existingItem.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("cart_items")
          .insert({
            product_id: productId,
            quantity: 1,
            session_id: sessionId,
          });

        if (error) throw error;
      }

      await fetchCart();
      toast.success("Added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    } finally {
      setIsLoadingCart(false);
    }
  };

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setIsLoadingCart(true);
    try {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: newQuantity })
        .eq("id", itemId);

      if (error) throw error;
      await fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    } finally {
      setIsLoadingCart(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    setIsLoadingCart(true);
    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", itemId);

      if (error) throw error;
      await fetchCart();
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    } finally {
      setIsLoadingCart(false);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSubmit = async (customerData: { name: string; email: string }) => {
    try {
      const total = cartItems.reduce((sum, item) => sum + (item.products.price * item.quantity), 0);
      const orderItems = cartItems.map(item => ({
        product_name: item.products.name,
        quantity: item.quantity,
        price: item.products.price,
        subtotal: item.products.price * item.quantity,
      }));

      const { error } = await supabase
        .from("orders")
        .insert({
          customer_name: customerData.name,
          customer_email: customerData.email,
          total,
          items: orderItems,
        });

      if (error) throw error;

      // Clear cart after successful order
      const { error: deleteError } = await supabase
        .from("cart_items")
        .delete()
        .eq("session_id", sessionId);

      if (deleteError) throw deleteError;

      await fetchCart();
      toast.success("Order placed successfully!");
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Failed to complete order");
      throw error;
    }
  };

  const total = cartItems.reduce((sum, item) => sum + (item.products.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Store className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Vibe Commerce
              </h1>
              <p className="text-xs text-muted-foreground">Your Style, Your Vibe</p>
            </div>
          </div>
          <CartDrawer
            cartItems={cartItems}
            isOpen={isCartOpen}
            onOpenChange={setIsCartOpen}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onCheckout={handleCheckout}
            isLoading={isLoadingCart}
          />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-50" />
        <div className="container mx-auto relative">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Discover Amazing Products
            </h2>
            <p className="text-xl text-muted-foreground">
              Shop the latest tech and accessories with unbeatable prices
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold">Featured Products</h3>
            <p className="text-muted-foreground">Browse our curated collection</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShoppingBag className="h-4 w-4" />
            <span>{products.length} products available</span>
          </div>
        </div>

        {isLoadingProducts ? (
          <ProductGridSkeleton />
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                imageUrl={product.image_url}
                onAddToCart={handleAddToCart}
                isLoading={isLoadingCart}
              />
            ))}
          </div>
        )}
      </main>

      <CheckoutDialog
        isOpen={isCheckoutOpen}
        onOpenChange={setIsCheckoutOpen}
        cartItems={cartItems}
        total={total}
        onSubmit={handleCheckoutSubmit}
      />

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Vibe Commerce. Full Stack E-Commerce Demo.</p>
            <p className="mt-1">Built with React, Lovable Cloud & PostgreSQL</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
