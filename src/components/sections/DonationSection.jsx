import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { HiHeart, HiGift, HiSparkles, HiPhone, HiX, HiUser, HiCheck } from 'react-icons/hi';
import { useCart } from '../../context/CartContext';
import { useEvent } from '../../context/EventContext';
import api from '../../services/api';

const DonationSection = () => {
  const { t } = useTranslation();
  const { setDonation } = useCart();
  const { event } = useEvent();
  const [customAmount, setCustomAmount] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [currentAmount, setCurrentAmount] = useState(0); // Local state for donation amount
  const [showThankYou, setShowThankYou] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState(false);
  const [error, setError] = useState('');

  // Donor info state
  const [donorInfo, setDonorInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  // Computed validation - Only require amount for the validate button
  const isFormValid = currentAmount >= 1000;

  const presetAmounts = [
    { value: 5000, label: '5 000 FCFA', icon: HiHeart, color: 'from-pink-400 to-pink-600', bg: 'bg-pink-50', border: 'border-pink-300', text: 'text-pink-600' },
    { value: 10000, label: '10 000 FCFA', icon: HiGift, color: 'from-purple-400 to-purple-600', bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-600' },
    { value: 25000, label: '25 000 FCFA', icon: HiSparkles, color: 'from-blue-400 to-blue-600', bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-600' },
    { value: 35000, label: '35 000 FCFA', icon: HiSparkles, color: 'from-cyan-400 to-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-300', text: 'text-cyan-600' },
    { value: 45000, label: '45 000 FCFA', icon: HiSparkles, color: 'from-teal-400 to-teal-600', bg: 'bg-teal-50', border: 'border-teal-300', text: 'text-teal-600' },
    { value: 50000, label: '50 000 FCFA', icon: HiSparkles, color: 'from-emerald-400 to-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-600' },
    { value: 60000, label: '60 000 FCFA', icon: HiSparkles, color: 'from-lime-400 to-lime-600', bg: 'bg-lime-50', border: 'border-lime-300', text: 'text-lime-600' },
    { value: 75000, label: '75 000 FCFA', icon: HiSparkles, color: 'from-orange-400 to-orange-600', bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-600' },
    { value: 100000, label: '100 000 FCFA', icon: HiSparkles, color: 'from-yellow-400 to-amber-500', bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-600', popular: true },
  ];

  const handlePresetSelect = (amount) => {
    setSelectedPreset(amount);
    setCustomAmount('');
    setCurrentAmount(amount);
    setDonation(amount);
  };

  const handleCustomAmount = (value) => {
    const numValue = parseInt(value.replace(/\D/g, ''), 10) || 0;
    setCustomAmount(value);
    setSelectedPreset(null);
    setCurrentAmount(numValue);
    if (numValue >= 1000) {
      setDonation(numValue);
    }
  };

  const handleDonorInfoChange = (e) => {
    const { name, value } = e.target;
    setDonorInfo((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (currentAmount < 1000) {
      setError(t('donation.minimumAmount') || 'Le montant minimum est de 1 000 FCFA');
      return false;
    }
    setError('');
    return true;
  };

  const handleValidate = () => {
    if (currentAmount >= 1000) {
      setError('');
      setShowPaymentModal(true);
    }
  };

  const handleSubmitDonation = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const eventId = event?._id || event?.id;

      if (!eventId) {
        setError('Événement non trouvé');
        setIsSubmitting(false);
        return;
      }

      await api.post('/donations', {
        eventId,
        donor: {
          firstName: donorInfo.firstName,
          lastName: donorInfo.lastName,
          email: donorInfo.email,
          phone: donorInfo.phone,
        },
        amount: currentAmount,
        paymentMethod: 'wave',
      });

      setDonationSuccess(true);
      setShowThankYou(true);
      setTimeout(() => setShowThankYou(false), 5000);
    } catch (err) {
      console.error('Donation error:', err);
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowPaymentModal(false);
    if (donationSuccess) {
      // Reset form after successful donation
      setDonorInfo({ firstName: '', lastName: '', email: '', phone: '' });
      setCurrentAmount(0);
      setDonation(0);
      setSelectedPreset(null);
      setCustomAmount('');
      setDonationSuccess(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section id="donation" className="py-20 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium mb-4">
              {t('donation.subtitle')}
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
              {t('donation.title')}
            </h2>
            <p className="text-lg text-white/80 mb-8">
              {t('donation.description')}
            </p>
          </motion.div>

          {/* Right - Donation Form */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-xl"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Thank You Message */}
            {showThankYou && (
              <motion.div
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <HiHeart className="w-6 h-6 text-green-500 mr-3" />
                <span className="text-green-700 font-medium">{t('donation.thankYou')}</span>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="text-red-700 font-medium">{error}</span>
              </motion.div>
            )}

            {/* Introduction Text */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiHeart className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Faites un don</h3>
              <p className="text-lg font-medium text-primary-600 mb-2">Soutenez l'événement</p>
              <p className="text-gray-600">
                Votre générosité nous aide à rendre cet événement possible et à offrir une expérience inoubliable.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                <HiSparkles className="w-6 h-6 mr-2 text-amber-500" />
                Choisissez un montant
              </h3>
              <p className="text-sm text-gray-500 mb-4">Sélectionnez le montant de votre don</p>
            </div>

            {/* Preset Amounts - Animated Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {presetAmounts.map((preset, index) => (
                <motion.button
                  key={preset.value}
                  onClick={() => handlePresetSelect(preset.value)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center overflow-hidden group ${
                    selectedPreset === preset.value || currentAmount === preset.value
                      ? `${preset.border} ${preset.bg} shadow-lg`
                      : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
                  }`}
                >
                  {/* Popular Badge */}
                  {preset.popular && (
                    <span className="absolute -top-1 -right-1 px-2 py-0.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold rounded-full shadow-md">
                      TOP
                    </span>
                  )}

                  {/* Gradient Background on Hover/Select */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${preset.color} opacity-0 transition-opacity duration-300 ${
                    selectedPreset === preset.value || currentAmount === preset.value ? 'opacity-10' : 'group-hover:opacity-5'
                  }`} />

                  {/* Icon with animated background */}
                  <div className={`relative w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    selectedPreset === preset.value || currentAmount === preset.value
                      ? `bg-gradient-to-br ${preset.color} shadow-md`
                      : `${preset.bg} group-hover:scale-110`
                  }`}>
                    <preset.icon
                      className={`w-6 h-6 transition-colors duration-300 ${
                        selectedPreset === preset.value || currentAmount === preset.value
                          ? 'text-white'
                          : preset.text
                      }`}
                    />
                  </div>

                  {/* Amount Label */}
                  <span
                    className={`font-bold text-sm transition-colors duration-300 ${
                      selectedPreset === preset.value || currentAmount === preset.value
                        ? preset.text
                        : 'text-gray-700'
                    }`}
                  >
                    {preset.label}
                  </span>

                  {/* Selected Checkmark */}
                  {(selectedPreset === preset.value || currentAmount === preset.value) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`absolute top-2 left-2 w-5 h-5 rounded-full bg-gradient-to-br ${preset.color} flex items-center justify-center`}
                    >
                      <HiCheck className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Montant personnalisé
              </label>
              <div className="flex space-x-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={customAmount}
                    onChange={(e) => handleCustomAmount(e.target.value)}
                    placeholder="Ex: 15 000"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 pr-16"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    FCFA
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Montant minimum: 1 000 FCFA
              </p>
            </div>

            {/* Current Donation */}
            {currentAmount > 0 && (
              <div className="p-4 bg-primary-50 rounded-xl mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Votre don</span>
                  <span className="text-xl font-bold text-primary-600">
                    {formatPrice(currentAmount)}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setCurrentAmount(0);
                    setDonation(0);
                    setSelectedPreset(null);
                    setCustomAmount('');
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700 mt-2"
                >
                  Retirer le don
                </button>
              </div>
            )}

            {/* Validate Button */}
            <button
              onClick={handleValidate}
              disabled={!isFormValid}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                isFormValid
                  ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              Valider mon don
            </button>

            {/* Payment Info Banner */}
            <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-blue-50 rounded-xl border border-orange-200">
              <div className="flex items-center justify-center mb-2">
                <HiPhone className="w-5 h-5 text-orange-500 mr-2" />
                <span className="text-lg font-bold text-gray-900">07 57 42 66 15</span>
              </div>
              <div className="flex justify-center space-x-3">
                <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold rounded-full">Wave</span>
                <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold rounded-full">Orange Money</span>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                Paiement sécurisé. Votre don sera enregistré.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <HiX className="w-5 h-5 text-gray-600" />
              </button>

              {donationSuccess ? (
                /* Success State */
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <HiCheck className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {t('donation.successTitle') || 'Don enregistré !'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {t('donation.successMessage') || 'Merci pour votre générosité. Votre don a été enregistré avec succès.'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t('donation.paymentReminder') || 'N\'oubliez pas d\'effectuer votre paiement via Wave ou Orange Money au numéro ci-dessous.'}
                  </p>

                  {/* Payment Info in Success */}
                  <div className="mt-6 p-6 bg-gradient-to-r from-orange-50 to-blue-50 rounded-2xl border border-orange-200">
                    <div className="flex items-center justify-center space-x-3 mb-3">
                      <HiPhone className="w-8 h-8 text-orange-500" />
                      <span className="text-3xl font-bold text-gray-900">07 57 42 66 15</span>
                    </div>
                    <div className="flex justify-center space-x-4">
                      <span className="px-4 py-2 bg-orange-500 text-white rounded-full font-semibold">Wave</span>
                      <span className="px-4 py-2 bg-orange-600 text-white rounded-full font-semibold">Orange Money</span>
                    </div>
                  </div>

                  <button
                    onClick={closeModal}
                    className="mt-8 px-8 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
                  >
                    {t('common.close') || 'Fermer'}
                  </button>
                </div>
              ) : (
                /* Payment Info State */
                <>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <HiHeart className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {t('donation.paymentTitle') || 'Effectuer votre don'}
                    </h3>
                    <p className="text-2xl font-bold text-primary-600">
                      {formatPrice(currentAmount)}
                    </p>
                  </div>

                  {/* Error in modal */}
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                      <span className="text-red-700 text-sm">{error}</span>
                    </div>
                  )}

                  {/* Donor Info in Modal */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <HiUser className="w-4 h-4 mr-2 text-primary-600" />
                      Vos informations (optionnel)
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        name="firstName"
                        value={donorInfo.firstName}
                        onChange={handleDonorInfoChange}
                        placeholder="Prénom"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 text-sm"
                      />
                      <input
                        type="text"
                        name="lastName"
                        value={donorInfo.lastName}
                        onChange={handleDonorInfoChange}
                        placeholder="Nom"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 text-sm"
                      />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={donorInfo.phone}
                      onChange={handleDonorInfoChange}
                      placeholder="Téléphone (optionnel)"
                      className="w-full mt-3 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 text-sm"
                    />
                  </div>

                  {/* Payment Method - Large Display */}
                  <div className="p-6 bg-gradient-to-r from-orange-50 to-blue-50 rounded-2xl border-2 border-orange-200 mb-6">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3 text-center">
                      Envoyez votre don au numéro:
                    </h4>
                    <div className="flex items-center justify-center space-x-3 mb-3">
                      <HiPhone className="w-8 h-8 text-orange-500" />
                      <span className="text-3xl font-bold text-gray-900">07 57 42 66 15</span>
                    </div>
                    <div className="flex justify-center space-x-4">
                      <span className="px-4 py-2 bg-orange-500 text-white rounded-full font-bold text-sm">Wave</span>
                      <span className="px-4 py-2 bg-orange-600 text-white rounded-full font-bold text-sm">Orange Money</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmitDonation}
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                      isSubmitting
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('common.loading') || 'Chargement...'}
                      </span>
                    ) : (
                      'Confirmer mon don'
                    )}
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default DonationSection;
