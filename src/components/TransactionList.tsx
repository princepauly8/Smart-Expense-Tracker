import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatFriendlyDate } from '../utils/formatters';
import { getCategoryIcon, getPaymentMethodInfo } from '../utils/icons';
import {
  Search,
  SlidersHorizontal,
  X,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Wallet,
  Tag,
  CreditCard,
} from 'lucide-react';
import { PaymentMethod } from '../types';

interface TransactionListProps {
  onOpenAddTx: () => void;
  onEditTx: (txId: string) => void;
  onViewTxDetail: (txId: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  onOpenAddTx,
  onEditTx,
  onViewTxDetail,
}) => {
  const {
    transactions,
    categories,
    user,
    deleteTransaction,
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
  } = useFinance();

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filter logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // 1. Search Query filter (matches description, category name, or tags)
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchDesc = tx.description.toLowerCase().includes(q);
        const matchCat = tx.categoryName.toLowerCase().includes(q);
        const matchTag = tx.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchDesc && !matchCat && !matchTag) return false;
      }

      // 2. Type filter
      if (filterType !== 'all' && tx.type !== filterType) {
        return false;
      }

      // 3. Category filter
      if (filterCategory !== 'all' && tx.categoryId !== filterCategory) {
        return false;
      }

      // 4. Payment method filter
      if (filterPaymentMethod !== 'all' && tx.paymentMethod !== filterPaymentMethod) {
        return false;
      }

      // 5. Date Range filter
      if (filterDateRange) {
        if (tx.date < filterDateRange.start || tx.date > filterDateRange.end) {
          return false;
        }
      }

      return true;
    });
  }, [
    transactions,
    searchQuery,
    filterType,
    filterCategory,
    filterPaymentMethod,
    filterDateRange,
  ]);

  // Group filtered transactions by Date string
  const groupedTransactions = useMemo(() => {
    const groups: { [dateStr: string]: typeof transactions } = {};
    filteredTransactions.forEach((tx) => {
      if (!groups[tx.date]) {
        groups[tx.date] = [];
      }
      groups[tx.date].push(tx);
    });

    // Sort dates descending
    const sortedDates = Object.keys(groups).sort((a, b) => b.localeCompare(a));
    return sortedDates.map((dateStr) => ({
      date: dateStr,
      items: groups[dateStr],
      dayTotal: groups[dateStr].reduce(
        (sum, item) => (item.type === 'income' ? sum + item.amount : sum - item.amount),
        0
      ),
    }));
  }, [filteredTransactions]);

  // Filtered Summary Totals
  const filteredTotals = useMemo(() => {
    let inc = 0;
    let exp = 0;
    filteredTransactions.forEach((tx) => {
      if (tx.type === 'income') inc += tx.amount;
      else exp += tx.amount;
    });
    return { income: inc, expense: exp, net: inc - exp };
  }, [filteredTransactions]);

  const handleQuickDateFilter = (type: 'all' | 'today' | 'this_week' | 'this_month') => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    if (type === 'all') {
      setFilterDateRange(null);
    } else if (type === 'today') {
      setFilterDateRange({ start: todayStr, end: todayStr });
    } else if (type === 'this_week') {
      const d = new Date();
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
      const monday = new Date(d.setDate(diff)).toISOString().split('T')[0];
      setFilterDateRange({ start: monday, end: todayStr });
    } else if (type === 'this_month') {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      setFilterDateRange({ start: firstDay, end: todayStr });
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setFilterType('all');
    setFilterCategory('all');
    setFilterPaymentMethod('all');
    setFilterDateRange(null);
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    filterType !== 'all' ||
    filterCategory !== 'all' ||
    filterPaymentMethod !== 'all' ||
    filterDateRange !== null;

  return (
    <div className="space-y-4 pb-16">
      {/* Header & Search Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Transaction History
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <button
            id="add-tx-history-btn"
            onClick={onOpenAddTx}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Record</span>
          </button>
        </div>

        {/* Search Input Box */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="search-transactions-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by notes, merchant, category, or #tags..."
              className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            id="filter-toggle-btn"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`px-3 py-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition-all ${
              showAdvancedFilters || hasActiveFilters
                ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400'
                : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-xs'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
            )}
          </button>
        </div>

        {/* Quick Type Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all', label: 'All Types' },
            { id: 'expense', label: 'Expenses' },
            { id: 'income', label: 'Income' },
          ].map((pill) => (
            <button
              key={pill.id}
              id={`filter-type-${pill.id}`}
              onClick={() => setFilterType(pill.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                filterType === pill.id
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {pill.label}
            </button>
          ))}

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 shrink-0" />

          {/* Quick Date Range Pills */}
          {[
            { id: 'all', label: 'All Dates' },
            { id: 'today', label: 'Today' },
            { id: 'this_week', label: 'This Week' },
            { id: 'this_month', label: 'This Month' },
          ].map((dp) => (
            <button
              key={dp.id}
              onClick={() => handleQuickDateFilter(dp.id as any)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {dp.label}
            </button>
          ))}
        </div>

        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Filter Parameters
              </span>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-semibold text-rose-500 hover:underline"
                >
                  Clear Filters
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Category Dropdown */}
              <div>
                <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
                  Category
                </label>
                <select
                  id="filter-category-select"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.type})
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment Method */}
              <div>
                <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
                  Payment Method
                </label>
                <select
                  id="filter-payment-method-select"
                  value={filterPaymentMethod}
                  onChange={(e) => setFilterPaymentMethod(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                >
                  <option value="all">All Payment Methods</option>
                  <option value="cash">Cash</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="upi">UPI / Instant</option>
                  <option value="mobile_wallet">Mobile Wallet</option>
                  <option value="crypto">Crypto</option>
                </select>
              </div>

              {/* Custom Date Range */}
              <div>
                <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
                  Custom Date Range
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="date"
                    value={filterDateRange?.start || ''}
                    onChange={(e) =>
                      setFilterDateRange({
                        start: e.target.value,
                        end: filterDateRange?.end || e.target.value,
                      })
                    }
                    className="w-full p-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                  />
                  <span className="text-slate-400 text-xs">-</span>
                  <input
                    type="date"
                    value={filterDateRange?.end || ''}
                    onChange={(e) =>
                      setFilterDateRange({
                        start: filterDateRange?.start || e.target.value,
                        end: e.target.value,
                      })
                    }
                    className="w-full p-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Summary Metric Bar */}
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-3">
            <span className="text-emerald-600 dark:text-emerald-400">
              Income: +{formatCurrency(filteredTotals.income, user.currency)}
            </span>
            <span className="text-rose-600 dark:text-rose-400">
              Expense: -{formatCurrency(filteredTotals.expense, user.currency)}
            </span>
          </div>
          <div className="text-slate-700 dark:text-slate-300">
            Net: {formatCurrency(filteredTotals.net, user.currency)}
          </div>
        </div>
      </div>

      {/* Transaction List Groups */}
      {groupedTransactions.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            No matching transactions
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            Try adjusting your search query, type selection, or date filters.
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-xs"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {groupedTransactions.map((group) => (
            <div key={group.date} className="space-y-2">
              {/* Date Header Pill */}
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  {formatFriendlyDate(group.date)}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Day Net: {group.dayTotal >= 0 ? '+' : ''}
                  {formatCurrency(group.dayTotal, user.currency)}
                </span>
              </div>

              {/* Transactions in Date Group */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
                {group.items.map((tx) => {
                  const cat = categories.find((c) => c.id === tx.categoryId);
                  const pmInfo = getPaymentMethodInfo(tx.paymentMethod);
                  const isExpense = tx.type === 'expense';

                  return (
                    <div
                      key={tx.id}
                      id={`tx-row-${tx.id}`}
                      className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                    >
                      {/* Left: Icon & Info */}
                      <div
                        onClick={() => onViewTxDetail(tx.id)}
                        className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                          style={{
                            backgroundColor: cat ? cat.bgColor : '#f1f5f9',
                            color: cat ? cat.color : '#64748b',
                          }}
                        >
                          {cat ? getCategoryIcon(cat.iconName) : <Wallet className="w-5 h-5" />}
                        </div>

                        <div className="min-w-0 pr-2">
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {tx.description || tx.categoryName}
                          </h4>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                              {tx.categoryName}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              {pmInfo.icon}
                              {pmInfo.label}
                            </span>
                            {tx.time && (
                              <>
                                <span>•</span>
                                <span>{tx.time}</span>
                              </>
                            )}
                          </div>

                          {/* Tags Preview */}
                          {tx.tags && tx.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {tx.tags.map((t) => (
                                <span
                                  key={t}
                                  className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.2 rounded"
                                >
                                  #{t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Amount & Quick Action Controls */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right cursor-pointer" onClick={() => onViewTxDetail(tx.id)}>
                          <span
                            className={`text-sm sm:text-base font-bold ${
                              isExpense
                                ? 'text-rose-600 dark:text-rose-400'
                                : 'text-emerald-600 dark:text-emerald-400'
                            }`}
                          >
                            {isExpense ? '-' : '+'}
                            {formatCurrency(tx.amount, user.currency)}
                          </span>
                        </div>

                        {/* Edit and Delete Buttons */}
                        <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            id={`edit-tx-${tx.id}`}
                            onClick={() => onEditTx(tx.id)}
                            title="Edit transaction"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {deleteConfirmId === tx.id ? (
                            <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/80 p-1 rounded-lg border border-rose-200 dark:border-rose-800">
                              <button
                                onClick={() => {
                                  deleteTransaction(tx.id);
                                  setDeleteConfirmId(null);
                                }}
                                className="text-[10px] font-bold text-rose-600 dark:text-rose-400 px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-900"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="text-[10px] text-slate-500 hover:text-slate-700 px-1"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              id={`delete-tx-${tx.id}`}
                              onClick={() => setDeleteConfirmId(tx.id)}
                              title="Delete transaction"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
