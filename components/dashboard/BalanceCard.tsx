'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useBudget } from '@/contexts/BudgetContext';
import { ArrowDownCircle, ArrowUpCircle, Wallet } from 'lucide-react';

export function BalanceCard() {
  const { balance, incomeTotal, expenseTotal } = useBudget();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-800 text-white pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Current Balance
        </CardTitle>
        <p className="text-3xl font-bold mt-2">
          {formatCurrency(balance)}
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-2 divide-x">
          <div className="p-4 flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
              <ArrowUpCircle className="h-4 w-4 text-green-500" />
              Income
            </div>
            <p className="text-lg font-semibold text-green-600">
              {formatCurrency(incomeTotal)}
            </p>
          </div>
          <div className="p-4 flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
              <ArrowDownCircle className="h-4 w-4 text-red-500" />
              Expenses
            </div>
            <p className="text-lg font-semibold text-red-500">
              {formatCurrency(expenseTotal)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}