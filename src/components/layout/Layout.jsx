import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Add fullpage-mode class to html element on home page
  useEffect(() => {
    if (isHomePage) {
      document.documentElement.classList.add('fullpage-mode');
    } else {
      document.documentElement.classList.remove('fullpage-mode');
    }

    return () => {
      document.documentElement.classList.remove('fullpage-mode');
    };
  }, [isHomePage]);

  return (
    <div className={`min-h-screen flex flex-col ${isHomePage ? 'h-screen overflow-hidden' : ''}`}>
      <Navbar />
      <main className={`flex-1 ${isHomePage ? 'h-full pt-0' : ''}`}>
        <Outlet />
      </main>
      {!isHomePage && <Footer />}
    </div>
  );
};

export default Layout;
