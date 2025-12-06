import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FiBook, FiMusic, FiCalendar, FiSun, FiMoon, FiMenu, FiShoppingCart, FiYoutube, FiSearch } from "react-icons/fi";
import { GiMeditation } from "react-icons/gi";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import SearchBar from "@/components/SearchBar";

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const Navbar = ({ darkMode, toggleDarkMode }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { language, setLanguage, t } = useLanguage();

  const languageLabels = {
    en: "English",
    hi: "हिंदी",
    hinglish: "Hinglish",
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border shadow-soft">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 sm:gap-2 text-lg sm:text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent flex-shrink-0">
            <GiMeditation className="text-primary h-5 w-5 sm:h-6 sm:w-6" />
            <span className="hidden xs:inline">SpiritualHub</span>
            <span className="xs:hidden">SH</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <SearchBar className="w-64 lg:w-80" />
            <Link to="/books" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <FiBook />
              <span>{t.nav.books}</span>
            </Link>
            <Link to="/bhajans" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <FiMusic />
              <span>{t.nav.bhajans}</span>
            </Link>
            <Link to="/panchang" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <FiCalendar />
              <span>{t.nav.panchang}</span>
            </Link>
            <Link to="/vidhis" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <GiMeditation className="text-lg" />
              <span>{t.nav.vidhis}</span>
            </Link>
            <Link to="/videos" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <FiYoutube className="text-red-500" />
              <span>{t.nav.videos}</span>
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Language - Hidden on very small screens */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden sm:flex text-xs sm:text-sm px-2 sm:px-3">
                  {languageLabels[language]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border-border z-50">
                <DropdownMenuItem onClick={() => setLanguage("en")}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("hinglish")}>
                  Hinglish
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("hi")}>
                  हिंदी
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative h-8 w-8 sm:h-9 sm:w-9">
                <FiShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground text-[10px] sm:text-xs">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-full h-8 w-8 sm:h-9 sm:w-9"
            >
              {darkMode ? <FiSun className="h-4 w-4 sm:h-5 sm:w-5" /> : <FiMoon className="h-4 w-4 sm:h-5 sm:w-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-8 w-8 sm:h-9 sm:w-9"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <FiMenu className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-3">
              <Link
                to="/books"
                className="flex items-center gap-2 px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiBook />
                <span>{t.nav.books}</span>
              </Link>
              <Link
                to="/bhajans"
                className="flex items-center gap-2 px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiMusic />
                <span>{t.nav.bhajans}</span>
              </Link>
              <Link
                to="/panchang"
                className="flex items-center gap-2 px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiCalendar />
                <span>{t.nav.panchang}</span>
              </Link>
              <Link
                to="/vidhis"
                className="flex items-center gap-2 px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <GiMeditation className="text-lg" />
                <span>{t.nav.vidhis}</span>
              </Link>
              <Link
                to="/videos"
                className="flex items-center gap-2 px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiYoutube className="text-red-500" />
                <span>{t.nav.videos}</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};