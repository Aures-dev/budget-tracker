'use client';

import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBudget } from '@/contexts/BudgetContext';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register Chart.js components
Chart.register(ArcElement, Tooltip, Legend);

export function ExpensesChart() {
  const { categoryTotals, expenseTotal } = useBudget();
  const chartRef = useRef<Chart | null>(null);

  // Only show the chart if there are expenses
  if (categoryTotals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <p className="text-muted-foreground text-center">
            No expense data available yet.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Add transactions to see your spending breakdown.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Format data for Chart.js
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

  // Chart options
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
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            const formattedValue = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(value);
            return `${context.label}: ${formattedValue} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '65%',
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-[250px] w-full">
          <Doughnut data={data} options={options} />
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-xl font-bold">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
              }).format(expenseTotal)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}