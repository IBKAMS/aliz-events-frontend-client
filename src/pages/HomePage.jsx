import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeroSection,
  ArtistSection,
  ProgramSection,
  TicketsSection,
  DonationSection,
  GallerySection,
  TestimonialsSection,
  FAQSection,
  ContactSection,
  LocationSection,
} from '../components/sections';

// Define sections with their IDs and components
const sections = [
  { id: 'home', Component: HeroSection },
  { id: 'artist', Component: ArtistSection },
  { id: 'program', Component: ProgramSection },
  { id: 'tickets', Component: TicketsSection },
  { id: 'donation', Component: DonationSection },
  { id: 'gallery', Component: GallerySection },
  { id: 'testimonials', Component: TestimonialsSection },
  { id: 'faq', Component: FAQSection },
  { id: 'contact', Component: ContactSection },
  { id: 'location', Component: LocationSection },
];

const HomePage = () => {
  const [activeSection, setActiveSection] = useState(0);

  // Navigate to a specific section by ID
  const navigateToSection = useCallback((sectionId) => {
    const index = sections.findIndex(s => s.id === sectionId);
    if (index !== -1) {
      setActiveSection(index);
    }
  }, []);

  // Expose navigation function globally for Navbar
  useEffect(() => {
    window.navigateToSection = navigateToSection;
    return () => {
      delete window.navigateToSection;
    };
  }, [navigateToSection]);

  // Handle hash changes from URL
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        navigateToSection(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [navigateToSection]);

  // Get current section component
  const CurrentSection = sections[activeSection]?.Component;

  return (
    <div className="fullpage-container">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fullpage-section"
        >
          {CurrentSection && <CurrentSection />}
        </motion.div>
      </AnimatePresence>

      {/* Section indicators (dots) on the right side */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => {
              setActiveSection(index);
              window.location.hash = section.id;
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === activeSection
                ? 'bg-primary-600 scale-125'
                : 'bg-white/50 hover:bg-white/80 border border-gray-400'
            }`}
            title={section.id}
            aria-label={`Go to ${section.id} section`}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
