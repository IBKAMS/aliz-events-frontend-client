import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiMenu,
  HiX,
  HiShoppingCart,
  HiGlobe,
  HiHeart
} from 'react-icons/hi';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { totalTickets } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSection, setCurrentSection] = useState('home');

  const navItems = [
    { key: 'home', path: '/', label: t('nav.home') },
    { key: 'artist', path: '/#artist', label: "L'Artiste" },
    { key: 'program', path: '/#program', label: t('nav.program') },
    { key: 'gallery', path: '/#gallery', label: t('nav.gallery') },
    { key: 'tickets', path: '/#tickets', label: t('nav.tickets') },
    { key: 'faq', path: '/#faq', label: t('nav.faq') },
    { key: 'contact', path: '/#contact', label: t('nav.contact') },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Listen for hash changes to update current section
  useEffect(() => {
    const updateCurrentSection = () => {
      const hash = window.location.hash.replace('#', '');
      setCurrentSection(hash || 'home');
    };

    updateCurrentSection();
    window.addEventListener('hashchange', updateCurrentSection);
    return () => window.removeEventListener('hashchange', updateCurrentSection);
  }, []);

  // All sections now have dark backgrounds, so navbar stays transparent with white text
  // Only switch to dark theme when scrolled
  const shouldUseDarkTheme = isScrolled;

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const handleNavClick = (path) => {
    setIsOpen(false);
    if (path.startsWith('/#')) {
      const sectionId = path.replace('/#', '');
      // Use global navigation function for fullpage navigation
      if (window.navigateToSection) {
        window.navigateToSection(sectionId);
        window.location.hash = sectionId;
      }
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        shouldUseDarkTheme
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className={`text-2xl font-display font-bold ${
              shouldUseDarkTheme ? 'text-primary-600' : 'text-white'
            }`}>
              ALIZ EVENTS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.path}
                onClick={(e) => {
                  if (item.path.startsWith('/#')) {
                    e.preventDefault();
                    handleNavClick(item.path);
                  }
                }}
                className={`text-sm font-medium transition-colors duration-200 hover:text-primary-500 ${
                  shouldUseDarkTheme ? 'text-gray-700' : 'text-white'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                shouldUseDarkTheme ? 'text-gray-700 hover:text-primary-600' : 'text-white hover:text-primary-300'
              }`}
            >
              <HiGlobe className="w-5 h-5" />
              <span>{i18n.language.toUpperCase()}</span>
            </button>

            {/* Donate Button */}
            <Link
              to="/#donation"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/#donation');
              }}
              className={`hidden md:flex items-center space-x-1 px-4 py-2 rounded-full font-medium transition-all ${
                shouldUseDarkTheme
                  ? 'bg-accent-500 text-white hover:bg-accent-600'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <HiHeart className="w-5 h-5" />
              <span>{t('nav.donate')}</span>
            </Link>

            {/* Cart */}
            <Link
              to="/checkout"
              className={`relative p-2 rounded-full transition-colors ${
                shouldUseDarkTheme
                  ? 'text-gray-700 hover:bg-gray-100'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <HiShoppingCart className="w-6 h-6" />
              {totalTickets > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {totalTickets}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                shouldUseDarkTheme
                  ? 'text-gray-700 hover:bg-gray-100'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              {isOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white shadow-xl"
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href={item.path}
                  onClick={(e) => {
                    if (item.path.startsWith('/#')) {
                      e.preventDefault();
                      handleNavClick(item.path);
                    }
                  }}
                  className="block px-4 py-3 text-gray-700 font-medium rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-4 border-t">
                <Link
                  to="/#donation"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('/#donation');
                  }}
                  className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-accent-500 text-white font-medium rounded-lg hover:bg-accent-600 transition-colors"
                >
                  <HiHeart className="w-5 h-5" />
                  <span>{t('nav.donate')}</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
