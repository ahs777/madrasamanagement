import { createContext, useContext, useState, FC, ReactNode } from 'react';

interface UserRoleContextType {
  role: string;
  setRole: (role: string) => void;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

interface UserRoleProviderProps {
  children: ReactNode; // Define children prop here
}

export const UserRoleProvider: FC<UserRoleProviderProps> = ({ children }) => {
  const [role, setRole] = useState<string>('guest'); // Default role

  return (
    <UserRoleContext.Provider value={{ role, setRole }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = () => {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
};
