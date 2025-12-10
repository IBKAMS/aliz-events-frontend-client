import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChevronLeft, HiChevronRight, HiStar } from 'react-icons/hi';
import { FaQuoteLeft } from 'react-icons/fa';
import { useEvent } from '../../context/EventContext';

const TestimonialsSection = () => {
  const { t } = useTranslation();
  const { content } = useEvent();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // Get testimonials from CMS content
  const testimonials = content?.testimonials || [];

  useEffect(() => {
    if (!autoPlay || testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay, testimonials.length]);

  const navigate = (direction) => {
    setAutoPlay(false);
    setCurrentIndex((prev) => {
      let newIndex = prev + direction;
      if (newIndex < 0) newIndex = testimonials.length - 1;
      if (newIndex >= testimonials.length) newIndex = 0;
      return newIndex;
    });
  };

  const goToSlide = (index) => {
    setAutoPlay(false);
    setCurrentIndex(index);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <HiStar
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-2 bg-accent-500/20 text-accent-400 rounded-full text-sm font-medium mb-4">
            {t('testimonials.subtitle')}
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            {t('testimonials.title')}
          </h2>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            {t('testimonials.description')}
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Main Testimonial */}
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className="relative bg-gradient-to-br from-primary-50 to-secondary-50 rounded-3xl p-8 md:p-12"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
              >
                {/* Quote Icon */}
                <div className="absolute top-8 left-8 text-primary-200">
                  <FaQuoteLeft className="w-12 h-12" />
                </div>

                <div className="relative z-10 pt-8">
                  {/* Rating */}
                  {testimonials[currentIndex]?.rating && (
                    <div className="flex justify-center mb-6">
                      {renderStars(testimonials[currentIndex].rating)}
                    </div>
                  )}

                  {/* Quote */}
                  <blockquote className="text-xl md:text-2xl text-gray-700 text-center mb-8 leading-relaxed">
                    "{testimonials[currentIndex]?.quote || testimonials[currentIndex]?.text}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex flex-col items-center">
                    {testimonials[currentIndex]?.avatar && (
                      <img
                        src={testimonials[currentIndex].avatar}
                        alt={testimonials[currentIndex].name}
                        className="w-16 h-16 rounded-full object-cover mb-4 border-4 border-white shadow-lg"
                      />
                    )}
                    <div className="text-center">
                      <h4 className="font-bold text-gray-900">
                        {testimonials[currentIndex]?.name}
                      </h4>
                      {testimonials[currentIndex]?.role && (
                        <p className="text-gray-500 text-sm">
                          {testimonials[currentIndex].role}
                        </p>
                      )}
                      {testimonials[currentIndex]?.event && (
                        <p className="text-primary-600 text-sm font-medium mt-1">
                          {testimonials[currentIndex].event}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          {testimonials.length > 1 && (
            <>
              <button
                onClick={() => navigate(-1)}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <HiChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
              <button
                onClick={() => navigate(1)}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <HiChevronRight className="w-6 h-6 text-gray-600" />
              </button>
            </>
          )}

          {/* Dots */}
          {testimonials.length > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-primary-600 w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Testimonial Cards Preview */}
        {testimonials.length > 3 && (
          <div className="hidden lg:grid grid-cols-3 gap-6 mt-16">
            {testimonials
              .filter((_, i) => i !== currentIndex)
              .slice(0, 3)
              .map((testimonial, index) => (
                <motion.div
                  key={testimonial._id || index}
                  className="bg-gray-50 rounded-xl p-6 cursor-pointer hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  onClick={() => goToSlide(testimonials.indexOf(testimonial))}
                >
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    "{testimonial.quote || testimonial.text}"
                  </p>
                  <div className="flex items-center">
                    {testimonial.avatar && (
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {testimonial.name}
                      </p>
                      {testimonial.role && (
                        <p className="text-gray-500 text-xs">{testimonial.role}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
