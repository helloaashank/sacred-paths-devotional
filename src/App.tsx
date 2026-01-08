import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { LanguageProvider } from "./contexts/LanguageContext";
import { CartProvider } from "./contexts/CartContext";
import { AudioProvider } from "./contexts/AudioContext";
import { OrdersProvider } from "./contexts/OrdersContext";
import { AuthProvider } from "./contexts/AuthContext";
import { MiniPlayer } from "./components/MiniPlayer";
import Home from "./pages/Home";
import Books from "./pages/Books";
import BookDetail from "./pages/BookDetail";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";
import Orders from "./pages/Orders";
import Bhajans from "./pages/Bhajans";
import Panchang from "./pages/Panchang";
import Vidhis from "./pages/Vidhis";
import Videos from "./pages/Videos";
import YoutubePlayerScreen from "./pages/YoutubePlayerScreen";
import Search from "./pages/Search";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", String(newMode));
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <LanguageProvider>
            <CartProvider>
              <OrdersProvider>
                <AudioProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <div className="flex flex-col min-h-screen">
                      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                      <main className="flex-1 pb-20 sm:pb-24">
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/books" element={<Books />} />
                          <Route path="/books/:id" element={<BookDetail />} />
                          <Route path="/cart" element={<Cart />} />
                          <Route path="/payment" element={<Payment />} />
                          <Route path="/orders" element={<Orders />} />
                          <Route path="/bhajans" element={<Bhajans />} />
                          <Route path="/panchang" element={<Panchang />} />
                          <Route path="/vidhis" element={<Vidhis />} />
                          <Route path="/videos" element={<Videos />} />
                          <Route path="/videos/:videoId" element={<YoutubePlayerScreen />} />
                          <Route path="/search" element={<Search />} />
                          <Route path="/auth" element={<Auth />} />
                          <Route path="/profile" element={<Profile />} />
                          <Route path="/profile/:userId" element={<Profile />} />
                          <Route path="/profile/edit" element={<EditProfile />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                      <Footer />
                      <MiniPlayer />
                    </div>
                  </BrowserRouter>
                </AudioProvider>
              </OrdersProvider>
            </CartProvider>
          </LanguageProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
