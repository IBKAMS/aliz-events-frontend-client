import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { HiLocationMarker, HiClock, HiTruck, HiMap } from 'react-icons/hi';
import { FaCar, FaBus, FaPlane } from 'react-icons/fa';
import { useEvent } from '../../context/EventContext';

const LocationSection = () => {
  const { t } = useTranslation();
  const { event, content } = useEvent();

  // Get venue info from event or content
  const venue = event?.venue || content?.venue || {
    name: 'Hotel Belle Cote',
    address: 'Cocody',
    city: 'Abidjan',
    country: 'Cote d\'Ivoire',
    coordinates: {
      lat: 5.3550,
      lng: -3.9900,
    },
  };

  const accessInfo = content?.access || [
    {
      icon: FaCar,
      title: t('location.access.car'),
      description: t('location.access.carDesc'),
    },
    {
      icon: FaBus,
      title: t('location.access.public'),
      description: t('location.access.publicDesc'),
    },
    {
      icon: FaPlane,
      title: t('location.access.airport'),
      description: t('location.access.airportDesc'),
    },
  ];

  const amenities = content?.amenities || [
    t('location.amenities.parking'),
    t('location.amenities.accessible'),
    t('location.amenities.restaurant'),
    t('location.amenities.wifi'),
  ];

  // Generate Google Maps embed URL
  const getMapUrl = () => {
    if (venue.coordinates?.lat && venue.coordinates?.lng) {
      return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.5!2d${venue.coordinates.lng}!3d${venue.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMjEnMzYuMCJOIDPCsDU2JzI0LjAiVw!5e0!3m2!1sfr!2sci!4v1234567890`;
    }
    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127287.6!2d-4.0!3d5.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfc1ea5311959121%3A0x3fe70ddce19221a6!2sAbidjan!5e0!3m2!1sfr!2sci!4v1234567890`;
  };

  const openInGoogleMaps = () => {
    const query = encodeURIComponent(`${venue.name}, ${venue.address}, ${venue.city}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <section id="location" className="py-20 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-2 bg-primary-500/20 text-primary-400 rounded-full text-sm font-medium mb-4">
            {t('location.subtitle')}
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            {t('location.title')}
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            {t('location.description')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Map */}
          <motion.div
            className="relative rounded-2xl overflow-hidden h-[400px] lg:h-full min-h-[400px]"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <iframe
              src={getMapUrl()}
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Event Location Map"
            />

            {/* Map Overlay with Button */}
            <div className="absolute bottom-4 left-4 right-4">
              <button
                onClick={openInGoogleMaps}
                className="w-full py-3 bg-white text-gray-900 font-medium rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center shadow-lg"
              >
                <HiMap className="w-5 h-5 mr-2" />
                {t('location.openInMaps')}
              </button>
            </div>
          </motion.div>

          {/* Venue Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Venue Card */}
            <div className="bg-gray-800 rounded-2xl p-8 mb-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-14 h-14 bg-primary-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <HiLocationMarker className="w-7 h-7 text-primary-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{venue.name}</h3>
                  <p className="text-gray-400">
                    {venue.address}
                    <br />
                    {venue.city}, {venue.country}
                  </p>
                </div>
              </div>

              {/* Event Times */}
              {event?.startDate && (
                <div className="flex items-start space-x-4 pt-6 border-t border-gray-700">
                  <div className="w-14 h-14 bg-secondary-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <HiClock className="w-7 h-7 text-secondary-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-1">
                      {t('location.eventTime')}
                    </h4>
                    <p className="text-gray-400">
                      {new Date(event.startDate).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                      <br />
                      {t('location.doorsOpen')}: {event.doorsOpen || '18h00'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Access Information */}
            <div className="bg-gray-800 rounded-2xl p-8 mb-8">
              <h4 className="text-lg font-semibold text-white mb-6 flex items-center">
                <HiTruck className="w-5 h-5 mr-2 text-primary-400" />
                {t('location.howToGet')}
              </h4>

              <div className="space-y-6">
                {accessInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-gray-300" />
                    </div>
                    <div>
                      <h5 className="text-white font-medium mb-1">{info.title}</h5>
                      <p className="text-gray-400 text-sm">{info.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-gray-800 rounded-2xl p-8">
              <h4 className="text-lg font-semibold text-white mb-4">
                {t('location.venueAmenities')}
              </h4>
              <div className="flex flex-wrap gap-3">
                {amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gray-700 text-gray-300 rounded-full text-sm"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
