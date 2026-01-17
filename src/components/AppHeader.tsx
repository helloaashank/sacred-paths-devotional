import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FiChevronLeft, FiSun, FiMoon, FiShoppingCart, FiSearch } from "react-icons/fi";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { NotificationsDropdown } from "@/components/NotificationsDropdown";

interface AppHeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const routeTitles: Record<string, string> = {
  "/": "SpiritualHub",
  "/books": "Books",
  "/bhajans": "Bhajans",
  "/panchang": "Panchang",
  "/vidhis": "Pooja Vidhis",
  "/videos": "Videos",
  "/cart": "Cart",
  "/orders": "Orders",
  "/auth": "Sign In",
  "/profile": "Profile",
  "/profile/edit": "Edit Profile",
  "/search": "Search",
  "/payment": "Payment",
};

export const AppHeader = ({ darkMode, toggleDarkMode }: AppHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount } = useCart();
  
  const isHome = location.pathname === "/";
  const title = routeTitles[location.pathname] || "SpiritualHub";

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-b border-border safe-area-top">
      <div className="flex items-center justify-between h-14 px-2">
        {/* Left side - Back button or Logo */}
        <div className="flex items-center gap-1 min-w-[80px]">
          {!isHome ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="h-10 w-10 -ml-1"
            >
              <FiChevronLeft className="h-6 w-6" />
            </Button>
          ) : (
            <Link to="/" className="flex items-center pl-2">
              <img src="/logo.png" alt="SpiritualHub" className="h-8 w-8" />
            </Link>
          )}
        </div>

        {/* Center - Title */}
        <h1 className="text-lg font-semibold text-foreground truncate">
          {title}
        </h1>

        {/* Right side - Actions */}
        <div className="flex items-center gap-0.5 min-w-[80px] justify-end">
          <Link to="/search">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <FiSearch className="h-5 w-5" />
            </Button>
          </Link>

          <NotificationsDropdown />
          
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="h-10 w-10 relative">
              <FiShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-0.5 -right-0.5 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground text-[10px]">
                  {itemCount > 9 ? "9+" : itemCount}
                </Badge>
              )}
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="h-10 w-10"
          >
            {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
};
