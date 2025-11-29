import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FiTrash2, FiShoppingBag } from "react-icons/fi";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, total } = useCart();
  const { t } = useLanguage();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <FiShoppingBag className="text-6xl text-muted-foreground mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">{t.cart.empty}</h1>
          <Link to="/books">
            <Button className="mt-4 bg-gradient-hero shadow-soft">
              {t.cart.continue_shopping}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">{t.cart.title}</h1>

        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <Card key={item.id} className="bg-gradient-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.author}</p>
                    <p className="text-primary font-semibold mt-1">₹{item.price}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </Button>
                    <span className="w-12 text-center font-semibold">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </Button>
                  </div>

                  <div className="text-right min-w-[80px]">
                    <p className="font-bold text-lg text-foreground">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromCart(item.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <FiTrash2 />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-card">
          <CardContent className="p-6">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-lg">
                <span className="text-muted-foreground">{t.cart.subtotal}:</span>
                <span className="font-semibold text-foreground">₹{total}</span>
              </div>
              <div className="flex justify-between text-2xl font-bold">
                <span className="text-foreground">{t.cart.total}:</span>
                <span className="text-primary">₹{total}</span>
              </div>
            </div>
            <Button size="lg" className="w-full bg-gradient-hero shadow-soft">
              {t.cart.checkout}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Cart;
