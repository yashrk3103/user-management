import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { token, user: userData } = await authService.login({ email, password });
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const loginWithGoogle = async (credential: string) => {
    try {
      const { token, user: userData } = await authService.loginWithGoogle(credential);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const { token, user: userData } = await authService.signup({ name, email, password });
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (!user) return;

    const pingPresence = async () => {
      try {
        await authService.updatePresence();
      } catch {
        // Presence ping failures should not block user interactions.
      }
    };

    void pingPresence();
    const intervalId = window.setInterval(() => {
      void pingPresence();
    }, 10000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void pingPresence();
      }
    };

    const handleFocus = () => {
      void pingPresence();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [user?._id]);

  const logout = () => {
    void authService.logout();
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) throw new Error('No user logged in');
    
    const updatedUser = await userService.updateProfile(user._id, data);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, signup, logout, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
