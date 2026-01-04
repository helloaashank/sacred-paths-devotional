import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface OrderItem {
  title: string;
  price: number;
  quantity?: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  date: string;
  status: "completed";
}

interface OrdersContextType {
  orders: Order[];
  addOrder: (items: OrderItem[], total: number) => void;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  const addOrder = (items: OrderItem[], total: number) => {
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      items,
      total,
      date: new Date().toISOString(),
      status: "completed",
    };
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  return (
    <OrdersContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return context;
};
