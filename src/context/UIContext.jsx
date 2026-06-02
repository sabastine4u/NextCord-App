import React, { createContext, useContext, useState, useCallback } from 'react';

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeModal,  setActiveModal] = useState(null);
  const [modalData,    setModalData]   = useState(null);

  // loginPrompt carries the "reason" text shown in the prompt modal
  const [loginPrompt, setLoginPrompt] = useState(null); // null | { action: string }

  const openModal = useCallback((modalName, data = null) => {
    setActiveModal(modalName);
    setModalData(data);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setModalData(null);
  }, []);

  // Show the "sign in to continue" prompt
  const promptLogin = useCallback((action = 'do that') => {
    setLoginPrompt({ action });
  }, []);

  const closeLoginPrompt = useCallback(() => setLoginPrompt(null), []);

  const toggleSidebar = useCallback(() => setSidebarOpen(p => !p), []);

  return (
    <UIContext.Provider value={{
      sidebarOpen, toggleSidebar, setSidebarOpen,
      activeModal, modalData, openModal, closeModal,
      loginPrompt, promptLogin, closeLoginPrompt,
    }}>
      {children}
    </UIContext.Provider>
  );
}

export const useUI = () => {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within UIProvider');
  return ctx;
};
