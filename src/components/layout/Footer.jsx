import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaWhatsapp,
} from 'react-icons/fa';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: FaFacebookF, href: '#', label: 'Facebook' },
    { icon: FaInstagram, href: '#', label: 'Instagram' },
    { icon: FaTwitter, href: '#', label: 'Twitter' },
    { icon: FaYoutube, href: '#', label: 'YouTube' },
    { icon: FaWhatsapp, href: '#', label: 'WhatsApp' },
  ];

  const quickLinks = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.artists'), href: '/#artists' },
    { label: t('nav.program'), href: '/#program' },
    { label: t('nav.tickets'), href: '/#tickets' },
    { label: t('nav.gallery'), href: '/#gallery' },
    { label: t('nav.contact'), href: '/#contact' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <h3 className="text-2xl font-display font-bold text-primary-400">
              ALIZ EVENTS
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Votre partenaire pour des événements inoubliables. Nous créons des expériences uniques qui marquent les esprits.
            </p>
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Liens rapides</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <HiLocationMarker className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  Abidjan, Côte d'Ivoire
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <HiPhone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a
                  href="tel:+2250700000000"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                >
                  +225 07 00 00 00 00
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <HiMail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a
                  href="mailto:contact@alizevents.com"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                >
                  contact@alizevents.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Newsletter</h4>
            <p className="text-gray-400 mb-4">
              Inscrivez-vous pour recevoir nos dernières actualités.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Votre email"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
              />
              <button
                type="submit"
                className="w-full px-4 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
              >
                S'inscrire
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {currentYear} ALIZ EVENTS by ALIZ STRATEGY. {t('footer.rights')}.
            </p>
            <div className="flex items-center space-x-6">
              <Link
                to="/privacy"
                className="text-gray-500 text-sm hover:text-primary-400 transition-colors"
              >
                {t('footer.privacy')}
              </Link>
              <Link
                to="/terms"
                className="text-gray-500 text-sm hover:text-primary-400 transition-colors"
              >
                {t('footer.terms')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
