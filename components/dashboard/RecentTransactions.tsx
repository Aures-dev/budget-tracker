'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBudget } from '@/contexts/BudgetContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ArrowDownIcon, ArrowUpIcon, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface RecentTransactionsProps {
  showAll?: boolean;
}

export function RecentTransactions({ showAll = false }: RecentTransactionsProps) {
  const { transactions, formatCurrency } = useBudget();

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const displayedTransactions = showAll ? sortedTransactions : sortedTransactions.slice(0, 5);

  if (displayedTransactions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-purple-200 dark:border-purple-800 rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
              {showAll ? 'Toutes les transactions' : 'Transactions récentes'}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
            >
              <PlusCircle className="h-12 w-12 text-purple-600 mb-4" aria-hidden="true" />
              <p className="text-gray-600 dark:text-gray-400 text-center" aria-label="Aucune transaction à afficher">
                Aucune transaction à afficher
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-purple-200 dark:border-purple-800 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
            {showAll ? 'Toutes les transactions' : 'Transactions récentes'}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-1">
          <div className="space-y-4">
            {displayedTransactions.map((transaction, index) => (
              <motion.div
                key={transaction._id}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.01 }}
                className="flex items-center justify-between p-4 rounded-lg border border-purple-200/50 dark:border-purple-800/50 bg-white/50 dark:bg-gray-900/50 shadow-sm"
                aria-label={`Transaction: ${transaction.description || transaction.category}`}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-2 rounded-full ${
                      transaction.type === 'income'
                        ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white'
                        : 'bg-gradient-to-br from-red-500 to-rose-500 text-white'
                    }`}
                  >
                    {transaction.type === 'income' ? (
                      <ArrowUpIcon className="h-4 w-4" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {transaction.description || transaction.category}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {format(new Date(transaction.date), 'PPP', { locale: fr })}
                    </p>
                  </div>
                </div>
                <div
                  className={`text-sm font-medium ${
                    transaction.type === 'income'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}