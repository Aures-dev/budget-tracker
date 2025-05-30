export interface Transaction {
  _id: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  title: string;
  description?: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
} 