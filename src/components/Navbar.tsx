import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FiBook, FiMusic, FiCalendar, FiSun, FiMoon, FiMenu, FiShoppingCart, FiYoutube, FiUser, FiLogOut } from "react-icons/fi";
import { GiMeditation } from "react-icons/gi";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SearchBar from "@/components/SearchBar";

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const Navbar = ({ darkMode, toggleDarkMode }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const { user, profile, signOut } = useAuth();

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

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

            {/* User Menu / Auth */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 sm:h-9 sm:w-9 p-0">
                    <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                      <AvatarImage src={profile?.avatar_url || undefined} />
                      <AvatarFallback className="text-xs bg-gradient-hero text-primary-foreground">
                        {getInitials(profile?.display_name || user.email)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-card border-border z-50">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium text-foreground truncate">
                      {profile?.display_name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                      <FiUser className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="flex items-center gap-2 text-destructive cursor-pointer">
                    <FiLogOut className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button size="sm" className="bg-gradient-hero text-xs sm:text-sm px-3 sm:px-4">
                  Sign In
                </Button>
              </Link>
            )}

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
              {user && (
                <>
                  <div className="border-t border-border my-2" />
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FiUser />
                    <span>Profile</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
