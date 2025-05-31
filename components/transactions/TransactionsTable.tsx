'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBudget } from '@/contexts/BudgetContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ArrowDownUp, Search, Trash2 } from 'lucide-react';
import { Transaction } from '@/types';

export function TransactionsTable() {
  const { transactions, deleteTransaction, getCategoryOptions, formatCurrency } = useBudget();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all-categories');
  const [typeFilter, setTypeFilter] = useState('all-types');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Transaction;
    direction: 'ascending' | 'descending';
  }>({
    key: 'date',
    direction: 'descending',
  });

  // Get all unique categories from transactions
  const allCategories = Array.from(new Set(transactions.map(t => t.category)));

  // Filter transactions based on search and category
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all-categories' ? true : transaction.category === categoryFilter;
    const matchesType = typeFilter === 'all-types' ? true : transaction.type === typeFilter;
    return matchesSearch && matchesCategory && matchesType;
  });

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortConfig.key === 'date') {
      const dateA = new Date(a[sortConfig.key]).getTime();
      const dateB = new Date(b[sortConfig.key]).getTime();
      return sortConfig.direction === 'ascending' ? dateA - dateB : dateB - dateA;
    } else if (sortConfig.key === 'amount') {
      return sortConfig.direction === 'ascending' 
        ? a[sortConfig.key] - b[sortConfig.key] 
        : b[sortConfig.key] - a[sortConfig.key];
    } else {
      const valueA = String(a[sortConfig.key]).toLowerCase();
      const valueB = String(b[sortConfig.key]).toLowerCase();
      return sortConfig.direction === 'ascending'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }
  });

  const handleSort = (key: keyof Transaction) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'ascending' 
        ? 'descending' 
        : 'ascending',
    }));
  };

  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-purple-200 dark:border-purple-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
          Toutes les transactions
        </CardTitle>
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher des transactions..."
              className="pl-8 border-purple-300 dark:border-purple-700 focus:ring-2 focus:ring-purple-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[140px] border-purple-300 dark:border-purple-700 focus:ring-2 focus:ring-purple-500">
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-categories">Toutes les catégories</SelectItem>
                {allCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[130px] border-purple-300 dark:border-purple-700 focus:ring-2 focus:ring-purple-500">
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-types">Tous les types</SelectItem>
                <SelectItem value="income">Revenus</SelectItem>
                <SelectItem value="expense">Dépenses</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {sortedTransactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Aucune transaction trouvée.</p>
          </div>
        ) : (
          <div className="rounded-md border border-purple-200 dark:border-purple-800 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-purple-50 dark:bg-purple-900/50">
                  <TableHead className="w-[30%] cursor-pointer" onClick={() => handleSort('title')}>
                    <div className="flex items-center gap-1">
                      Titre
                      {sortConfig.key === 'title' && (
                        <ArrowDownUp className="h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('amount')}>
                    <div className="flex items-center gap-1">
                      Montant
                      {sortConfig.key === 'amount' && (
                        <ArrowDownUp className="h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Catégorie</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('date')}>
                    <div className="flex items-center gap-1">
                      Date
                      {sortConfig.key === 'date' && (
                        <ArrowDownUp className="h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTransactions.map((transaction) => (
                  <TableRow key={transaction._id} className="hover:bg-purple-50/50 dark:hover:bg-purple-900/20">
                    <TableCell className="font-medium">
                      <div>
                        {transaction.title}
                        <Badge 
                          variant="outline" 
                          className={`ml-2 md:hidden ${
                            transaction.type === 'income' ? 'text-green-500 border-green-200' : 'text-red-500 border-red-200'
                          }`}
                        >
                          {transaction.type === 'income' ? 'Revenu' : 'Dépense'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={transaction.type === 'expense' ? 'text-red-500' : 'text-green-500'}>
                        {transaction.type === 'expense' ? '-' : '+'}{formatCurrency(transaction.amount)}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="bg-purple-50/50 dark:bg-purple-900/20">
                        {transaction.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(transaction.date), 'PPP', { locale: fr })}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTransaction(transaction._id)}
                        className="hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}