'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBudget } from '@/contexts/BudgetContext';
import { format } from 'date-fns';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

export function RecentTransactions() {
  const { transactions } = useBudget();
  
  // Get only the 5 most recent transactions
  const recentTransactions = transactions.slice(0, 5);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (recentTransactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No transactions yet. Add some to get started!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-1">
        <ul className="divide-y">
          {recentTransactions.map((transaction) => (
            <li key={transaction.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {transaction.type === 'expense' ? (
                    <ArrowDownCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    <ArrowUpCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium line-clamp-1">{transaction.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs px-1 py-0 h-5">
                      {transaction.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(transaction.date), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
              </div>
              <span className={`font-medium ${
                transaction.type === 'expense' ? 'text-red-500' : 'text-green-500'
              }`}>
                {transaction.type === 'expense' ? '-' : '+'}{formatCurrency(transaction.amount)}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}