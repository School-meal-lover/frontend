import { createContext, useContext } from 'react';
import { useMediaQuery } from 'react-responsive';

const MobileContext = createContext<{ isMobile: boolean }>({ isMobile: false });

export const useIsMobile = () => useContext(MobileContext);

export const MobileProvider = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useMediaQuery({ maxWidth: 639 });

  return (
    <MobileContext.Provider value={{ isMobile }}>
      {children}
    </MobileContext.Provider>
  );
};
