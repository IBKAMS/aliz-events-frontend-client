import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  HiArrowLeft,
  HiTrash,
  HiMinus,
  HiPlus,
  HiCreditCard,
  HiDeviceMobile,
  HiShieldCheck,
  HiHeart,
} from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { ticketsApi, paymentsApi } from '../services/api';

const CheckoutPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    items,
    donation,
    setDonation,
    updateItemQuantity,
    removeItem,
    subtotal,
    serviceFee,
    total,
    isEmpty,
  } = useCart();

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [mobileProvider, setMobileProvider] = useState(null);
  const [buyerInfo, setBuyerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const paymentMethods = [
    {
      id: 'mobile',
      name: t('checkout.payment.mobile'),
      icon: HiDeviceMobile,
      description: t('checkout.payment.mobileDesc'),
    },
    {
      id: 'card',
      name: t('checkout.payment.card'),
      icon: HiCreditCard,
      description: t('checkout.payment.cardDesc'),
    },
  ];

  const mobileProviders = [
    { id: 'wave', name: 'Wave', logo: '/images/payment/wave.png' },
    { id: 'orange', name: 'Orange Money', logo: '/images/payment/orange.png' },
    { id: 'mtn', name: 'MTN Money', logo: '/images/payment/mtn.png' },
    { id: 'moov', name: 'Moov Money', logo: '/images/payment/moov.png' },
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleBuyerInfoChange = (e) => {
    const { name, value } = e.target;
    setBuyerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const validateStep1 = () => {
    if (isEmpty) {
      setError(t('checkout.errors.emptyCart'));
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!buyerInfo.firstName || !buyerInfo.lastName || !buyerInfo.email || !buyerInfo.phone) {
      setError(t('checkout.errors.fillRequired'));
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerInfo.email)) {
      setError(t('checkout.errors.invalidEmail'));
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!paymentMethod) {
      setError(t('checkout.errors.selectPayment'));
      return false;
    }
    if (paymentMethod === 'mobile' && !mobileProvider) {
      setError(t('checkout.errors.selectProvider'));
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    setError(null);
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    } else if (step === 3 && validateStep3()) {
      handlePayment();
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // 1. Create order
      const orderData = {
        items: items.map((item) => ({
          ticketTypeId: item.ticketType._id,
          quantity: item.quantity,
          attendees: item.attendees,
        })),
        donation,
        buyer: buyerInfo,
      };

      const orderResponse = await ticketsApi.purchaseTickets(orderData);
      const orderId = orderResponse.data?.order?._id || orderResponse.order?._id;

      // 2. Initiate payment
      const paymentData = {
        orderId,
        method: paymentMethod,
        provider: paymentMethod === 'mobile' ? mobileProvider : 'stripe',
        amount: total,
        phone: buyerInfo.phone,
        email: buyerInfo.email,
      };

      const paymentResponse = await paymentsApi.initiatePayment(paymentData);

      // 3. Handle payment response
      if (paymentMethod === 'card' && paymentResponse.data?.redirectUrl) {
        // Redirect to Stripe checkout
        window.location.href = paymentResponse.data.redirectUrl;
      } else if (paymentMethod === 'mobile') {
        // For mobile money, redirect to confirmation with transaction ID
        navigate(`/confirmation?transactionId=${paymentResponse.data?.transactionId}`);
      }
    } catch (err) {
      setError(err.message || t('checkout.errors.paymentFailed'));
      setIsProcessing(false);
    }
  };

  if (isEmpty && step === 1) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl p-12 shadow-sm">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiTrash className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('checkout.emptyCart')}
            </h2>
            <p className="text-gray-600 mb-8">
              {t('checkout.emptyCartDesc')}
            </p>
            <Link
              to="/#tickets"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
            >
              {t('checkout.browseTickets')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-8"
        >
          <HiArrowLeft className="w-5 h-5 mr-2" />
          {t('checkout.backToEvent')}
        </Link>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= s
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {s}
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    step >= s ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {t(`checkout.steps.${s}`)}
                </span>
                {s < 3 && (
                  <div
                    className={`w-16 h-1 mx-4 rounded ${
                      step > s ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              className="bg-white rounded-2xl shadow-sm p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={step}
            >
              {/* Step 1: Cart Review */}
              {step === 1 && (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    {t('checkout.reviewOrder')}
                  </h2>

                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.ticketType._id}
                        className="flex items-start p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {item.ticketType.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {formatPrice(item.unitPrice)} x {item.quantity}
                          </p>
                          <div className="flex items-center space-x-3 mt-3">
                            <button
                              onClick={() =>
                                updateItemQuantity(
                                  item.ticketType._id,
                                  item.quantity - 1,
                                  item.attendees.slice(0, -1)
                                )
                              }
                              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                            >
                              <HiMinus className="w-4 h-4" />
                            </button>
                            <span className="font-semibold">{item.quantity}</span>
                            <button
                              onClick={() =>
                                updateItemQuantity(item.ticketType._id, item.quantity + 1, [
                                  ...item.attendees,
                                  { firstName: '', lastName: '', email: '' },
                                ])
                              }
                              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                            >
                              <HiPlus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            {formatPrice(item.totalPrice)}
                          </p>
                          <button
                            onClick={() => removeItem(item.ticketType._id)}
                            className="text-red-500 hover:text-red-700 text-sm mt-2"
                          >
                            {t('checkout.remove')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Donation */}
                  <div className="mt-6 p-4 bg-accent-50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <HiHeart className="w-5 h-5 text-accent-500 mr-2" />
                        <span className="font-medium text-gray-900">
                          {t('checkout.addDonation')}
                        </span>
                      </div>
                      <input
                        type="number"
                        value={donation || ''}
                        onChange={(e) => setDonation(parseInt(e.target.value, 10) || 0)}
                        placeholder="0"
                        className="w-32 px-3 py-2 border border-gray-200 rounded-lg text-right focus:outline-none focus:border-primary-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Step 2: Buyer Information */}
              {step === 2 && (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    {t('checkout.buyerInfo')}
                  </h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('checkout.firstName')} *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={buyerInfo.firstName}
                        onChange={handleBuyerInfoChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('checkout.lastName')} *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={buyerInfo.lastName}
                        onChange={handleBuyerInfoChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('checkout.email')} *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={buyerInfo.email}
                        onChange={handleBuyerInfoChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('checkout.phone')} *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={buyerInfo.phone}
                        onChange={handleBuyerInfoChange}
                        placeholder="+225"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 mt-4">
                    {t('checkout.emailNote')}
                  </p>
                </>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    {t('checkout.selectPayment')}
                  </h2>

                  <div className="space-y-4 mb-8">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => {
                          setPaymentMethod(method.id);
                          if (method.id !== 'mobile') setMobileProvider(null);
                        }}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                          paymentMethod === method.id
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <method.icon
                            className={`w-6 h-6 mr-3 ${
                              paymentMethod === method.id
                                ? 'text-primary-600'
                                : 'text-gray-400'
                            }`}
                          />
                          <div>
                            <p className="font-semibold text-gray-900">{method.name}</p>
                            <p className="text-sm text-gray-500">{method.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Mobile Money Providers */}
                  {paymentMethod === 'mobile' && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-4">
                        {t('checkout.selectProvider')}
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {mobileProviders.map((provider) => (
                          <button
                            key={provider.id}
                            onClick={() => setMobileProvider(provider.id)}
                            className={`p-4 rounded-xl border-2 flex items-center justify-center transition-all ${
                              mobileProvider === provider.id
                                ? 'border-primary-600 bg-primary-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <span className="font-medium text-gray-900">{provider.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center mt-6 p-4 bg-green-50 rounded-xl">
                    <HiShieldCheck className="w-6 h-6 text-green-600 mr-3" />
                    <span className="text-sm text-green-700">
                      {t('checkout.securePayment')}
                    </span>
                  </div>
                </>
              )}

              {/* Error Message */}
              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                  {error}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t">
                {step > 1 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-3 text-gray-600 font-medium hover:text-gray-900"
                  >
                    {t('checkout.back')}
                  </button>
                )}
                <button
                  onClick={handleNextStep}
                  disabled={isProcessing}
                  className={`ml-auto px-8 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 ${
                    step === 1 ? 'w-full' : ''
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      {t('checkout.processing')}
                    </div>
                  ) : step === 3 ? (
                    t('checkout.pay')
                  ) : (
                    t('checkout.continue')
                  )}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {t('checkout.summary')}
              </h3>

              <div className="space-y-3 pb-4 border-b">
                {items.map((item) => (
                  <div key={item.ticketType._id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.ticketType.name} x {item.quantity}
                    </span>
                    <span className="text-gray-900">{formatPrice(item.totalPrice)}</span>
                  </div>
                ))}
              </div>

              <div className="py-4 space-y-3 border-b">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('checkout.subtotal')}</span>
                  <span className="text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('checkout.serviceFee')}</span>
                  <span className="text-gray-900">{formatPrice(serviceFee)}</span>
                </div>
                {donation > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('checkout.donation')}</span>
                    <span className="text-accent-600">{formatPrice(donation)}</span>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    {t('checkout.total')}
                  </span>
                  <span className="text-lg font-bold text-primary-600">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
