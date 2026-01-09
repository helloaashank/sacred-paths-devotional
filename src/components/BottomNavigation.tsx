import { NavLink } from "react-router-dom";
import { FiHome, FiBook, FiMusic, FiCalendar, FiUser } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { path: "/", icon: FiHome, label: "Home" },
  { path: "/books", icon: FiBook, label: "Books" },
  { path: "/bhajans", icon: FiMusic, label: "Bhajans" },
  { path: "/panchang", icon: FiCalendar, label: "Panchang" },
];

export const BottomNavigation = () => {
  const { user } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground active:text-primary/70"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
        <NavLink
          to={user ? "/profile" : "/auth"}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors ${
              isActive
                ? "text-primary"
                : "text-muted-foreground active:text-primary/70"
            }`
          }
        >
          <FiUser className="h-5 w-5" />
          <span className="text-[10px] font-medium">{user ? "Profile" : "Login"}</span>
        </NavLink>
      </div>
    </nav>
  );
};
