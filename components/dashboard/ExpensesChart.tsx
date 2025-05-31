'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBudget } from '@/contexts/BudgetContext';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

Chart.register(ArcElement, Tooltip, Legend);

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
      color: COLORS[index % COLORS.length],
    }));

    return {
      categoryTotals: totals,
      expenseTotal: total,
    };
  }, [transactions]);

  if (categoryTotals.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-purple-200 dark:border-purple-800 rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
              Dépenses par catégorie
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
            >
              <PlusCircle className="h-12 w-12 text-purple-600 mb-4" aria-hidden="true" />
              <p className="text-gray-600 dark:text-gray-400 text-center" aria-label="Aucune dépense enregistrée">
                Aucune dépense enregistrée.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1 text-center">
                Ajoutez des transactions pour voir la répartition.
              </p>
              <Link href="/transactions">
                <Button
                  className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 transition-all duration-300"
                  aria-label="Ajouter une transaction"
                >
                  Ajouter une transaction
                </Button>
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
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
        hoverOffset: 12,
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
          color: 'rgb(55, 65, 81)', // gray-700
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: 'rgb(55, 65, 81)',
        bodyColor: 'rgb(55, 65, 81)',
        borderColor: 'rgb(216, 180, 254)', // purple-200
        borderWidth: 1,
        callbacks: {
          label: function (context: any) {
            const value = context.raw;
            const percentage = Math.round((value / expenseTotal) * 100);
            return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
          },
        },
      },
    },
    cutout: '65%',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-purple-200 dark:border-purple-800 rounded-xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
            Dépenses par catégorie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative h-[250px] w-full"
          >
            <Doughnut data={data} options={options} />
            <div className="absolute inset-0 flex items-center justify-center flex-col" aria-label={`Total des dépenses: ${formatCurrency(expenseTotal)}`}>
              <span className="text-sm text-gray-600 dark:text-gray-400">Total</span>
              <span className="text-xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
                {formatCurrency(expenseTotal)}
              </span>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}