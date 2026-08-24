export type TransactionType = 'expense' | 'income';

export type PaymentMethod = 
  | 'cash' 
  | 'credit_card' 
  | 'debit_card' 
  | 'bank_transfer' 
  | 'upi' 
  | 'mobile_wallet' 
  | 'crypto' 
  | 'other';

export interface CategoryInfo {
  id: string;
  name: string;
  iconName: string;
  color: string;
  bgColor: string;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  categoryName: string;
  date: string; // ISO format YYYY-MM-DD
  time?: string; // HH:mm
  description: string;
  paymentMethod: PaymentMethod;
  tags?: string[];
  receiptUrl?: string;
  isRecurring?: boolean;
  recurringInterval?: 'daily' | 'weekly' | 'monthly';
  createdAt: number;
}

export interface CategoryBudget {
  categoryId: string;
  limit: number;
}

export interface UserBudget {
  monthlyOverallBudget: number;
  categoryBudgets: Record<string, number>; // categoryId -> limit
  savingsGoal: number;
}

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  position: 'prefix' | 'suffix';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  currency: CurrencyConfig;
  joinedDate: string;
  notificationsEnabled: boolean;
  dailyReminderTime: string;
  budgetAlertThreshold: number; // e.g. 80 for 80%
}

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'info' | 'success';
  timestamp: number;
  read: boolean;
  relatedCategoryId?: string;
}

export type ActiveTab = 'dashboard' | 'transactions' | 'analytics' | 'budgets' | 'profile';
