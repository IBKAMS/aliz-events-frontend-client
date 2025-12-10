import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  HiCheck,
  HiDownload,
  HiMail,
  HiTicket,
  HiCalendar,
  HiLocationMarker,
  HiClock,
  HiRefresh,
} from 'react-icons/hi';
import { paymentsApi, ticketsApi } from '../services/api';
import { useCart } from '../context/CartContext';

const ConfirmationPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const [status, setStatus] = useState('pending');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [checkCount, setCheckCount] = useState(0);

  const transactionId = searchParams.get('transactionId');
  const orderNumber = searchParams.get('orderNumber');

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!transactionId && !orderNumber) {
        setError(t('confirmation.noTransaction'));
        setStatus('error');
        return;
      }

      try {
        let response;
        if (transactionId) {
          response = await paymentsApi.getPaymentStatus(transactionId);
        } else if (orderNumber) {
          response = await ticketsApi.getOrderByNumber(orderNumber);
        }

        const paymentStatus = response.data?.status || response.status;
        const orderData = response.data?.order || response.order;

        if (paymentStatus === 'completed' || paymentStatus === 'success') {
          setStatus('success');
          setOrder(orderData);
          clearCart();
        } else if (paymentStatus === 'failed') {
          setStatus('failed');
          setError(response.data?.message || t('confirmation.paymentFailed'));
        } else {
          setStatus('pending');
          // Continue checking for mobile money payments
          if (checkCount < 20) {
            setTimeout(() => setCheckCount((c) => c + 1), 3000);
          } else {
            setStatus('timeout');
          }
        }
      } catch (err) {
        setError(err.message);
        setStatus('error');
      }
    };

    checkPaymentStatus();
  }, [transactionId, orderNumber, checkCount, clearCart, t]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Pending State
  if (status === 'pending') {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-10 h-10 border-3 border-primary-600 border-t-transparent rounded-full animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('confirmation.processing')}
            </h2>
            <p className="text-gray-600 mb-4">
              {t('confirmation.processingDesc')}
            </p>
            <p className="text-sm text-gray-500">
              {t('confirmation.doNotClose')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Success State
  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            className="bg-white rounded-2xl shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Success Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-center text-white">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiCheck className="w-12 h-12" />
              </div>
              <h1 className="text-3xl font-bold mb-2">
                {t('confirmation.success')}
              </h1>
              <p className="text-green-100">
                {t('confirmation.successDesc')}
              </p>
            </div>

            {/* Order Details */}
            <div className="p-8">
              {/* Order Number */}
              <div className="text-center mb-8 pb-8 border-b">
                <p className="text-gray-500 text-sm mb-1">
                  {t('confirmation.orderNumber')}
                </p>
                <p className="text-2xl font-mono font-bold text-gray-900">
                  {order?.orderNumber || 'ORD-XXXXXX'}
                </p>
              </div>

              {/* Tickets */}
              {order?.tickets && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <HiTicket className="w-5 h-5 mr-2 text-primary-600" />
                    {t('confirmation.yourTickets')}
                  </h3>
                  <div className="space-y-3">
                    {order.tickets.map((ticket, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">
                            {ticket.ticketType?.name || ticket.type}
                          </p>
                          <p className="text-sm text-gray-500">
                            {ticket.attendee?.firstName} {ticket.attendee?.lastName}
                          </p>
                        </div>
                        <span className="font-mono text-sm text-gray-600">
                          #{ticket.ticketNumber?.slice(-8)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Event Info */}
              {order?.event && (
                <div className="mb-8 p-6 bg-primary-50 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    {order.event.name?.fr || order.event.name}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <HiCalendar className="w-5 h-5 mr-3 text-primary-600" />
                      <span>{formatDate(order.event.startDate)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <HiClock className="w-5 h-5 mr-3 text-primary-600" />
                      <span>{order.event.doorsOpen || '18h00'}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <HiLocationMarker className="w-5 h-5 mr-3 text-primary-600" />
                      <span>
                        {order.event.venue?.name}, {order.event.venue?.city}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Summary */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {t('confirmation.paymentSummary')}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>{t('confirmation.subtotal')}</span>
                    <span>{formatPrice(order?.subtotal || 0)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>{t('confirmation.serviceFee')}</span>
                    <span>{formatPrice(order?.serviceFee || 0)}</span>
                  </div>
                  {order?.donation > 0 && (
                    <div className="flex justify-between text-accent-600">
                      <span>{t('confirmation.donation')}</span>
                      <span>{formatPrice(order.donation)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                    <span>{t('confirmation.total')}</span>
                    <span>{formatPrice(order?.total || 0)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-3 px-6 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center"
                >
                  <HiDownload className="w-5 h-5 mr-2" />
                  {t('confirmation.downloadTickets')}
                </button>
                <Link
                  to="/"
                  className="flex-1 py-3 px-6 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors text-center"
                >
                  {t('confirmation.backToHome')}
                </Link>
              </div>

              {/* Email Notice */}
              <div className="mt-8 p-4 bg-blue-50 rounded-xl flex items-start">
                <HiMail className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700">
                  {t('confirmation.emailSent', { email: order?.buyer?.email })}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Failed/Error State
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">!</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {status === 'timeout'
              ? t('confirmation.timeout')
              : t('confirmation.error')}
          </h2>
          <p className="text-gray-600 mb-6">
            {error || t('confirmation.errorDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            {status === 'timeout' && (
              <button
                onClick={() => setCheckCount(0)}
                className="flex-1 py-3 px-6 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center"
              >
                <HiRefresh className="w-5 h-5 mr-2" />
                {t('confirmation.checkAgain')}
              </button>
            )}
            <Link
              to="/checkout"
              className="flex-1 py-3 px-6 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors text-center"
            >
              {t('confirmation.tryAgain')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
