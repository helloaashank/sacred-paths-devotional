import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FiBook, FiMusic, FiCalendar, FiSun, FiMoon, FiMenu } from "react-icons/fi";
import { GiMeditation } from "react-icons/gi";
import { useState } from "react";

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const Navbar = ({ darkMode, toggleDarkMode }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            <GiMeditation className="text-primary" />
            <span>SpiritualHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/books" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <FiBook />
              <span>Books</span>
            </Link>
            <Link to="/bhajans" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <FiMusic />
              <span>Bhajans</span>
            </Link>
            <Link to="/panchang" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <FiCalendar />
              <span>Panchang</span>
            </Link>
            <Link to="/vidhis" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <GiMeditation className="text-lg" />
              <span>Pooja Vidhis</span>
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-full"
            >
              {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <FiMenu className="h-5 w-5" />
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
                <span>Books</span>
              </Link>
              <Link
                to="/bhajans"
                className="flex items-center gap-2 px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiMusic />
                <span>Bhajans</span>
              </Link>
              <Link
                to="/panchang"
                className="flex items-center gap-2 px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiCalendar />
                <span>Panchang</span>
              </Link>
              <Link
                to="/vidhis"
                className="flex items-center gap-2 px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <GiMeditation className="text-lg" />
                <span>Pooja Vidhis</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};