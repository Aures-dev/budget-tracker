'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORIES, TRANSACTION_TYPES } from '@/lib/constants';
import { useBudget } from '@/contexts/BudgetContext';
import { format } from 'date-fns';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function TransactionForm() {
  const { addTransaction } = useBudget();
  const { toast } = useToast();
  
  const [transaction, setTransaction] = useState({
    title: '',
    amount: '',
    category: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    type: 'expense' as 'income' | 'expense',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTransaction(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setTransaction(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!transaction.title.trim()) {
      toast({
        title: "Missing title",
        description: "Please enter a title for the transaction",
        variant: "destructive"
      });
      return;
    }
    
    if (!transaction.amount || parseFloat(transaction.amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount greater than zero",
        variant: "destructive"
      });
      return;
    }
    
    if (!transaction.category) {
      toast({
        title: "Missing category",
        description: "Please select a category for the transaction",
        variant: "destructive"
      });
      return;
    }
    
    // Add transaction
    addTransaction({
      title: transaction.title,
      amount: parseFloat(transaction.amount),
      category: transaction.category,
      date: transaction.date,
      type: transaction.type,
    });
    
    // Reset form
    setTransaction({
      title: '',
      amount: '',
      category: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      type: 'expense',
    });
    
    // Show success message
    toast({
      title: "Transaction added",
      description: "Your transaction has been successfully added",
    });
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <PlusCircle className="h-5 w-5 text-purple-500" />
          Add Transaction
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Grocery shopping"
              value={transaction.title}
              onChange={handleChange}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={transaction.amount}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={transaction.date}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={transaction.type}
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {TRANSACTION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={transaction.category}
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category.name} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            Add Transaction
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}