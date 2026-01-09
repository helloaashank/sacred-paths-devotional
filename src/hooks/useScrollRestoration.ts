import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useScrollRestoration = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
    
    // Also try to scroll the main content area if it exists
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.scrollTo(0, 0);
    }
  }, [pathname]);
};
