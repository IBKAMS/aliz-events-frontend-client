import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [donation, setDonation] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setItems(parsed.items || []);
        setDonation(parsed.donation || 0);
      } catch (e) {
        console.error('Failed to load cart', e);
      }
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify({ items, donation }));
  }, [items, donation]);

  const addItem = (ticketType, quantity, attendees) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.ticketType._id === ticketType._id
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          attendees: [...updated[existingIndex].attendees, ...attendees],
        };
        return updated;
      }

      return [
        ...prev,
        {
          ticketType,
          quantity,
          attendees,
          unitPrice: ticketType.price,
          totalPrice: ticketType.price * quantity,
        },
      ];
    });
  };

  const updateItemQuantity = (ticketTypeId, quantity, attendees) => {
    if (quantity <= 0) {
      removeItem(ticketTypeId);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.ticketType._id === ticketTypeId
          ? {
              ...item,
              quantity,
              attendees,
              totalPrice: item.unitPrice * quantity,
            }
          : item
      )
    );
  };

  const removeItem = (ticketTypeId) => {
    setItems((prev) => prev.filter((item) => item.ticketType._id !== ticketTypeId));
  };

  const clearCart = () => {
    setItems([]);
    setDonation(0);
    localStorage.removeItem('cart');
  };

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const serviceFee = Math.round(subtotal * 0.02); // 2% service fee
  const total = subtotal + serviceFee + donation;
  const totalTickets = items.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    items,
    donation,
    setDonation,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
    subtotal,
    serviceFee,
    total,
    totalTickets,
    isEmpty: items.length === 0,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
