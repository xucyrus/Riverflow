import React, { createContext, useState, useContext } from 'react';

// 創建並導出 TicketContext
export const TicketContext = createContext();

export const TicketProvider = ({ children }) => {
  const [selectedTickets, setSelectedTickets] = useState([]);

  const updateSelectedTickets = (tickets) => {
    setSelectedTickets(tickets);
  };

  return (
    <TicketContext.Provider value={{ selectedTickets, updateSelectedTickets }}>
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => useContext(TicketContext);