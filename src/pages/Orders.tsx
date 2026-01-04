import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FiPackage, FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import { useOrders } from "@/contexts/OrdersContext";
import { useLanguage } from "@/contexts/LanguageContext";

const Orders = () => {
  const { orders } = useOrders();
  const { t } = useLanguage();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/books">
            <Button variant="ghost" size="icon">
              <FiArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {t.orders?.title || "My Orders"}
          </h1>
        </div>

        {orders.length === 0 ? (
          <Card className="bg-gradient-card">
            <CardContent className="p-8 text-center">
              <FiPackage className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {t.orders?.no_orders || "No orders yet"}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t.orders?.start_shopping || "Start shopping to see your orders here"}
              </p>
              <Link to="/books">
                <Button className="bg-gradient-hero shadow-soft">
                  {t.cart?.continue_shopping || "Continue Shopping"}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="bg-gradient-card">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-mono text-sm text-muted-foreground">
                        {order.id}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(order.date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <FiCheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {t.orders?.completed || "Completed"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-foreground">
                          {item.title} {item.quantity && item.quantity > 1 ? `×${item.quantity}` : ""}
                        </span>
                        <span className="text-muted-foreground">
                          ₹{item.price * (item.quantity || 1)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-border flex justify-between">
                    <span className="font-semibold text-foreground">
                      {t.cart?.total || "Total"}
                    </span>
                    <span className="font-bold text-primary text-lg">
                      ₹{order.total}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
