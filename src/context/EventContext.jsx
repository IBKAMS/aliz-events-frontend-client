import { createContext, useContext, useState, useEffect } from 'react';
import { eventsApi, contentApi } from '../services/api';

const EventContext = createContext(null);

export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};

export const EventProvider = ({ children, eventSlug }) => {
  const [event, setEvent] = useState(null);
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch event details
        const eventResponse = await eventsApi.getEventBySlug(eventSlug);
        setEvent(eventResponse.data.event);

        // Fetch CMS content for this event
        if (eventResponse.data.event?._id) {
          const contentResponse = await contentApi.getEventContent(
            eventResponse.data.event._id,
            localStorage.getItem('language') || 'fr'
          );
          setContent(contentResponse.data.content || {});
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (eventSlug) {
      fetchEventData();
    }
  }, [eventSlug]);

  const value = {
    event,
    content,
    loading,
    error,
    refreshEvent: () => {
      if (eventSlug) {
        setLoading(true);
        eventsApi.getEventBySlug(eventSlug)
          .then((res) => setEvent(res.data.event))
          .catch((err) => setError(err.message))
          .finally(() => setLoading(false));
      }
    },
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};

export default EventContext;
