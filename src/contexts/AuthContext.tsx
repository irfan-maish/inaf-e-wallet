import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged, 
  sendPasswordResetEmail,
  User
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, database } from '../firebase/config';
import { toast } from 'react-toastify';

interface AuthContextType {
  currentUser: User | null;
  userRole: string | null;
  loading: boolean;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function signup(email: string, password: string, name: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create user profile in database
      await set(ref(database, `users/${user.uid}`), {
        name,
        email,
        role: 'user'
      });
      
      // Initialize wallet with 1000 Taka bonus
      await set(ref(database, `wallet/${user.uid}`), {
        balance: 1000,
        created_at: new Date().toISOString()
      });
      
      toast.success('Account created with 1000 Taka bonus!');
    } catch (error) {
      console.error('Error during signup:', error);
      toast.error('Failed to create account');
      throw error;
    }
  }

  async function login(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login successful!');
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('Failed to login');
      throw error;
    }
  }

  async function logout() {
    try {
      await firebaseSignOut(auth);
      toast.info('Logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Failed to logout');
      throw error;
    }
  }

  async function resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.info('Password reset email sent!');
    } catch (error) {
      console.error('Error during password reset:', error);
      toast.error('Failed to send password reset email');
      throw error;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          const userSnapshot = await get(ref(database, `users/${user.uid}`));
          if (userSnapshot.exists()) {
            const userData = userSnapshot.val();
            setUserRole(userData.role || 'user');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUserRole(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    loading,
    signup,
    login,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}