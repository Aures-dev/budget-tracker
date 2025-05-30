export interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

export interface User {
  username: string;
  preferences: {
    theme: 'dark' | 'light';
  };
}

export type CategoryTotal = {
  category: string;
  total: number;
  color: string;
};

export interface BudgetData {
  transactions: Transaction[];
  user: User | null;
}