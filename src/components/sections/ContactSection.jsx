import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiClock,
} from 'react-icons/hi';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';
import { useEvent } from '../../context/EventContext';

const ContactSection = () => {
  const { t } = useTranslation();
  const { content } = useEvent();

  // Get contact info from CMS or use defaults
  const contactInfo = content?.contact || {
    email: 'infos@constanceaman.com',
    phone: '+225 07 08 97 32 75',
    address: 'Abidjan, Côte d\'Ivoire',
    hours: 'Lun - Ven: 9h - 18h',
  };

  const socialLinks = content?.social || [
    { icon: FaFacebookF, href: 'https://www.facebook.com/constanceaman', label: 'Facebook' },
    { icon: FaInstagram, href: 'https://www.instagram.com/constance.aman.officiel/', label: 'Instagram' },
    { icon: FaYoutube, href: 'https://www.youtube.com/constanceaman', label: 'YouTube' },
  ];

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-2 bg-secondary-600/20 text-secondary-300 rounded-full text-sm font-medium mb-4">
            {t('contact.subtitle')}
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            {t('contact.title')}
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            {t('contact.description')}
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">CONSTANCE GOSPEL ORGANISATION</h3>
                <p className="text-white/80 text-sm">{t('contact.infoTitle')}</p>
              </div>

              {/* Contact Details */}
              <div className="grid md:grid-cols-2 gap-6 mb-10">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <HiMail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm mb-1">{t('contact.email')}</p>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-lg hover:underline"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <HiPhone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm mb-1">{t('contact.phone')}</p>
                    <a
                      href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                      className="text-lg hover:underline"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <HiLocationMarker className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm mb-1">{t('contact.address')}</p>
                    <p className="text-lg">{contactInfo.address}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <HiClock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm mb-1">{t('contact.hours')}</p>
                    <p className="text-lg">{contactInfo.hours}</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="text-center">
                <p className="text-white/70 text-sm mb-4">{t('contact.followUs')}</p>
                <div className="flex justify-center space-x-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
