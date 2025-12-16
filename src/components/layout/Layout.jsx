import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

// Helper function to safely check window width (SSR-safe)
const getInitialMobileState = () => {
  if (typeof window === 'undefined') return true; // Default to mobile for SSR
  return window.innerWidth < 1024;
};

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  // Initialize with actual value immediately (mobile-first fallback)
  const [isMobile, setIsMobile] = useState(getInitialMobileState);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Run immediately to ensure correct state
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Add fullpage-mode class to html element on home page (only on desktop)
  useEffect(() => {
    if (isHomePage && !isMobile) {
      document.documentElement.classList.add('fullpage-mode');
    } else {
      document.documentElement.classList.remove('fullpage-mode');
    }

    return () => {
      document.documentElement.classList.remove('fullpage-mode');
    };
  }, [isHomePage, isMobile]);

  // On mobile: no height/overflow restrictions. On desktop: fullpage mode
  const containerClass = isHomePage && !isMobile ? 'h-screen overflow-hidden' : '';
  const mainClass = isHomePage && !isMobile ? 'h-full pt-0' : '';

  return (
    <div className={`min-h-screen flex flex-col ${containerClass}`}>
      <Navbar />
      <main className={`flex-1 ${mainClass}`}>
        <Outlet />
      </main>
      {!isHomePage && <Footer />}
    </div>
  );
};

export default Layout;
