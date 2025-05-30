'use client';

import React from 'react';
import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { ExpensesChart } from '@/components/dashboard/ExpensesChart';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { useBudget } from '@/contexts/BudgetContext';

export default function Home() {
  const { user } = useBudget();

  return (
    <div className="container py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {!user ? (
        <div className="text-center max-w-md mx-auto py-16">
          <h1 className="text-3xl font-bold text-purple-700 mb-4">Welcome to Budget Tracker</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Please log in to start tracking your finances.
          </p>
          <div className="rounded-lg bg-purple-50 dark:bg-purple-950/30 p-6 border border-purple-100 dark:border-purple-800">
            <p className="text-sm text-muted-foreground">
              Click the login button in the top right corner to get started.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <h1 className="text-3xl font-bold">
            Hello, <span className="text-purple-600">{user.username}</span>
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-3">
              <BalanceCard />
            </div>
            
            <div className="md:col-span-2 space-y-6">
              <ExpensesChart />
              <RecentTransactions />
            </div>
            
            <div className="md:col-span-1">
              <TransactionForm />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}