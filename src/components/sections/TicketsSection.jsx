import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { HiTicket, HiCheck, HiExternalLink, HiPhone } from 'react-icons/hi';

const TicketsSection = () => {
  const { t } = useTranslation();

  // URL TIKERAMA pour l'achat des billets (même que le QR Code)
  const TIKERAMA_URL = 'https://tikerama.com/fr/evenements/constance-en-concert-live';

  // Tarifs fixes pour le concert Adorons Ensemble
  const ticketTypes = [
    {
      _id: 'standard',
      name: 'STANDARD',
      price: 10000,
      descriptionKey: 'tickets.accessToEvent',
      benefitKeys: [
        'tickets.hallAccess',
        'tickets.standardSeat',
        'tickets.familyAmbiance'
      ],
      featured: false
    },
    {
      _id: 'vip',
      name: 'PLACE VIP',
      price: 20000,
      descriptionKey: 'tickets.privilegedExperience',
      benefitKeys: [
        'tickets.priorityAccess',
        'tickets.vipSeat',
        'tickets.familyAmbiance'
      ],
      featured: false
    }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' F';
  };

  const handleBuyTicket = () => {
    window.open(TIKERAMA_URL, '_blank');
  };

  return (
    <section id="tickets" className="py-20 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-2 bg-white/10 text-white rounded-full text-sm font-medium mb-4">
            {t('tickets.title')}
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            {t('tickets.subtitle')}
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            {t('tickets.description')}
          </p>
        </motion.div>

        {/* Wave/Orange Money Payment Section - EN PREMIER */}
        <motion.div
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 rounded-2xl p-6 md:p-8 shadow-xl mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left - Payment Info */}
            <div className="text-center md:text-left">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                {t('tickets.mobilePayment.title')}
              </h3>
              <p className="text-white/90 text-lg mb-4">
                {t('tickets.mobilePayment.description')}
              </p>

              {/* Ticket Prices */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="bg-white/20 rounded-xl px-4 py-3">
                  <p className="text-white font-semibold">{t('tickets.mobilePayment.vipTicket')}</p>
                  <p className="text-2xl font-bold text-white">20 000 F</p>
                </div>
                <div className="bg-white/20 rounded-xl px-4 py-3">
                  <p className="text-white font-semibold">{t('tickets.mobilePayment.standardTicket')}</p>
                  <p className="text-2xl font-bold text-white">10 000 F</p>
                </div>
              </div>
            </div>

            {/* Right - Phone Number */}
            <div className="text-center">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <p className="text-gray-600 font-medium mb-2">{t('tickets.mobilePayment.sendPaymentTo')}</p>
                <a
                  href="tel:+2250708973275"
                  className="flex items-center justify-center text-2xl md:text-3xl font-bold text-purple-600 hover:text-purple-700 transition-colors"
                >
                  <HiPhone className="w-8 h-8 mr-2" />
                  07 08 97 32 75
                </a>
                {/* Wave & Orange Money logos */}
                <div className="flex items-center justify-center gap-4 mt-4">
                  <span className="px-3 py-1 bg-blue-500 text-white font-bold rounded-lg text-sm">WAVE</span>
                  <span className="px-3 py-1 bg-orange-500 text-white font-bold rounded-lg text-sm">ORANGE MONEY</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Ticket Types Grid - TIKERAMA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {ticketTypes.map((ticket, index) => (
            <motion.div
              key={ticket._id}
              className={`relative bg-white rounded-2xl overflow-hidden shadow-xl ${
                ticket.featured ? 'ring-4 ring-accent-500 transform md:scale-105' : ''
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Featured Badge */}
              {ticket.featured && (
                <div className="absolute top-0 right-0 bg-accent-500 text-primary-900 px-4 py-1 text-sm font-bold rounded-bl-xl">
                  POPULAIRE
                </div>
              )}

              {/* Ticket Header */}
              <div className={`p-6 ${ticket.featured ? 'bg-gradient-to-r from-primary-600 to-primary-700' : 'bg-gray-100'}`}>
                <h3 className={`text-xl font-bold mb-2 ${ticket.featured ? 'text-white' : 'text-gray-900'}`}>
                  {ticket.name}
                </h3>
                <div className={`text-4xl font-display font-bold ${ticket.featured ? 'text-accent-400' : 'text-primary-600'}`}>
                  {formatPrice(ticket.price)}
                </div>
              </div>

              {/* Ticket Body */}
              <div className="p-6">
                {/* Description */}
                <p className="text-gray-600 mb-6">{t(ticket.descriptionKey)}</p>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {ticket.benefitKeys?.map((benefitKey, idx) => (
                    <li key={idx} className="flex items-start">
                      <HiCheck className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{t(benefitKey)}</span>
                    </li>
                  ))}
                </ul>

                {/* Buy Button */}
                <button
                  onClick={handleBuyTicket}
                  className={`w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center transition-all ${
                    ticket.featured
                      ? 'bg-accent-500 text-primary-900 hover:bg-accent-400'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  <HiTicket className="w-5 h-5 mr-2" />
                  {t('tickets.buyOnTikerama')}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* TIKERAMA Banner with QR Code */}
        <motion.div
          className="bg-accent-500 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
            {/* Left - QR Code en GRAND */}
            <div className="flex-shrink-0">
              <a
                href={TIKERAMA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <img
                  src="/images/qr-code-constance.png"
                  alt="QR Code - Réserver sur TIKERAMA.COM"
                  className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 object-contain"
                />
              </a>
              <p className="text-center text-primary-900 font-bold mt-4 text-lg">
                {t('tickets.scanToBuy')}
              </p>
            </div>

            {/* Right - Text Content */}
            <div className="text-center lg:text-left flex-1">
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-primary-900 mb-2">
                {t('tickets.ticketsAvailableOn')}
              </h3>
              <a
                href={TIKERAMA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold text-primary-900 hover:text-primary-700 transition-colors break-words"
              >
                TIKERAMA.COM
                <HiExternalLink className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 ml-2 flex-shrink-0" />
              </a>
              <p className="text-primary-800 mt-4 text-lg">
                {t('tickets.scanOrClick')}
              </p>

              {/* Infoline */}
              <div className="mt-4">
                <p className="text-primary-900 font-semibold">
                  {t('tickets.infoline')}: <a href="tel:+22507089732 75" className="hover:underline">+225 07 08 97 32 75</a>
                </p>
              </div>

              {/* Bouton CTA */}
              <motion.a
                href={TIKERAMA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-6 px-8 py-4 bg-primary-900 text-white font-bold rounded-full hover:bg-primary-800 transition-all shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <HiTicket className="w-6 h-6 mr-2" />
                {t('tickets.buyNow')}
              </motion.a>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default TicketsSection;
