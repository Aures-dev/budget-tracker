export const CATEGORIES = [
  { name: 'Food', color: 'hsl(var(--chart-1))' },
  { name: 'Transportation', color: 'hsl(var(--chart-2))' },
  { name: 'Housing', color: 'hsl(var(--chart-3))' },
  { name: 'Entertainment', color: 'hsl(var(--chart-4))' },
  { name: 'Utilities', color: 'hsl(var(--chart-5))' },
  { name: 'Shopping', color: '#9333ea' },
  { name: 'Healthcare', color: '#6366f1' },
  { name: 'Education', color: '#ec4899' },
  { name: 'Other', color: '#94a3b8' },
];

export const DEFAULT_USER: User = {
  username: '',
  preferences: {
    theme: 'light',
  },
};

export const INITIAL_BUDGET_DATA: BudgetData = {
  transactions: [],
  user: null,
};

export const TRANSACTION_TYPES = [
  { label: 'Expense', value: 'expense' },
  { label: 'Income', value: 'income' },
];

interface User {
  username: string;
  preferences: {
    theme: 'dark' | 'light';
  };
}