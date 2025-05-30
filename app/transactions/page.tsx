'use client';

import React from 'react';
import { TransactionsTable } from '@/components/transactions/TransactionsTable';
import { useBudget } from '@/contexts/BudgetContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function TransactionsPage() {
  const { user } = useBudget();

  if (!user) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Please Log In</h1>
        <p className="text-muted-foreground mb-8">
          You need to be logged in to view your transactions.
        </p>
        <Button asChild className="bg-purple-600 hover:bg-purple-700">
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Transactions</h1>
      </div>
      
      <TransactionsTable />
    </div>
  );
}