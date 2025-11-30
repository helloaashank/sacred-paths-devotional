import { Link } from "react-router-dom";
import { GiMeditation } from "react-icons/gi";
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube } from "react-icons/fi";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              <GiMeditation className="text-primary" />
              <span>SpiritualHub</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Your gateway to spiritual wisdom, devotional music, and ancient traditions.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <FiFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <FiTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <FiInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <FiYoutube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/books" className="text-muted-foreground hover:text-primary transition-colors">Books</Link></li>
              <li><Link to="/bhajans" className="text-muted-foreground hover:text-primary transition-colors">Bhajans</Link></li>
              <li><Link to="/panchang" className="text-muted-foreground hover:text-primary transition-colors">Panchang</Link></li>
              <li><Link to="/vidhis" className="text-muted-foreground hover:text-primary transition-colors">Pooja Vidhis</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold mb-4 text-foreground">Stay Connected</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to receive spiritual insights and updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 min-w-0 px-3 py-2 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="px-4 py-2 text-sm font-medium bg-gradient-hero text-primary-foreground rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© 2025 SpiritualHub. All rights reserved. Built with devotion.</p>
        </div>
      </div>
    </footer>
  );
};