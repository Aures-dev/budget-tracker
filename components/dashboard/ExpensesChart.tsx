'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBudget } from '@/contexts/BudgetContext';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register Chart.js components
Chart.register(ArcElement, Tooltip, Legend);

// Couleurs pour les catégories
const COLORS = [
  '#8b5cf6', // violet-500
  '#6366f1', // indigo-500
  '#3b82f6', // blue-500
  '#0ea5e9', // sky-500
  '#06b6d4', // cyan-500
  '#14b8a6', // teal-500
  '#10b981', // emerald-500
  '#22c55e', // green-500
];

export function ExpensesChart() {
  const { transactions, formatCurrency } = useBudget();

  const { categoryTotals, expenseTotal } = useMemo(() => {
    const expenseTotals = new Map<string, number>();
    let total = 0;

    transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        const current = expenseTotals.get(transaction.category) || 0;
        expenseTotals.set(transaction.category, current + transaction.amount);
        total += transaction.amount;
      });

    const totals = Array.from(expenseTotals.entries()).map(([category, amount], index) => ({
      category,
      total: amount,
      color: COLORS[index % COLORS.length]
    }));

    return {
      categoryTotals: totals,
      expenseTotal: total
    };
  }, [transactions]);

  if (categoryTotals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dépenses par catégorie</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <p className="text-muted-foreground text-center">
            Aucune dépense enregistrée.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Ajoutez des transactions pour voir la répartition.
          </p>
        </CardContent>
      </Card>
    );
  }

  const data = {
    labels: categoryTotals.map(c => c.category),
    datasets: [
      {
        data: categoryTotals.map(c => c.total),
        backgroundColor: categoryTotals.map(c => c.color),
        borderColor: 'transparent',
        borderWidth: 1,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.raw;
            const percentage = Math.round((value / expenseTotal) * 100);
            return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '65%',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dépenses par catégorie</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-[250px] w-full">
          <Doughnut data={data} options={options} />
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-xl font-bold">
              {formatCurrency(expenseTotal)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}