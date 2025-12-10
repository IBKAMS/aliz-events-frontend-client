import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { HiTicket, HiCheck, HiExternalLink } from 'react-icons/hi';

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
      description: 'Accès à la soirée gospel',
      benefits: [
        'Accès à la salle',
        'Place assise standard',
        'Ambiance familiale garantie'
      ],
      featured: false
    },
    {
      _id: 'premium',
      name: 'PLACE PREMIUM',
      price: 20000,
      description: 'Expérience privilégiée',
      benefits: [
        'Accès prioritaire',
        'Place assise premium',
        'Ambiance familiale garantie'
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
            Billetterie
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Réservez vos places
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Offrez à votre famille le plus beau des cadeaux avant l'heure
          </p>
        </motion.div>

        {/* Ticket Types Grid */}
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
                <p className="text-gray-600 mb-6">{ticket.description}</p>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {ticket.benefits?.map((benefit, idx) => (
                    <li key={idx} className="flex items-start">
                      <HiCheck className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{benefit}</span>
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
                  Acheter sur TIKERAMA.COM
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* TIKERAMA Banner with QR Code */}
        <motion.div
          className="bg-accent-500 rounded-2xl p-8 shadow-2xl"
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
                  className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 object-contain"
                />
              </a>
              <p className="text-center text-primary-900 font-bold mt-4 text-lg">
                Scannez pour acheter vos billets
              </p>
            </div>

            {/* Right - Text Content */}
            <div className="text-center lg:text-left flex-1">
              <h3 className="text-2xl md:text-3xl font-bold text-primary-900 mb-2">
                TICKETS DISPONIBLES SUR
              </h3>
              <a
                href={TIKERAMA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-3xl md:text-4xl font-display font-bold text-primary-900 hover:text-primary-700 transition-colors"
              >
                TIKERAMA.COM
                <HiExternalLink className="w-8 h-8 ml-2" />
              </a>
              <p className="text-primary-800 mt-4 text-lg">
                Scannez le QR code ou cliquez pour réserver vos places
              </p>

              {/* Infoline */}
              <div className="mt-4">
                <p className="text-primary-900 font-semibold">
                  INFOLINE: <a href="tel:+22507089732 75" className="hover:underline">+225 07 08 97 32 75</a>
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
                Acheter mes billets maintenant
              </motion.a>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default TicketsSection;
