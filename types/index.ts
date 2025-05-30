export interface Transaction {
  _id?: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
  userId?: string;
}

export interface User {
  username: string;
  preferences: {
    theme: 'light' | 'dark';
  };
}

export interface BudgetData {
  transactions: Transaction[];
  user: User | null;
}

export interface CategoryTotal {
  category: string;
  total: number;
  color: string;
}