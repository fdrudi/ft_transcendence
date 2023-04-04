import checkAuth from '@/services/authService';
import { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextData {
  isAuthenticated: boolean;
  setAuthenticated: (authenticated: boolean) => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextData>({
  isAuthenticated: false,
  setAuthenticated: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setAuthenticated] = useState(false);

    useEffect(() => {
      const fetchAuthStatus = async () => {
        const authStatus = await checkAuth();
        setAuthenticated(authStatus);
      };

      fetchAuthStatus();
    }, []);


  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
