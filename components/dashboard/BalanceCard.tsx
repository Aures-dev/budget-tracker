'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBudget } from '@/contexts/BudgetContext';
import { ArrowDownIcon, ArrowUpIcon, WalletIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export function BalanceCard() {
  const { transactions, formatCurrency } = useBudget();

  const { balance, income, expenses } = transactions.reduce(
    (acc, transaction) => {
      const amount = transaction.amount;
      if (transaction.type === 'income') {
        acc.income += amount;
        acc.balance += amount;
      } else {
        acc.expenses += amount;
        acc.balance -= amount;
      }
      return acc;
    },
    { balance: 0, income: 0, expenses: 0 }
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid gap-4 md:grid-cols-3"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.02 }}
      >
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-purple-200 dark:border-purple-800 rounded-xl shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
              Solde total
            </CardTitle>
            <WalletIcon className="h-4 w-4 text-purple-600" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-gray-900 dark:text-gray-100" aria-label={`Solde total: ${formatCurrency(balance)}`}>
              {formatCurrency(balance)}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.02 }}
      >
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-purple-200 dark:border-purple-800 rounded-xl shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
              Revenus
            </CardTitle>
            <ArrowUpIcon className="h-4 w-4 text-green-500" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-green-600 dark:text-green-400" aria-label={`Revenus: ${formatCurrency(income)}`}>
              {formatCurrency(income)}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.02 }}
      >
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-purple-200 dark:border-purple-800 rounded-xl shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
              Dépenses
            </CardTitle>
            <ArrowDownIcon className="h-4 w-4 text-red-500" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-red-600 dark:text-red-400" aria-label={`Dépenses: ${formatCurrency(expenses)}`}>
              {formatCurrency(expenses)}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}