import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChevronDown, HiQuestionMarkCircle } from 'react-icons/hi';
import { useEvent } from '../../context/EventContext';

const FAQSection = () => {
  const { t } = useTranslation();
  const { content } = useEvent();
  const [openIndex, setOpenIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  // Get FAQs from CMS content or use defaults
  const faqs = content?.faq || [
    {
      category: 'tickets',
      question: t('faq.items.tickets.q1'),
      answer: t('faq.items.tickets.a1'),
    },
    {
      category: 'tickets',
      question: t('faq.items.tickets.q2'),
      answer: t('faq.items.tickets.a2'),
    },
    {
      category: 'event',
      question: t('faq.items.event.q1'),
      answer: t('faq.items.event.a1'),
    },
    {
      category: 'event',
      question: t('faq.items.event.q2'),
      answer: t('faq.items.event.a2'),
    },
    {
      category: 'payment',
      question: t('faq.items.payment.q1'),
      answer: t('faq.items.payment.a1'),
    },
    {
      category: 'payment',
      question: t('faq.items.payment.q2'),
      answer: t('faq.items.payment.a2'),
    },
  ];

  const categories = [
    { id: 'all', label: t('faq.categories.all') },
    { id: 'tickets', label: t('faq.categories.tickets') },
    { id: 'event', label: t('faq.categories.event') },
    { id: 'payment', label: t('faq.categories.payment') },
  ];

  const filteredFaqs =
    activeCategory === 'all'
      ? faqs
      : faqs.filter((faq) => faq.category === activeCategory);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-2 bg-primary-600/20 text-primary-300 rounded-full text-sm font-medium mb-4">
            {t('faq.subtitle')}
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            {t('faq.title')}
          </h2>
          <p className="text-lg text-gray-300">
            {t('faq.description')}
          </p>
        </motion.div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 px-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-3 sm:px-4 py-2.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all min-h-[40px] ${
                activeCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 active:bg-white/30'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => (
            <motion.div
              key={faq._id || index}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-left hover:bg-gray-50 active:bg-gray-100 transition-colors min-h-[56px]"
              >
                <div className="flex items-start">
                  <HiQuestionMarkCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" />
                  <span className="font-medium text-gray-900 pr-2 sm:pr-4 text-sm sm:text-base">
                    {faq.question}
                  </span>
                </div>
                <HiChevronDown
                  className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-4 sm:px-6 pb-4 sm:pb-5">
                      <div className="pl-7 sm:pl-9 text-gray-600 leading-relaxed text-sm sm:text-base">
                        {faq.answer}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <HiQuestionMarkCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">{t('faq.noQuestions')}</p>
          </div>
        )}

        {/* Contact CTA */}
        <motion.div
          className="mt-12 text-center p-8 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {t('faq.stillHaveQuestions')}
          </h3>
          <p className="text-gray-600 mb-4">
            {t('faq.contactUs')}
          </p>
          <a
            href="#contact"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-full hover:bg-primary-700 transition-colors"
          >
            {t('faq.contactButton')}
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
