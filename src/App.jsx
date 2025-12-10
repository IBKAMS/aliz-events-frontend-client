import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import { Layout } from './components/layout';
import { HomePage, CheckoutPage, ConfirmationPage } from './pages';
import { EventProvider } from './context/EventContext';
import { CartProvider } from './context/CartContext';
import './i18n';

// Loading component
const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-gray-600">Chargement...</p>
    </div>
  </div>
);

// Get event slug from URL or use default
const getEventSlug = () => {
  const hostname = window.location.hostname;
  // Check if it's a subdomain (e.g., concert-gospel.alizevents.com)
  const parts = hostname.split('.');
  if (parts.length > 2 && parts[0] !== 'www') {
    return parts[0];
  }
  // Default event slug for development
  return import.meta.env.VITE_DEFAULT_EVENT_SLUG || 'demo-event';
};

function App() {
  const eventSlug = getEventSlug();

  return (
    <Suspense fallback={<Loading />}>
      <CartProvider>
        <EventProvider eventSlug={eventSlug}>
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="confirmation" element={<ConfirmationPage />} />
              </Route>
            </Routes>
          </Router>
        </EventProvider>
      </CartProvider>
    </Suspense>
  );
}

export default App;
