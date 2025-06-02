import React, { createContext, useContext, useState, useEffect } from 'react';
import { ref, onValue, set, push, get } from 'firebase/database';
import { database } from '../firebase/config';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'card-transfer';
  amount: number;
  method: string;
  status: 'pending' | 'completed' | 'rejected';
  timestamp: string;
  reference?: string;
}

export interface CardApplication {
  name: string;
  dob: string;
  phone: string;
  email: string;
  status: 'pending' | 'verified';
  submitted_at: string;
  verified_at?: string;
  card_number?: string;
  expiry_date?: string;
  cvv?: string;
}

interface WalletContextType {
  balance: number;
  cardBalance: number;
  transactions: Transaction[];
  cardApplication: CardApplication | null;
  hasCard: boolean;
  refreshBalance: () => void;
  deposit: (amount: number, method: string, reference: string) => Promise<void>;
  withdraw: (amount: number, method: string, accountDetails: string) => Promise<void>;
  transferToCard: (amount: number) => Promise<void>;
  transferToAccount: (amount: number) => Promise<void>;
  applyForCard: (application: Omit<CardApplication, 'status' | 'submitted_at'>) => Promise<void>;
  verifyCardApplication: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const [balance, setBalance] = useState(0);
  const [cardBalance, setCardBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cardApplication, setCardApplication] = useState<CardApplication | null>(null);
  const [hasCard, setHasCard] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      setBalance(0);
      setCardBalance(0);
      setTransactions([]);
      setCardApplication(null);
      setHasCard(false);
      return;
    }

    // Listen for account balance changes
    const balanceRef = ref(database, `wallet/${currentUser.uid}/balance`);
    const unsubscribeBalance = onValue(balanceRef, (snapshot) => {
      if (snapshot.exists()) {
        setBalance(snapshot.val());
      } else {
        setBalance(0);
      }
    });

    // Listen for card balance changes
    const cardBalanceRef = ref(database, `wallet/${currentUser.uid}/cardBalance`);
    const unsubscribeCardBalance = onValue(cardBalanceRef, (snapshot) => {
      if (snapshot.exists()) {
        setCardBalance(snapshot.val());
      } else {
        setCardBalance(0);
      }
    });

    // Listen for transactions
    const transactionsRef = ref(database, `transactions/${currentUser.uid}`);
    const unsubscribeTransactions = onValue(transactionsRef, (snapshot) => {
      if (snapshot.exists()) {
        const transactionsData = snapshot.val();
        const transactionsArray = Object.keys(transactionsData).map(key => ({
          id: key,
          ...transactionsData[key]
        }));
        
        // Sort by timestamp (newest first)
        transactionsArray.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        setTransactions(transactionsArray);
      } else {
        setTransactions([]);
      }
    });

    // Check for card application
    const cardRef = ref(database, `cards/${currentUser.uid}`);
    const unsubscribeCard = onValue(cardRef, (snapshot) => {
      if (snapshot.exists()) {
        const cardData = snapshot.val();
        setCardApplication(cardData);
        setHasCard(cardData.status === 'verified');
      } else {
        setCardApplication(null);
        setHasCard(false);
      }
    });

    return () => {
      unsubscribeBalance();
      unsubscribeCardBalance();
      unsubscribeTransactions();
      unsubscribeCard();
    };
  }, [currentUser]);

  const refreshBalance = () => {
    if (currentUser) {
      const balanceRef = ref(database, `wallet/${currentUser.uid}/balance`);
      const cardBalanceRef = ref(database, `wallet/${currentUser.uid}/cardBalance`);
      
      Promise.all([
        get(balanceRef),
        get(cardBalanceRef)
      ]).then(([balanceSnapshot, cardBalanceSnapshot]) => {
        if (balanceSnapshot.exists()) {
          setBalance(balanceSnapshot.val());
        }
        if (cardBalanceSnapshot.exists()) {
          setCardBalance(cardBalanceSnapshot.val());
        }
        toast.success('Balances updated');
      }).catch(error => {
        console.error('Error refreshing balances:', error);
        toast.error('Failed to refresh balances');
      });
    }
  };

  const transferToCard = async (amount: number) => {
    if (!currentUser) throw new Error('User not authenticated');
    if (!hasCard) throw new Error('No verified card available');
    if (amount <= 0) throw new Error('Amount must be greater than 0');
    if (amount > balance) throw new Error('Insufficient balance');

    try {
      // Create transaction record
      const transactionRef = push(ref(database, `transactions/${currentUser.uid}`));
      const transaction: Omit<Transaction, 'id'> = {
        type: 'card-transfer',
        amount,
        method: 'internal',
        status: 'completed',
        timestamp: new Date().toISOString()
      };
      
      await set(transactionRef, transaction);
      
      // Update balances
      await set(ref(database, `wallet/${currentUser.uid}/balance`), balance - amount);
      await set(ref(database, `wallet/${currentUser.uid}/cardBalance`), cardBalance + amount);
      
      toast.success(`Successfully transferred ${amount} Tk to card`);
    } catch (error) {
      console.error('Error during card transfer:', error);
      toast.error('Transfer failed');
      throw error;
    }
  };

  const transferToAccount = async (amount: number) => {
    if (!currentUser) throw new Error('User not authenticated');
    if (!hasCard) throw new Error('No verified card available');
    if (amount <= 0) throw new Error('Amount must be greater than 0');
    if (amount > cardBalance) throw new Error('Insufficient card balance');

    try {
      // Create transaction record
      const transactionRef = push(ref(database, `transactions/${currentUser.uid}`));
      const transaction: Omit<Transaction, 'id'> = {
        type: 'card-transfer',
        amount: -amount, // Negative to indicate transfer back to account
        method: 'internal',
        status: 'completed',
        timestamp: new Date().toISOString()
      };
      
      await set(transactionRef, transaction);
      
      // Update balances
      await set(ref(database, `wallet/${currentUser.uid}/balance`), balance + amount);
      await set(ref(database, `wallet/${currentUser.uid}/cardBalance`), cardBalance - amount);
      
      toast.success(`Successfully transferred ${amount} Tk to account`);
    } catch (error) {
      console.error('Error during account transfer:', error);
      toast.error('Transfer failed');
      throw error;
    }
  };

  const deposit = async (amount: number, method: string, reference: string) => {
    if (!currentUser) throw new Error('User not authenticated');
    if (amount <= 0) throw new Error('Amount must be greater than 0');

    try {
      // Create transaction record
      const transactionRef = push(ref(database, `transactions/${currentUser.uid}`));
      const transaction: Omit<Transaction, 'id'> = {
        type: 'deposit',
        amount,
        method,
        reference,
        status: 'pending',
        timestamp: new Date().toISOString()
      };
      
      await set(transactionRef, transaction);
      
      // Auto-approve deposit (in a real app, this would be handled by admin)
      setTimeout(async () => {
        if (currentUser) {
          // Update transaction status
          await set(ref(database, `transactions/${currentUser.uid}/${transactionRef.key}/status`), 'completed');
          
          // Update balance
          await set(ref(database, `wallet/${currentUser.uid}/balance`), balance + amount);
          
          toast.success(`Deposit of ${amount} Tk approved!`);
        }
      }, 10000); // Auto-approve after 10 seconds
      
      toast.info('Deposit request submitted');
    } catch (error) {
      console.error('Error during deposit:', error);
      toast.error('Deposit failed');
      throw error;
    }
  };

  const withdraw = async (amount: number, method: string, accountDetails: string) => {
    if (!currentUser) throw new Error('User not authenticated');
    if (amount <= 0) throw new Error('Amount must be greater than 0');
    if (amount > balance) throw new Error('Insufficient balance');

    try {
      // Create transaction record
      const transactionRef = push(ref(database, `transactions/${currentUser.uid}`));
      const transaction: Omit<Transaction, 'id'> = {
        type: 'withdraw',
        amount,
        method,
        reference: accountDetails,
        status: 'pending',
        timestamp: new Date().toISOString()
      };
      
      await set(transactionRef, transaction);
      
      // Auto-approve withdrawal (in a real app, this would be handled by admin)
      setTimeout(async () => {
        if (currentUser) {
          // Update transaction status
          await set(ref(database, `transactions/${currentUser.uid}/${transactionRef.key}/status`), 'completed');
          
          // Update balance
          await set(ref(database, `wallet/${currentUser.uid}/balance`), balance - amount);
          
          toast.success(`Withdrawal of ${amount} Tk approved!`);
        }
      }, 15000); // Auto-approve after 15 seconds
      
      toast.info('Withdrawal request submitted');
    } catch (error) {
      console.error('Error during withdrawal:', error);
      toast.error('Withdrawal failed');
      throw error;
    }
  };

  const applyForCard = async (application: Omit<CardApplication, 'status' | 'submitted_at'>) => {
    if (!currentUser) throw new Error('User not authenticated');

    try {
      const cardData: CardApplication = {
        ...application,
        status: 'pending',
        submitted_at: new Date().toISOString()
      };
      
      await set(ref(database, `cards/${currentUser.uid}`), cardData);
      toast.success('Card application submitted successfully!');
    } catch (error) {
      console.error('Error during card application:', error);
      toast.error('Card application failed');
      throw error;
    }
  };

  const verifyCardApplication = async () => {
    if (!currentUser || !cardApplication) throw new Error('No card application found');

    try {
      // Generate card details
      const cardNumber = generateCardNumber();
      const expiryDate = generateExpiryDate();
      const cvv = generateCVV();
      
      const updatedCardData: CardApplication = {
        ...cardApplication,
        status: 'verified',
        verified_at: new Date().toISOString(),
        card_number: cardNumber,
        expiry_date: expiryDate,
        cvv: cvv
      };
      
      await set(ref(database, `cards/${currentUser.uid}`), updatedCardData);
      
      // Initialize card balance
      await set(ref(database, `wallet/${currentUser.uid}/cardBalance`), 0);
      
      setCardApplication(updatedCardData);
      setHasCard(true);
      
      toast.success('Card application verified!');
    } catch (error) {
      console.error('Error during card verification:', error);
      toast.error('Card verification failed');
      throw error;
    }
  };

  // Helper functions for card generation
  const generateCardNumber = () => {
    let number = '5';
    for (let i = 0; i < 15; i++) {
      number += Math.floor(Math.random() * 10);
    }
    return number.replace(/(\d{4})/g, '$1 ').trim();
  };

  const generateExpiryDate = () => {
    const now = new Date();
    const year = (now.getFullYear() + 3) % 100;
    const month = now.getMonth() + 1;
    return `${month.toString().padStart(2, '0')}/${year.toString().padStart(2, '0')}`;
  };

  const generateCVV = () => {
    return Math.floor(100 + Math.random() * 900).toString();
  };

  const value = {
    balance,
    cardBalance,
    transactions,
    cardApplication,
    hasCard,
    refreshBalance,
    deposit,
    withdraw,
    transferToCard,
    transferToAccount,
    applyForCard,
    verifyCardApplication
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}