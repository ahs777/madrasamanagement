import React, { createContext, useContext, useState, FC } from "react";

interface RtlContextType {
  isRtl: boolean;
  toggleRtl: () => void;
}

const RtlContext = createContext<RtlContextType | undefined>(undefined);

export const RtlProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isRtl, setIsRtl] = useState<boolean>(false);

  const toggleRtl = () => setIsRtl(!isRtl);

  return (
    <RtlContext.Provider value={{ isRtl, toggleRtl }}>
      {children}
    </RtlContext.Provider>
  );
};

export const useRtl = () => {
  const context = useContext(RtlContext);
  if (context === undefined) {
    throw new Error("useRtl must be used within a RtlProvider");
  }
  return context;
};
