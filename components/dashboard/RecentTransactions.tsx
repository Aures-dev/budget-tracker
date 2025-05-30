'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBudget } from '@/contexts/BudgetContext';
import { format } from 'date-fns';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { fr } from 'date-fns/locale';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';

interface RecentTransactionsProps {
  showAll?: boolean;
}

export function RecentTransactions({ showAll = false }: RecentTransactionsProps) {
  const { transactions, formatCurrency } = useBudget();
  
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const displayedTransactions = showAll 
    ? sortedTransactions 
    : sortedTransactions.slice(0, 5);

  if (displayedTransactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {showAll ? 'Toutes les transactions' : 'Transactions récentes'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            Aucune transaction à afficher
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle>
          {showAll ? 'Toutes les transactions' : 'Transactions récentes'}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-1">
        <div className="space-y-4">
          {displayedTransactions.map((transaction) => (
            <div
              key={transaction._id}
              className="flex items-center justify-between p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'income' 
                    ? 'bg-green-100 text-green-600 dark:bg-green-900/30' 
                    : 'bg-red-100 text-red-600 dark:bg-red-900/30'
                }`}>
                  {transaction.type === 'income' ? (
                    <ArrowUpIcon className="h-4 w-4" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {transaction.description || transaction.category}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(transaction.date), 'PPP', { locale: fr })}
                  </p>
                </div>
              </div>
              <div className={`text-sm font-medium ${
                transaction.type === 'income' 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}