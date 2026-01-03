import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FiArrowLeft, FiExternalLink, FiCheckCircle } from "react-icons/fi";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import qrCodeImage from "@/assets/qr-code.png";

const UPI_ID = "8802257971@ybl";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { clearCart } = useCart();
  
  // Get amount and items from navigation state
  const { amount, items, type } = location.state || { amount: 0, items: [], type: "cart" };
  
  // Generate universal UPI link with pre-filled amount
  const upiLink = `upi://pay?pa=${UPI_ID}&pn=Manish%20Kumar&cu=INR&am=${amount}`;

  if (!amount || amount <= 0) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {t.common?.error || "Error"}
          </h1>
          <p className="text-muted-foreground mb-4">No payment amount specified</p>
          <Link to="/books">
            <Button className="bg-gradient-hero shadow-soft">
              {t.cart?.continue_shopping || "Continue Shopping"}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4">
      <div className="container mx-auto max-w-lg">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <FiArrowLeft className="mr-2" />
          {t.common?.back || "Back"}
        </Button>

        {/* Payment Card */}
        <Card className="bg-gradient-card overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                {t.cart?.pay_via_upi || "Pay via UPI"}
              </h1>
              <p className="text-muted-foreground text-sm">
                {t.cart?.scan_qr_note || "Scan QR code or tap button to pay with any UPI app"}
              </p>
            </div>

            {/* Amount Display */}
            <div className="bg-primary/10 rounded-xl p-4 mb-6 text-center">
              <p className="text-sm text-muted-foreground mb-1">
                {t.cart?.amount || "Amount to Pay"}
              </p>
              <p className="text-4xl sm:text-5xl font-bold text-primary">
                ₹{amount}
              </p>
            </div>

            {/* Order Summary */}
            {items && items.length > 0 && (
              <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-foreground mb-2 text-sm">
                  {type === "direct" ? "Item" : `${items.length} Item(s)`}
                </h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {items.map((item: { title: string; quantity?: number; price: number }, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-muted-foreground truncate flex-1">
                        {item.title} {item.quantity && item.quantity > 1 ? `×${item.quantity}` : ""}
                      </span>
                      <span className="text-foreground font-medium ml-2">
                        ₹{item.price * (item.quantity || 1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* QR Code */}
            <div className="flex justify-center mb-6">
              <div className="bg-white p-4 rounded-xl shadow-lg">
                <img 
                  src={qrCodeImage} 
                  alt="UPI QR Code" 
                  className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
                />
              </div>
            </div>

            {/* UPI ID */}
            <div className="text-center mb-6">
              <p className="text-xs text-muted-foreground mb-1">UPI ID</p>
              <div className="inline-flex items-center gap-2 bg-muted px-4 py-2 rounded-lg">
                <span className="font-mono text-foreground font-semibold">{UPI_ID}</span>
              </div>
            </div>

            {/* Universal UPI Pay Button */}
            <a 
              href={upiLink}
              className="block w-full mb-4"
            >
              <Button 
                size="lg" 
                className="w-full bg-gradient-hero shadow-soft text-base sm:text-lg py-6"
              >
                <FiExternalLink className="mr-2 h-5 w-5" />
                Pay ₹{amount} with UPI App
              </Button>
            </a>

            <p className="text-xs text-center text-muted-foreground">
              Opens in your default UPI app (PhonePe, GPay, Paytm, etc.)
            </p>

            {/* Payment Complete Action */}
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground text-center mb-4">
                After completing payment:
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  if (type === "cart") {
                    clearCart();
                  }
                  navigate("/books");
                }}
              >
                <FiCheckCircle className="mr-2 h-4 w-4" />
                I've Completed Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Payment;
