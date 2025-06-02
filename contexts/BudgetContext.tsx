'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthUser } from '@/types/auth';
import { Transaction } from '@/types/transaction';

interface BudgetContextType {
  user: AuthUser | null;
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, '_id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
  getCategoryOptions: (type: 'income' | 'expense') => string[];
  formatCurrency: (amount: number) => string;
  toggleTheme: () => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export function BudgetProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Fonction pour mettre à jour l'utilisateur et recharger les transactions
  const updateUserAndFetchData = (newUser: AuthUser | null) => {
    setUser(newUser);
    if (newUser) {
      const token = localStorage.getItem('token');
      if (token) {
        fetchTransactions(token, newUser.id);
      }
    } else {
      setTransactions([]);
    }
  };

  // Écouter les changements d'authentification
  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (storedUser && token) {
        const parsedUser = JSON.parse(storedUser);
        updateUserAndFetchData(parsedUser);
      } else {
        updateUserAndFetchData(null);
      }
    };

    // Initial check
    handleStorageChange();

    // Listen for changes
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const fetchTransactions = async (token: string, userId: string) => {
    try {
      const response = await fetch(`/api/transactions?userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, '_id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const token = localStorage.getItem('token');
    if (!token || !user) return;

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...transaction,
          userId: user.id
        })
      });

      if (response.ok) {
        const newTransaction = await response.json();
        setTransactions(prev => [...prev, newTransaction]);
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token || !user) return;

    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setTransactions(prev => prev.filter(t => t._id !== id));
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  };

  const updateTransaction = async (id: string, transaction: Partial<Transaction>) => {
    const token = localStorage.getItem('token');
    if (!token || !user) return;

    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(transaction)
      });

      if (response.ok) {
        const updatedTransaction = await response.json();
        setTransactions(prev => prev.map(t => t._id === id ? updatedTransaction : t));
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  };

  const DEFAULT_EXPENSE_CATEGORIES = [
    'Alimentation',
    'Transport',
    'Logement',
    'Loisirs',
    'Santé',
    'Shopping',
    'Factures',
    'Autre'
  ];

  const getCategoryOptions = (type: 'income' | 'expense'): string[] => {
    if (!user) return [];
    
    if (type === 'income') {
      return [...(user.preferences.incomeSources?.map(source => source.name) || []), 'Autre'];
    }
    
    const expenseCategories = user.preferences.defaultCategories
      ?.filter(cat => cat.type === 'expense')
      .map(cat => cat.name);
    
    return expenseCategories?.length ? [...expenseCategories, 'Autre'] : DEFAULT_EXPENSE_CATEGORIES;
  };

  const formatCurrency = (amount: number): string => {
    const currency = user?.preferences?.currency || 'USD';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const toggleTheme = async () => {
    if (!user) return;
    
    const newTheme: 'light' | 'dark' = user.preferences.theme === 'dark' ? 'light' : 'dark';
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user.id,
          preferences: {
            ...user.preferences,
            theme: newTheme
          }
        })
      });

      if (response.ok) {
        // Mettre à jour l'utilisateur dans le state et le localStorage
        const updatedUser: AuthUser = {
          ...user,
          preferences: {
            ...user.preferences,
            theme: newTheme
          }
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  };

  return (
    <BudgetContext.Provider value={{
      user,
      transactions,
      addTransaction,
      deleteTransaction,
      updateTransaction,
      getCategoryOptions,
      formatCurrency,
      toggleTheme
    }}>
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
}