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
import { CATEGORIES } from '@/lib/constants';
import { useBudget } from '@/contexts/BudgetContext';
import { format } from 'date-fns';
import { ArrowDownUp, Search, Trash2 } from 'lucide-react';
import { Transaction } from '@/types';

export function TransactionsTable() {
  const { transactions, deleteTransaction } = useBudget();
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">All Transactions</CardTitle>
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-categories">All Categories</SelectItem>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category.name} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-types">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {sortedTransactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No transactions found.</p>
          </div>
        ) : (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30%] cursor-pointer" onClick={() => handleSort('title')}>
                    <div className="flex items-center gap-1">
                      Title
                      {sortConfig.key === 'title' && (
                        <ArrowDownUp className="h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('amount')}>
                    <div className="flex items-center gap-1">
                      Amount
                      {sortConfig.key === 'amount' && (
                        <ArrowDownUp className="h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
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
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      <div>
                        {transaction.title}
                        <Badge 
                          variant="outline" 
                          className={`ml-2 md:hidden ${
                            transaction.type === 'income' ? 'text-green-500 border-green-200' : 'text-red-500 border-red-200'
                          }`}
                        >
                          {transaction.type}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={transaction.type === 'expense' ? 'text-red-500' : 'text-green-500'}>
                        {transaction.type === 'expense' ? '-' : '+'}{formatCurrency(transaction.amount)}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline">{transaction.category}</Badge>
                    </TableCell>
                    <TableCell>{format(new Date(transaction.date), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTransaction(transaction.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
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