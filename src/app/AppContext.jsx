import React, { createContext, useContext } from 'react';

const AppReadyContext = createContext({
  ready: false,
  reducedMotion: false,
});

export const AppReadyProvider = ({ value, children }) => (
  <AppReadyContext.Provider value={value}>{children}</AppReadyContext.Provider>
);

export const useAppReady = () => useContext(AppReadyContext);
