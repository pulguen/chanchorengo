import { createContext, useContext } from 'react';

const AsideLinksContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAsideLinks = () => useContext(AsideLinksContext);

export const AsideLinksProvider = ({ children }) => {
  const subsystemsLinks = {
    Menu: [
      { href: '/home', label: 'Home' },
      { href: '/home', label: 'Home' },
    ],
    // Puedes agregar más subsistemas aquí...
  };


  
  return (
    <AsideLinksContext.Provider value={subsystemsLinks}>
      {children}
    </AsideLinksContext.Provider>
  );
};