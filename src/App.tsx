import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppHeader } from "./components/AppHeader";
import { BottomNavigation } from "./components/BottomNavigation";
import { LanguageProvider } from "./contexts/LanguageContext";
import { CartProvider } from "./contexts/CartContext";
import { AudioProvider } from "./contexts/AudioContext";
import { OrdersProvider } from "./contexts/OrdersContext";
import { AuthProvider } from "./contexts/AuthContext";
import { MiniPlayer } from "./components/MiniPlayer";
import { useScrollRestoration } from "./hooks/useScrollRestoration";
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
import PrivacySettings from "./pages/PrivacySettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Scroll restoration component
const ScrollToTop = () => {
  useScrollRestoration();
  return null;
};

interface AppShellProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  children: React.ReactNode;
}

const AppShell = ({ darkMode, toggleDarkMode, children }: AppShellProps) => {
  return (
    <div className="flex flex-col min-h-screen min-h-[100dvh] bg-background">
      <AppHeader darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      {/* Main scrollable content area */}
      <main 
        id="main-content"
        className="flex-1 pt-14 pb-[calc(3.5rem+env(safe-area-inset-bottom))] app-scroll scrollbar-hide"
      >
        {children}
      </main>
      
      <BottomNavigation />
      <MiniPlayer />
    </div>
  );
};

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
                    <ScrollToTop />
                    <AppShell darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
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
                        <Route path="/profile/privacy" element={<PrivacySettings />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </AppShell>
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
