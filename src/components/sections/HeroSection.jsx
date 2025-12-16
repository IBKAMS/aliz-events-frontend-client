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
      className="relative flex items-start justify-center pt-16 sm:pt-20 lg:pt-28 pb-12 sm:pb-16 lg:pb-8 min-h-fit lg:min-h-screen"
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
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-center">

          {/* Left Column - Photo de Constance avec bordure illuminée AGRANDIE */}
          <motion.div
            className="order-1 lg:order-1 flex justify-center lg:justify-start overflow-hidden"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative mx-auto lg:mx-0">
              {/* Multiple outer glow layers for intense scintillating effect */}
              <div className="absolute -inset-6 bg-gradient-to-r from-accent-400 via-primary-400 to-accent-400 rounded-3xl blur-2xl opacity-70 animate-hero-glow" />
              <div className="absolute -inset-4 bg-gradient-to-r from-white via-accent-300 to-white rounded-3xl blur-xl opacity-50 animate-hero-shimmer" />

              {/* Sparkle particles around frame - iOS compatible with CSS animations */}
              <div className="absolute -inset-8 pointer-events-none overflow-visible">
                <div className="sparkle sparkle-1" />
                <div className="sparkle sparkle-2" />
                <div className="sparkle sparkle-3" />
                <div className="sparkle sparkle-4" />
                <div className="sparkle sparkle-5" />
                <div className="sparkle sparkle-6" />
                <div className="sparkle sparkle-7" />
                <div className="sparkle sparkle-8" />
              </div>

              {/* Rotating rainbow border - more intense */}
              <div className="absolute -inset-3 rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-hero-gradient-conic animate-hero-spin" />
              </div>

              {/* Inner shimmer border - brighter */}
              <div className="absolute -inset-2 bg-gradient-to-r from-accent-300 via-white to-accent-300 rounded-3xl animate-hero-shimmer opacity-90" />

              {/* Image container with dark background - AGRANDIE */}
              <div className="relative bg-primary-900 rounded-2xl p-1.5 z-10">
                <img
                  src="/images/constance.png"
                  alt="Chantre Constance"
                  className="relative w-full max-w-[220px] xs:max-w-[280px] sm:max-w-[350px] md:max-w-md lg:max-w-lg xl:max-w-xl h-auto object-contain drop-shadow-2xl rounded-2xl"
                />
              </div>

              {/* Animated sparkles around the image - hidden on very small screens */}
              <motion.div
                className="absolute -top-3 -right-3 sm:-top-6 sm:-right-6 text-accent-400 z-20 hidden xs:block"
                animate={{
                  scale: [1, 1.4, 1],
                  rotate: [0, 180, 360],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              >
                <HiSparkles className="w-6 h-6 sm:w-10 sm:h-10 drop-shadow-lg" />
              </motion.div>
              <motion.div
                className="absolute -bottom-2 -left-3 sm:-bottom-4 sm:-left-6 text-primary-300 z-20 hidden xs:block"
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, -180, -360],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ repeat: Infinity, duration: 3, delay: 0.5, ease: "easeInOut" }}
              >
                <HiSparkles className="w-5 h-5 sm:w-8 sm:h-8 drop-shadow-lg" />
              </motion.div>
              <motion.div
                className="absolute top-1/4 -left-4 sm:-left-8 text-accent-300 z-20 hidden sm:block"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 90, 180],
                  opacity: [0.4, 0.9, 0.4]
                }}
                transition={{ repeat: Infinity, duration: 2, delay: 1, ease: "easeInOut" }}
              >
                <HiSparkles className="w-4 h-4 sm:w-6 sm:h-6 drop-shadow-lg" />
              </motion.div>
              <motion.div
                className="absolute top-1/3 -right-4 sm:-right-8 text-white z-20 hidden sm:block"
                animate={{
                  scale: [1, 1.5, 1],
                  rotate: [0, 270, 540],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ repeat: Infinity, duration: 3.5, delay: 0.8, ease: "easeInOut" }}
              >
                <HiSparkles className="w-5 h-5 sm:w-7 sm:h-7 drop-shadow-lg" />
              </motion.div>
              <motion.div
                className="absolute -bottom-3 right-1/4 sm:-bottom-6 text-accent-500 z-20 hidden xs:block"
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 120, 240],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{ repeat: Infinity, duration: 2.8, delay: 1.2, ease: "easeInOut" }}
              >
                <HiSparkles className="w-5 h-5 sm:w-8 sm:h-8 drop-shadow-lg" />
              </motion.div>

              {/* Name badge - AGRANDI */}
              <div className="absolute bottom-3 sm:bottom-6 left-1/2 transform -translate-x-1/2 bg-accent-500 text-primary-900 px-5 sm:px-8 py-2 sm:py-3 rounded-full font-bold text-base sm:text-xl shadow-xl z-20 whitespace-nowrap border-2 border-accent-300">
                Chantre CONSTANCE
              </div>
            </div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            className="order-2 lg:order-2 text-center lg:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Event Type Badge - AGRANDI */}
            <div className="text-center lg:text-left mb-4 sm:mb-5">
              <span className="inline-block px-5 sm:px-8 py-2.5 sm:py-4 bg-accent-500 text-primary-900 rounded-full text-base sm:text-xl md:text-2xl font-black shadow-xl border-2 border-accent-300">
                {currentEvent.category}
              </span>
            </div>

            {/* Event Title - AGRANDI */}
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black text-white mb-3 sm:mb-5 break-words drop-shadow-lg">
              {currentEvent.name?.fr || currentEvent.name}
            </h1>

            {/* Countdown - AGRANDI pour meilleure visibilité */}
            <div className="mb-4 sm:mb-6">
              <p className="text-accent-400 text-sm sm:text-base md:text-lg font-bold mb-2 sm:mb-3 text-center lg:text-left">
                ⏰ Compte à rebours
              </p>
              <div className="grid grid-cols-4 gap-2 xs:gap-2.5 sm:gap-3 max-w-[300px] xs:max-w-[340px] sm:max-w-md mx-auto lg:mx-0">
                {[
                  { value: countdown.days, label: t('countdown.days') },
                  { value: countdown.hours, label: t('countdown.hours') },
                  { value: countdown.minutes, label: t('countdown.minutes') },
                  { value: countdown.seconds, label: t('countdown.seconds') },
                ].map((item, index) => (
                  <motion.div
                    key={`top-${index}`}
                    className="bg-white/20 backdrop-blur-md rounded-xl p-2 xs:p-3 sm:p-4 border-2 border-accent-500/50 shadow-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-accent-400 drop-shadow-lg">
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <div className="text-[9px] xs:text-[10px] sm:text-sm text-white/90 uppercase tracking-wider font-semibold truncate">
                      {item.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Infoline - AGRANDI pour meilleure visibilité */}
            {currentEvent.infoline && (
              <a
                href={`tel:${currentEvent.infoline.replace(/\s/g, '')}`}
                className="flex flex-col xs:flex-row items-center justify-center px-6 sm:px-8 py-4 sm:py-5 bg-accent-500 rounded-2xl xs:rounded-full hover:bg-accent-400 active:bg-accent-600 transition-all shadow-xl min-h-[70px] xs:min-h-[60px] w-full sm:w-auto max-w-lg mx-auto lg:mx-0 mb-4 sm:mb-6 border-2 border-accent-300 hover:scale-105"
              >
                <div className="flex items-center mb-1 xs:mb-0">
                  <span className="mr-2 text-2xl sm:text-3xl">📞</span>
                  <span className="text-primary-900 font-bold text-lg sm:text-xl">Infoline :</span>
                </div>
                <span className="xs:ml-3 text-primary-900 font-black text-xl sm:text-2xl md:text-3xl">{currentEvent.infoline}</span>
              </a>
            )}

            {/* Tagline - AGRANDI */}
            {currentEvent.tagline && (
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-accent-400 font-bold mb-3 sm:mb-5">
                {currentEvent.tagline}
              </p>
            )}

            {/* Event Description - AGRANDI */}
            <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-4 sm:mb-6 line-clamp-3 sm:line-clamp-none leading-relaxed">
              {currentEvent.description?.fr || currentEvent.description}
            </p>

            {/* Event Info - AGRANDI */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-6 mb-4 sm:mb-6 text-sm sm:text-base md:text-lg">
              {currentEvent.startDate && (
                <div className="flex items-center space-x-2 text-white/90 bg-white/10 px-4 py-2 rounded-full">
                  <HiCalendar className="w-6 h-6 text-accent-400" />
                  <span className="font-semibold">{formatDate(currentEvent.startDate)}</span>
                </div>
              )}
              {currentEvent.venue?.name && (
                <div className="flex items-center space-x-2 text-white/90 bg-white/10 px-4 py-2 rounded-full">
                  <HiLocationMarker className="w-6 h-6 text-accent-400" />
                  <span className="font-semibold">{currentEvent.venue.name}, {currentEvent.venue.city}</span>
                </div>
              )}
            </div>

            {/* Email Contact - AGRANDI */}
            <a
              href="mailto:infos@constanceaman.com"
              className="flex flex-col xs:flex-row items-center justify-center px-6 sm:px-8 py-4 bg-white/15 backdrop-blur-sm rounded-2xl xs:rounded-full hover:bg-white/25 active:bg-white/35 transition-all border-2 border-white/30 min-h-[65px] xs:min-h-[55px] w-full sm:w-auto max-w-lg mx-auto lg:mx-0 mb-4 sm:mb-6 hover:scale-105"
            >
              <div className="flex items-center mb-1 xs:mb-0">
                <span className="mr-2 text-2xl">✉️</span>
                <span className="text-white font-bold text-lg">Email :</span>
              </div>
              <span className="xs:ml-3 text-white font-semibold text-base sm:text-lg">infos@constanceaman.com</span>
            </a>

            {/* CTA Buttons - AGRANDIS */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-4 sm:gap-5 mb-6 w-full sm:w-auto">
              <motion.button
                onClick={scrollToTickets}
                className="inline-flex items-center justify-center px-6 sm:px-10 py-4 sm:py-5 bg-accent-500 text-primary-900 font-black rounded-full hover:bg-accent-400 transition-all shadow-xl hover:shadow-accent-500/40 text-base sm:text-lg md:text-xl border-2 border-accent-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    '0 0 0 0 rgba(255, 199, 0, 0.7)',
                    '0 0 0 15px rgba(255, 199, 0, 0)',
                    '0 0 0 0 rgba(255, 199, 0, 0)'
                  ]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <HiTicket className="w-6 h-6 sm:w-7 sm:h-7 mr-2" />
                Réserver mes places
              </motion.button>
              <motion.button
                onClick={() => {
                  if (window.navigateToSection) {
                    window.navigateToSection('program');
                    window.location.hash = 'program';
                  }
                }}
                className="inline-flex items-center justify-center px-6 sm:px-10 py-4 sm:py-5 bg-white/15 text-white font-bold rounded-full hover:bg-white/25 transition-all backdrop-blur-sm border-2 border-white/30 text-base sm:text-lg"
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

        /* Sparkle particles - iOS compatible CSS animations */
        @keyframes sparkle-pulse {
          0%, 100% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
          }
        }

        .sparkle {
          position: absolute;
          width: 8px;
          height: 8px;
          background: radial-gradient(circle, #ffc700 0%, #ffffff 50%, transparent 70%);
          border-radius: 50%;
          animation: sparkle-pulse 2s ease-in-out infinite;
          box-shadow: 0 0 10px 2px rgba(255, 199, 0, 0.8), 0 0 20px 4px rgba(255, 199, 0, 0.4);
        }

        .sparkle-1 {
          top: 0;
          left: 20%;
          animation-delay: 0s;
        }

        .sparkle-2 {
          top: 15%;
          right: 0;
          animation-delay: 0.25s;
        }

        .sparkle-3 {
          top: 50%;
          right: -5%;
          animation-delay: 0.5s;
        }

        .sparkle-4 {
          bottom: 15%;
          right: 10%;
          animation-delay: 0.75s;
        }

        .sparkle-5 {
          bottom: 0;
          left: 50%;
          animation-delay: 1s;
        }

        .sparkle-6 {
          bottom: 20%;
          left: 0;
          animation-delay: 1.25s;
        }

        .sparkle-7 {
          top: 40%;
          left: -5%;
          animation-delay: 1.5s;
        }

        .sparkle-8 {
          top: 5%;
          left: 60%;
          animation-delay: 1.75s;
        }

        /* Responsive sparkle sizes */
        @media (min-width: 640px) {
          .sparkle {
            width: 12px;
            height: 12px;
            box-shadow: 0 0 15px 3px rgba(255, 199, 0, 0.8), 0 0 30px 6px rgba(255, 199, 0, 0.4);
          }
        }

        @media (min-width: 1024px) {
          .sparkle {
            width: 16px;
            height: 16px;
            box-shadow: 0 0 20px 4px rgba(255, 199, 0, 0.8), 0 0 40px 8px rgba(255, 199, 0, 0.4);
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
