'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BudgetData, Transaction, CategoryTotal } from '@/types';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';
import { INITIAL_BUDGET_DATA, CATEGORIES } from '@/lib/constants';

interface BudgetContextType {
  transactions: Transaction[];
  user: BudgetData['user'];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
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
  const [budgetData, setBudgetData] = useLocalStorage<BudgetData>('budgetData', INITIAL_BUDGET_DATA);
  const [categoryTotals, setCategoryTotals] = useState<CategoryTotal[]>([]);
  const [balance, setBalance] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [incomeTotal, setIncomeTotal] = useState(0);

  // Calculate totals whenever transactions change
  useEffect(() => {
    calculateTotals();
  }, [budgetData.transactions]);

  const calculateTotals = () => {
    // Calculate category totals for expenses
    const categoryMap = new Map<string, number>();
    let totalExpenses = 0;
    let totalIncome = 0;
    
    budgetData.transactions.forEach(transaction => {
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

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
    };
    
    setBudgetData(prev => ({
      ...prev,
      transactions: [newTransaction, ...prev.transactions]
    }));
  };

  const deleteTransaction = (id: string) => {
    setBudgetData(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== id)
    }));
  };

  const login = (username: string) => {
    setBudgetData(prev => ({
      ...prev,
      user: {
        username,
        preferences: {
          theme: prev.user?.preferences.theme || 'light'
        }
      }
    }));
  };

  const logout = () => {
    setBudgetData(prev => ({
      ...prev,
      user: null
    }));
  };

  const toggleTheme = () => {
    if (!budgetData.user) return;
    
    setBudgetData(prev => ({
      ...prev,
      user: {
        ...prev.user!,
        preferences: {
          ...prev.user!.preferences,
          theme: prev.user!.preferences.theme === 'light' ? 'dark' : 'light'
        }
      }
    }));
  };

  return (
    <BudgetContext.Provider
      value={{
        transactions: budgetData.transactions,
        user: budgetData.user,
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