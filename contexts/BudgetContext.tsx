'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BudgetData, Transaction, CategoryTotal, User } from '@/types';
import { CATEGORIES } from '@/lib/constants';

interface BudgetContextType {
  transactions: Transaction[];
  user: BudgetData['user'];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  login: (username: string) => void;
  logout: () => void;
  toggleTheme: () => void;
  categoryTotals: CategoryTotal[];
  balance: number;
  expenseTotal: number;
  incomeTotal: number;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [user, setUser] = useState<BudgetData['user']>(null);
  const [categoryTotals, setCategoryTotals] = useState<CategoryTotal[]>([]);
  const [balance, setBalance] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [incomeTotal, setIncomeTotal] = useState(0);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('budgetUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Load transactions when user changes
  useEffect(() => {
    if (user) {
      fetchTransactions();
    } else {
      setTransactions([]);
    }
  }, [user]);

  // Calculate totals whenever transactions change
  useEffect(() => {
    calculateTotals();
  }, [transactions]);

  const fetchTransactions = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/transactions?userId=${user.username}`);
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const calculateTotals = () => {
    // Calculate category totals for expenses
    const categoryMap = new Map<string, number>();
    let totalExpenses = 0;
    let totalIncome = 0;
    
    transactions.forEach(transaction => {
      if (transaction.type === 'expense') {
        const currentTotal = categoryMap.get(transaction.category) || 0;
        categoryMap.set(transaction.category, currentTotal + transaction.amount);
        totalExpenses += transaction.amount;
      } else {
        totalIncome += transaction.amount;
      }
    });
    
    // Convert to array with colors
    const totals: CategoryTotal[] = [];
    categoryMap.forEach((total, category) => {
      const categoryInfo = CATEGORIES.find(c => c.name === category) || { name: category, color: '#94a3b8' };
      totals.push({
        category,
        total,
        color: categoryInfo.color
      });
    });
    
    setCategoryTotals(totals);
    setExpenseTotal(totalExpenses);
    setIncomeTotal(totalIncome);
    setBalance(totalIncome - totalExpenses);
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    if (!user) return;

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...transaction,
          userId: user.username,
        }),
      });

      if (!response.ok) throw new Error('Failed to add transaction');
      
      const newTransaction = await response.json();
      setTransactions(prev => [newTransaction, ...prev]);
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) return;

    try {
      const response = await fetch(`/api/transactions?id=${id}&userId=${user.username}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete transaction');
      
      setTransactions(prev => prev.filter(t => t._id !== id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  };

  const login = (username: string) => {
    const userData: User = {
      username,
      preferences: {
        theme: 'light' as const
      }
    };
    setUser(userData);
    localStorage.setItem('budgetUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('budgetUser');
  };

  const toggleTheme = () => {
    if (!user) return;
    
    const newUser: User = {
      ...user,
      preferences: {
        ...user.preferences,
        theme: user.preferences.theme === 'light' ? 'dark' : 'light'
      }
    };
    
    setUser(newUser);
    localStorage.setItem('budgetUser', JSON.stringify(newUser));
  };

  return (
    <BudgetContext.Provider
      value={{
        transactions,
        user,
        addTransaction,
        deleteTransaction,
        login,
        logout,
        toggleTheme,
        categoryTotals,
        balance,
        expenseTotal,
        incomeTotal
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};