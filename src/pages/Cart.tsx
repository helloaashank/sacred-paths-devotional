import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FiTrash2, FiShoppingBag, FiExternalLink } from "react-icons/fi";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import qrCodeImage from "@/assets/qr-code.png";

const UPI_ID = "8802257971@ybl";
const PHONEPE_LINK = `upi://pay?pa=${UPI_ID}&pn=Manish%20Kumar&cu=INR`;

const PaymentSection = ({ total }: { total: number }) => {
  const { t } = useLanguage();
  
  return (
    <Card className="bg-gradient-card mt-6">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-4 text-center">
          {t.cart?.pay_via_upi || "Pay via UPI"}
        </h3>
        
        <div className="flex flex-col items-center gap-4">
          {/* QR Code */}
          <div className="bg-white p-3 rounded-lg shadow-md">
            <img 
              src={qrCodeImage} 
              alt="UPI QR Code" 
              className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
            />
          </div>
          
          {/* UPI ID */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">UPI ID</p>
            <p className="font-mono text-foreground font-semibold bg-muted px-3 py-1 rounded">
              {UPI_ID}
            </p>
          </div>
          
          {/* Amount */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">{t.cart?.amount || "Amount"}</p>
            <p className="text-2xl font-bold text-primary">₹{total}</p>
          </div>
          
          {/* PhonePe Link */}
          <a 
            href={`${PHONEPE_LINK}&am=${total}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button 
              size="lg" 
              className="w-full bg-[#5f259f] hover:bg-[#4a1d7a] text-white"
            >
              <FiExternalLink className="mr-2 h-4 w-4" />
              {t.cart?.pay_with_phonepe || "Pay with PhonePe"}
            </Button>
          </a>
          
          <p className="text-xs text-muted-foreground text-center">
            {t.cart?.scan_qr_note || "Scan QR code or click button to pay via PhonePe/UPI"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

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
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  {/* Item Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base sm:text-lg text-foreground truncate">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">{item.author}</p>
                    <p className="text-primary font-semibold mt-1 text-sm sm:text-base">₹{item.price}</p>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-8 w-8 p-0"
                      >
                        -
                      </Button>
                      <span className="w-8 sm:w-12 text-center font-semibold text-sm sm:text-base">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 p-0"
                      >
                        +
                      </Button>
                    </div>

                    {/* Price and Delete */}
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className="text-right min-w-[60px] sm:min-w-[80px]">
                        <p className="font-bold text-base sm:text-lg text-foreground">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                        className="text-destructive hover:text-destructive h-8 w-8"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
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
          </CardContent>
        </Card>

        {/* Payment Section with QR Code */}
        <PaymentSection total={total} />
      </div>
    </div>
  );
};

export default Cart;
