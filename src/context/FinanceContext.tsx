import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Transaction,
  CategoryInfo,
  UserProfile,
  UserBudget,
  InAppNotification,
  ActiveTab,
  CurrencyConfig,
} from '../types';
import {
  ALL_CATEGORIES,
  DEFAULT_BUDGETS,
  DEFAULT_USER,
  INITIAL_TRANSACTIONS,
  SUPPORTED_CURRENCIES,
} from '../data/initialData';
import confetti from 'canvas-confetti';

interface FinanceContextType {
  transactions: Transaction[];
  categories: CategoryInfo[];
  user: UserProfile;
  budgets: UserBudget;
  notifications: InAppNotification[];
  unreadNotificationCount: number;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isMobileFrame: boolean;
  toggleMobileFrame: () => void;
  
  // Transaction operations
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  editTransaction: (id: string, tx: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  
  // Category operations
  addCategory: (category: Omit<CategoryInfo, 'id'>) => void;
  
  // User & Budget operations
  updateUser: (updated: Partial<UserProfile>) => void;
  updateCurrency: (currency: CurrencyConfig) => void;
  updateBudgets: (updated: Partial<UserBudget>) => void;
  
  // Notification operations
  markNotificationAsRead: (id?: string) => void;
  clearAllNotifications: () => void;
  sendDailyReminder: () => void;
  
  // Data management
  exportDataCSV: () => void;
  exportDataJSON: () => void;
  importDataJSON: (jsonString: string) => boolean;
  resetDemoData: () => void;
  
  // Search & Filter State
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterType: 'all' | 'expense' | 'income';
  setFilterType: (type: 'all' | 'expense' | 'income') => void;
  filterCategory: string;
  setFilterCategory: (cat: string) => void;
  filterPaymentMethod: string;
  setFilterPaymentMethod: (pm: string) => void;
  filterDateRange: { start: string; end: string } | null;
  setFilterDateRange: (range: { start: string; end: string } | null) => void;
  
  // Computed Metrics
  currentMonthTotals: {
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
    savingsRate: number;
    highestExpenseCategory: { name: string; amount: number; percentage: number } | null;
  };
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TRANSACTIONS: 'expense_tracker_txs_v2',
  CATEGORIES: 'expense_tracker_cats_v2',
  USER: 'expense_tracker_user_v2',
  BUDGETS: 'expense_tracker_budgets_v2',
  NOTIFICATIONS: 'expense_tracker_notifications_v2',
  DARK_MODE: 'expense_tracker_dark_mode_v2',
  MOBILE_FRAME: 'expense_tracker_mobile_frame_v2',
};

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with LocalStorage or defaults
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [categories, setCategories] = useState<CategoryInfo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return saved ? JSON.parse(saved) : ALL_CATEGORIES;
    } catch {
      return ALL_CATEGORIES;
    }
  });

  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [budgets, setBudgets] = useState<UserBudget>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BUDGETS);
      return saved ? JSON.parse(saved) : DEFAULT_BUDGETS;
    } catch {
      return DEFAULT_BUDGETS;
    }
  });

  const [notifications, setNotifications] = useState<InAppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'notif-1',
          title: 'Welcome to Smart Money Tracker',
          message: 'Track your daily cash flow, expenses and monitor budgets easily.',
          type: 'info',
          timestamp: Date.now() - 3600000,
          read: false,
        },
      ];
    } catch {
      return [];
    }
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MOBILE_FRAME);
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPaymentMethod, setFilterPaymentMethod] = useState<string>('all');
  const [filterDateRange, setFilterDateRange] = useState<{ start: string; end: string } | null>(null);

  // Sync state changes to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MOBILE_FRAME, JSON.stringify(isMobileFrame));
  }, [isMobileFrame]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
  const toggleMobileFrame = () => setIsMobileFrame((prev) => !prev);

  // Budget checks & notifications helper
  const checkBudgetThreshold = (newExpenseCatId: string, currentTxs: Transaction[]) => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const monthExpenses = currentTxs.filter(
      (tx) => tx.type === 'expense' && tx.date.startsWith(currentMonth)
    );

    // Check category budget
    const catLimit = budgets.categoryBudgets[newExpenseCatId];
    if (catLimit && catLimit > 0) {
      const catSpent = monthExpenses
        .filter((tx) => tx.categoryId === newExpenseCatId)
        .reduce((sum, tx) => sum + tx.amount, 0);

      const percentage = (catSpent / catLimit) * 100;
      const catInfo = categories.find((c) => c.id === newExpenseCatId);
      const catName = catInfo ? catInfo.name : newExpenseCatId;

      if (percentage >= 100) {
        setNotifications((prev) => [
          {
            id: `budget-exceeded-${Date.now()}`,
            title: `Budget Exceeded for ${catName}!`,
            message: `You spent ${user.currency.symbol}${catSpent.toFixed(2)}, which exceeds your monthly limit of ${user.currency.symbol}${catLimit.toFixed(2)}.`,
            type: 'warning',
            timestamp: Date.now(),
            read: false,
            relatedCategoryId: newExpenseCatId,
          },
          ...prev,
        ]);
      } else if (percentage >= user.budgetAlertThreshold) {
        setNotifications((prev) => [
          {
            id: `budget-alert-${Date.now()}`,
            title: `Budget Alert: ${catName} at ${percentage.toFixed(0)}%`,
            message: `You have used ${percentage.toFixed(0)}% (${user.currency.symbol}${catSpent.toFixed(2)}) of your ${user.currency.symbol}${catLimit.toFixed(2)} budget.`,
            type: 'warning',
            timestamp: Date.now(),
            read: false,
            relatedCategoryId: newExpenseCatId,
          },
          ...prev,
        ]);
      }
    }

    // Check overall monthly budget
    if (budgets.monthlyOverallBudget > 0) {
      const totalMonthSpent = monthExpenses.reduce((sum, tx) => sum + tx.amount, 0);
      const overallPct = (totalMonthSpent / budgets.monthlyOverallBudget) * 100;
      if (overallPct >= 100) {
        setNotifications((prev) => [
          {
            id: `overall-budget-${Date.now()}`,
            title: 'Overall Monthly Budget Exceeded!',
            message: `Total spending (${user.currency.symbol}${totalMonthSpent.toFixed(2)}) exceeded your budget limit of ${user.currency.symbol}${budgets.monthlyOverallBudget.toFixed(2)}.`,
            type: 'warning',
            timestamp: Date.now(),
            read: false,
          },
          ...prev,
        ]);
      }
    }
  };

  const addTransaction = (txData: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTx: Transaction = {
      ...txData,
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: Date.now(),
    };

    const nextTxs = [newTx, ...transactions];
    setTransactions(nextTxs);

    if (newTx.type === 'expense') {
      checkBudgetThreshold(newTx.categoryId, nextTxs);
    } else {
      // Income celebration
      if (newTx.amount >= 500) {
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
          });
        } catch {
          // ignore
        }
      }
    }
  };

  const editTransaction = (id: string, updatedFields: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === id ? { ...tx, ...updatedFields } : tx))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  };

  const addCategory = (category: Omit<CategoryInfo, 'id'>) => {
    const newCat: CategoryInfo = {
      ...category,
      id: `cat_${category.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
    };
    setCategories((prev) => [...prev, newCat]);
  };

  const updateUser = (updated: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  const updateCurrency = (currency: CurrencyConfig) => {
    setUser((prev) => ({ ...prev, currency }));
  };

  const updateBudgets = (updated: Partial<UserBudget>) => {
    setBudgets((prev) => ({ ...prev, ...updated }));
  };

  const markNotificationAsRead = (id?: string) => {
    if (id) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } else {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const sendDailyReminder = () => {
    setNotifications((prev) => [
      {
        id: `reminder-${Date.now()}`,
        title: 'Daily Expense Reminder',
        message: "Don't forget to log your coffee, groceries, and today's transactions!",
        type: 'info',
        timestamp: Date.now(),
        read: false,
      },
      ...prev,
    ]);
  };

  // Export to CSV
  const exportDataCSV = () => {
    const headers = ['ID', 'Type', 'Amount', 'Category', 'Date', 'Time', 'Description', 'Payment Method', 'Tags'];
    const rows = transactions.map((tx) => [
      tx.id,
      tx.type,
      tx.amount,
      `"${tx.categoryName.replace(/"/g, '""')}"`,
      tx.date,
      tx.time || '',
      `"${tx.description.replace(/"/g, '""')}"`,
      tx.paymentMethod,
      `"${(tx.tags || []).join(', ')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Income_Expense_Backup_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to JSON
  const exportDataJSON = () => {
    const backupData = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      user,
      budgets,
      categories,
      transactions,
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `FinanceTracker_Full_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Import JSON backup
  const importDataJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.transactions)) {
        setTransactions(data.transactions);
      }
      if (data.categories && Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
      if (data.budgets) {
        setBudgets(data.budgets);
      }
      if (data.user) {
        setUser((prev) => ({ ...prev, ...data.user }));
      }
      return true;
    } catch (err) {
      console.error('Failed to import backup JSON', err);
      return false;
    }
  };

  const resetDemoData = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setCategories(ALL_CATEGORIES);
    setUser(DEFAULT_USER);
    setBudgets(DEFAULT_BUDGETS);
    setNotifications([
      {
        id: `notif-reset-${Date.now()}`,
        title: 'Demo Data Restored',
        message: 'Sample expenses, income streams, and categories have been restored.',
        type: 'info',
        timestamp: Date.now(),
        read: false,
      },
    ]);
  };

  const unreadNotificationCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  // Compute Current Month Totals
  const currentMonthTotals = useMemo(() => {
    const now = new Date();
    const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    let totalIncome = 0;
    let totalExpense = 0;
    const catExpenseMap: Record<string, { name: string; amount: number }> = {};

    transactions.forEach((tx) => {
      // Calculate for current active month
      if (tx.date.startsWith(currentMonthPrefix)) {
        if (tx.type === 'income') {
          totalIncome += tx.amount;
        } else {
          totalExpense += tx.amount;
          if (!catExpenseMap[tx.categoryId]) {
            catExpenseMap[tx.categoryId] = { name: tx.categoryName, amount: 0 };
          }
          catExpenseMap[tx.categoryId].amount += tx.amount;
        }
      }
    });

    // If no transactions this month, fallback to all-time or 0
    if (totalIncome === 0 && totalExpense === 0 && transactions.length > 0) {
      transactions.forEach((tx) => {
        if (tx.type === 'income') totalIncome += tx.amount;
        else {
          totalExpense += tx.amount;
          if (!catExpenseMap[tx.categoryId]) {
            catExpenseMap[tx.categoryId] = { name: tx.categoryName, amount: 0 };
          }
          catExpenseMap[tx.categoryId].amount += tx.amount;
        }
      });
    }

    const netBalance = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100)) : 0;

    let highestExpenseCategory: { name: string; amount: number; percentage: number } | null = null;
    const sortedCats = Object.values(catExpenseMap).sort((a, b) => b.amount - a.amount);

    if (sortedCats.length > 0 && totalExpense > 0) {
      highestExpenseCategory = {
        name: sortedCats[0].name,
        amount: sortedCats[0].amount,
        percentage: Math.round((sortedCats[0].amount / totalExpense) * 100),
      };
    }

    return {
      totalIncome,
      totalExpense,
      netBalance,
      savingsRate,
      highestExpenseCategory,
    };
  }, [transactions]);

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        categories,
        user,
        budgets,
        notifications,
        unreadNotificationCount,
        activeTab,
        setActiveTab,
        isDarkMode,
        toggleDarkMode,
        isMobileFrame,
        toggleMobileFrame,
        addTransaction,
        editTransaction,
        deleteTransaction,
        addCategory,
        updateUser,
        updateCurrency,
        updateBudgets,
        markNotificationAsRead,
        clearAllNotifications,
        sendDailyReminder,
        exportDataCSV,
        exportDataJSON,
        importDataJSON,
        resetDemoData,
        searchQuery,
        setSearchQuery,
        filterType,
        setFilterType,
        filterCategory,
        setFilterCategory,
        filterPaymentMethod,
        setFilterPaymentMethod,
        filterDateRange,
        setFilterDateRange,
        currentMonthTotals,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
