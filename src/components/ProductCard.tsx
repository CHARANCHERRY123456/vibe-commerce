import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  onAddToCart: (id: string) => void;
  isLoading?: boolean;
}

export const ProductCard = ({ id, name, price, description, imageUrl, onAddToCart, isLoading }: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-elegant)] border-border/50">
      <div className="relative overflow-hidden aspect-square">
        <img
          src={imageUrl}
          alt={name}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold line-clamp-1">{name}</CardTitle>
        <CardDescription className="line-clamp-2 min-h-[2.5rem]">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          ${price.toFixed(2)}
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => onAddToCart(id)} 
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-primary to-primary-hover hover:shadow-[var(--shadow-elegant)] transition-all duration-300"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isLoading ? "Adding..." : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
};
