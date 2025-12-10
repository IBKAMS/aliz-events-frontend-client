import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { HiCalendar, HiLocationMarker, HiTicket, HiSparkles } from 'react-icons/hi';
import { useEvent } from '../../context/EventContext';

const HeroSection = () => {
  const { t } = useTranslation();
  const { event, loading } = useEvent();
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Informations par défaut du concert Adorons Ensemble
  const defaultEvent = {
    name: 'Adorons Ensemble',
    tagline: 'Le rendez-vous familial de décembre à ne pas manquer !',
    description: 'Offrez à votre famille le plus beau des cadeaux avant l\'heure : un moment dans la présence de Dieu. La chantre CONSTANCE vous attend pour une soirée de grâce et de visitation.',
    startDate: '2025-12-20T18:00:00+00:00',
    venue: {
      name: 'Hôtel Belle Côte',
      city: 'Abidjan, Côte d\'Ivoire',
    },
    category: 'Concert Gospel',
    hashtags: ['#adoronsensemble', '#concertconstance', '#gospel', '#worship'],
    infoline: '07 08 97 32 75',
  };

  const currentEvent = event || defaultEvent;

  useEffect(() => {
    // Get the target date - prefer API event date, fallback to default
    // Always use default date if API date is in the past or invalid
    const getValidFutureDate = () => {
      const now = new Date().getTime();
      const defaultDate = new Date(defaultEvent.startDate).getTime();

      if (event?.startDate) {
        const apiDate = new Date(event.startDate).getTime();
        // Use API date only if it's valid and in the future
        if (!isNaN(apiDate) && apiDate > now) {
          return apiDate;
        }
      }

      // Use default date if it's in the future, otherwise calculate next event date
      if (defaultDate > now) {
        return defaultDate;
      }

      // If default date has passed, return default anyway (will show zeros)
      return defaultDate;
    };

    const targetDate = getValidFutureDate();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        // Event has passed, show zeros
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Initial update
    updateCountdown();

    // Set up interval for continuous updates
    const interval = setInterval(updateCountdown, 1000);

    // Cleanup on unmount or when date changes
    return () => clearInterval(interval);
  }, [event?.startDate]);

  const scrollToTickets = () => {
    // Use fullpage navigation
    if (window.navigateToSection) {
      window.navigateToSection('tickets');
      window.location.hash = 'tickets';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Default hero background if no event image
  const heroBackground = event?.coverImage || '/images/hero-bg.jpg';

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 lg:pt-28"
    >
      {/* Background with violet gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900"
      >
        {/* Optional background image overlay */}
        {event?.coverImage && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
            style={{
              backgroundImage: `url(${heroBackground})`,
            }}
          />
        )}
        {/* Subtle overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/30 via-transparent to-primary-950/50" />
      </div>

      {/* Animated particles/shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary-500/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * -500],
              opacity: [0.3, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Content - Two Column Layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">

          {/* Left Column - Photo de Constance avec bordure illuminée */}
          <motion.div
            className="order-2 lg:order-1 flex justify-center lg:justify-start"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              {/* Outer glow pulsing effect */}
              <div className="absolute -inset-3 bg-gradient-to-r from-accent-400 via-primary-400 to-accent-400 rounded-3xl blur-xl opacity-60 animate-hero-glow" />

              {/* Rotating rainbow border */}
              <div className="absolute -inset-2 rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-hero-gradient-conic animate-hero-spin" />
              </div>

              {/* Inner shimmer border */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-accent-300 via-white to-accent-300 rounded-3xl animate-hero-shimmer opacity-80" />

              {/* Image container with dark background */}
              <div className="relative bg-primary-900 rounded-2xl p-1 z-10">
                <img
                  src="/images/constance.png"
                  alt="Chantre Constance"
                  className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl h-auto object-contain drop-shadow-2xl rounded-2xl"
                />
              </div>

              {/* Animated sparkles around the image */}
              <motion.div
                className="absolute -top-6 -right-6 text-accent-400 z-20"
                animate={{
                  scale: [1, 1.4, 1],
                  rotate: [0, 180, 360],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              >
                <HiSparkles className="w-10 h-10 drop-shadow-lg" />
              </motion.div>
              <motion.div
                className="absolute -bottom-4 -left-6 text-primary-300 z-20"
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, -180, -360],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ repeat: Infinity, duration: 3, delay: 0.5, ease: "easeInOut" }}
              >
                <HiSparkles className="w-8 h-8 drop-shadow-lg" />
              </motion.div>
              <motion.div
                className="absolute top-1/4 -left-8 text-accent-300 z-20"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 90, 180],
                  opacity: [0.4, 0.9, 0.4]
                }}
                transition={{ repeat: Infinity, duration: 2, delay: 1, ease: "easeInOut" }}
              >
                <HiSparkles className="w-6 h-6 drop-shadow-lg" />
              </motion.div>
              <motion.div
                className="absolute top-1/3 -right-8 text-white z-20"
                animate={{
                  scale: [1, 1.5, 1],
                  rotate: [0, 270, 540],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ repeat: Infinity, duration: 3.5, delay: 0.8, ease: "easeInOut" }}
              >
                <HiSparkles className="w-7 h-7 drop-shadow-lg" />
              </motion.div>
              <motion.div
                className="absolute -bottom-6 right-1/4 text-accent-500 z-20"
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 120, 240],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{ repeat: Infinity, duration: 2.8, delay: 1.2, ease: "easeInOut" }}
              >
                <HiSparkles className="w-8 h-8 drop-shadow-lg" />
              </motion.div>

              {/* Name badge */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-accent-500 text-primary-900 px-6 py-2 rounded-full font-bold text-lg shadow-lg z-20">
                Chantre CONSTANCE
              </div>
            </div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            className="order-1 lg:order-2 text-center lg:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Event Type Badge - Moved to top for better visibility */}
            <div className="text-center lg:text-left mb-4">
              <span className="inline-block px-6 py-3 bg-accent-500 text-primary-900 rounded-full text-lg font-bold shadow-lg">
                {currentEvent.category}
              </span>
            </div>

            {/* Event Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4">
              {currentEvent.name?.fr || currentEvent.name}
            </h1>

            {/* Tagline */}
            {currentEvent.tagline && (
              <p className="text-lg md:text-xl text-accent-400 font-semibold mb-4">
                {currentEvent.tagline}
              </p>
            )}

            {/* Event Description */}
            <p className="text-base md:text-lg text-gray-300 mb-6">
              {currentEvent.description?.fr || currentEvent.description}
            </p>

            {/* Event Info */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6">
              {currentEvent.startDate && (
                <div className="flex items-center space-x-2 text-white/80">
                  <HiCalendar className="w-5 h-5 text-accent-400" />
                  <span>{formatDate(currentEvent.startDate)}</span>
                </div>
              )}
              {currentEvent.venue?.name && (
                <div className="flex items-center space-x-2 text-white/80">
                  <HiLocationMarker className="w-5 h-5 text-accent-400" />
                  <span>{currentEvent.venue.name}, {currentEvent.venue.city}</span>
                </div>
              )}
            </div>

            {/* Infoline & Email */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6">
              {currentEvent.infoline && (
                <a
                  href={`tel:${currentEvent.infoline.replace(/\s/g, '')}`}
                  className="inline-flex items-center px-6 py-3 bg-accent-500 rounded-full hover:bg-accent-400 transition-colors shadow-lg"
                >
                  <span className="mr-2">📞</span>
                  <span className="text-accent-900 font-semibold">Infoline:</span>
                  <span className="ml-2 text-gray-900 font-bold">{currentEvent.infoline}</span>
                </a>
              )}
              <a
                href="mailto:infos@constanceaman.com"
                className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors border border-white/20"
              >
                <span className="mr-2">✉️</span>
                <span className="text-white font-medium">infos@constanceaman.com</span>
              </a>
            </div>

            {/* Countdown */}
            <div className="grid grid-cols-4 gap-3 max-w-md mx-auto lg:mx-0 mb-6">
              {[
                { value: countdown.days, label: t('countdown.days') },
                { value: countdown.hours, label: t('countdown.hours') },
                { value: countdown.minutes, label: t('countdown.minutes') },
                { value: countdown.seconds, label: t('countdown.seconds') },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-3"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="text-2xl md:text-3xl font-bold text-white">
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">
                    {item.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-6">
              <motion.button
                onClick={scrollToTickets}
                className="inline-flex items-center px-8 py-4 bg-accent-500 text-primary-900 font-bold rounded-full hover:bg-accent-400 transition-all shadow-lg hover:shadow-accent-500/25"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    '0 0 0 0 rgba(255, 199, 0, 0.7)',
                    '0 0 0 10px rgba(255, 199, 0, 0)',
                    '0 0 0 0 rgba(255, 199, 0, 0)'
                  ]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <HiTicket className="w-5 h-5 mr-2" />
                Réserver mes places
              </motion.button>
              <motion.button
                onClick={() => {
                  if (window.navigateToSection) {
                    window.navigateToSection('program');
                    window.location.hash = 'program';
                  }
                }}
                className="inline-flex items-center px-8 py-4 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('hero.seeProgram')}
              </motion.button>
            </div>

          </motion.div>
        </div>
      </div>

      {/* CSS Animations for illuminated border */}
      <style jsx>{`
        @keyframes hero-glow {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.03);
          }
        }

        @keyframes hero-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes hero-shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        .animate-hero-glow {
          animation: hero-glow 3s ease-in-out infinite;
        }

        .animate-hero-spin {
          animation: hero-spin 10s linear infinite;
        }

        .animate-hero-shimmer {
          background-size: 200% auto;
          animation: hero-shimmer 2.5s linear infinite;
        }

        .bg-hero-gradient-conic {
          background: conic-gradient(
            from 0deg,
            #ffc700,
            #ff6b35,
            #a855f7,
            #3b82f6,
            #22c55e,
            #ffc700
          );
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
