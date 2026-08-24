import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatFriendlyDate, getCurrentMonthRange } from '../utils/formatters';
import { getCategoryIcon, getPaymentMethodInfo } from '../utils/icons';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  ScanLine,
  FileSpreadsheet,
  ChevronRight,
  Percent,
  Plus,
  CreditCard,
  Target,
  BarChart3,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from 'recharts';

interface DashboardProps {
  onOpenAddTx: (defaultType?: 'expense' | 'income') => void;
  onOpenScanReceipt: () => void;
  onOpenTxDetail: (txId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onOpenAddTx,
  onOpenScanReceipt,
  onOpenTxDetail,
}) => {
  const {
    transactions,
    categories,
    user,
    budgets,
    currentMonthTotals,
    setActiveTab,
    exportDataCSV,
  } = useFinance();

  const { name: currentMonthName } = getCurrentMonthRange();

  // Recent 6 transactions
  const recentTransactions = transactions.slice(0, 6);

  // Compute 7-day spending chart data
  const last7DaysData = React.useMemo(() => {
    const days: { day: string; date: string; expense: number; income: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });

      let dayExpense = 0;
      let dayIncome = 0;

      transactions.forEach((tx) => {
        if (tx.date === dateStr) {
          if (tx.type === 'expense') dayExpense += tx.amount;
          else dayIncome += tx.amount;
        }
      });

      days.push({
        day: dayLabel,
        date: dateStr,
        expense: dayExpense,
        income: dayIncome,
      });
    }
    return days;
  }, [transactions]);

  // Overall budget progress calculation
  const overallBudget = budgets.monthlyOverallBudget || 3000;
  const budgetSpentPct = Math.min(100, Math.round((currentMonthTotals.totalExpense / overallBudget) * 100));
  const budgetRemaining = Math.max(0, overallBudget - currentMonthTotals.totalExpense);

  return (
    <div className="space-y-6 pb-16">
      {/* 3-Card Top Metrics Grid (Professional Polish Theme) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Card 1: Total Balance */}
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl w-fit">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/80">
              +{currentMonthTotals.savingsRate}% saved
            </span>
          </div>
          <div className="mt-4">
            <span className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold uppercase tracking-wider block">
              Total Net Balance
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 block">
              {formatCurrency(currentMonthTotals.netBalance, user.currency)}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block font-medium">
              {currentMonthName} Active Period
            </span>
          </div>
        </div>

        {/* Card 2: Monthly Income */}
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl w-fit">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/80">
              Inflow
            </span>
          </div>
          <div className="mt-4">
            <span className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold uppercase tracking-wider block">
              Monthly Income
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 block">
              {formatCurrency(currentMonthTotals.totalIncome, user.currency)}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block font-medium">
              Recorded revenue & earnings
            </span>
          </div>
        </div>

        {/* Card 3: Monthly Expenses */}
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-xl w-fit">
              <TrendingDown className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-800/80">
              Outflow
            </span>
          </div>
          <div className="mt-4">
            <span className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold uppercase tracking-wider block">
              Monthly Expenses
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 block">
              {formatCurrency(currentMonthTotals.totalExpense, user.currency)}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block font-medium">
              {budgetSpentPct}% of total monthly budget
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          id="quick-action-expense"
          onClick={() => onOpenAddTx('expense')}
          className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-rose-300 dark:hover:border-rose-700 hover:bg-rose-50/40 dark:hover:bg-rose-950/20 transition-all group text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              Add Expense
            </span>
            <span className="text-[10px] text-slate-400 block truncate">
              Log spending
            </span>
          </div>
        </button>

        <button
          id="quick-action-income"
          onClick={() => onOpenAddTx('income')}
          className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-all group text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              Add Income
            </span>
            <span className="text-[10px] text-slate-400 block truncate">
              Log earnings
            </span>
          </div>
        </button>

        <button
          id="quick-action-scan"
          onClick={onOpenScanReceipt}
          className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 transition-all group text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <ScanLine className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              Scan Receipt
            </span>
            <span className="text-[10px] text-slate-400 block truncate">
              Instant OCR
            </span>
          </div>
        </button>

        <button
          id="quick-action-export"
          onClick={exportDataCSV}
          className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-50/40 dark:hover:bg-amber-950/20 transition-all group text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              Export CSV
            </span>
            <span className="text-[10px] text-slate-400 block truncate">
              Spreadsheet file
            </span>
          </div>
        </button>
      </div>

      {/* Monthly Budget & Spending Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Monthly Budget Tracker Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Target className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Monthly Budget Control
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('budgets')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
            >
              Adjust Limit <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-500 dark:text-slate-400">
                Spent: <strong className="text-slate-900 dark:text-white">{formatCurrency(currentMonthTotals.totalExpense, user.currency)}</strong>
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                Limit: <strong className="text-slate-900 dark:text-white">{formatCurrency(overallBudget, user.currency)}</strong>
              </span>
            </div>

            {/* Custom Meter */}
            <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  budgetSpentPct > 90
                    ? 'bg-rose-500'
                    : budgetSpentPct > 75
                    ? 'bg-amber-500'
                    : 'bg-indigo-600'
                }`}
                style={{ width: `${budgetSpentPct}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 pt-1">
              <span>{budgetSpentPct}% used</span>
              <span className={budgetRemaining === 0 ? 'text-rose-500 font-semibold' : 'text-emerald-600 dark:text-emerald-400 font-medium'}>
                {budgetRemaining > 0
                  ? `${formatCurrency(budgetRemaining, user.currency)} remaining`
                  : 'Budget Exceeded!'}
              </span>
            </div>
          </div>
        </div>

        {/* Highest Spending Category Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Top Expense Category
            </span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              This Month
            </span>
          </div>

          {currentMonthTotals.highestExpenseCategory ? (
            <div className="flex items-center justify-between my-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-lg border border-amber-200/60 dark:border-amber-800/60">
                  🏆
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {currentMonthTotals.highestExpenseCategory.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {currentMonthTotals.highestExpenseCategory.percentage}% of all expenditures
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-base font-bold text-rose-600 dark:text-rose-400">
                  {formatCurrency(currentMonthTotals.highestExpenseCategory.amount, user.currency)}
                </span>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center text-xs text-slate-400">
              No expenses recorded this month yet.
            </div>
          )}

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('analytics')}
              className="w-full text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center justify-center gap-1"
            >
              View Full Category Breakdown <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 7-Day Spending Activity Mini Chart */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              7-Day Cash Flow Activity
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Daily income vs expense comparison
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Income
            </span>
            <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" /> Expense
            </span>
          </div>
        </div>

        <div className="h-48 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7DaysData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white text-xs p-2.5 rounded-xl shadow-lg border border-slate-700 space-y-1">
                        <p className="font-semibold text-slate-300">{data.date}</p>
                        <p className="text-emerald-400">
                          Income: {formatCurrency(data.income, user.currency)}
                        </p>
                        <p className="text-rose-400">
                          Expense: {formatCurrency(data.expense, user.currency)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={18} />
              <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Recent Transactions
          </h2>
          <button
            id="view-all-transactions-btn"
            onClick={() => setActiveTab('transactions')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
          >
            View All ({transactions.length}) <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No transactions recorded yet.
            </p>
            <button
              onClick={() => onOpenAddTx()}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add First Transaction
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
            {recentTransactions.map((tx) => {
              const cat = categories.find((c) => c.id === tx.categoryId);
              const pmInfo = getPaymentMethodInfo(tx.paymentMethod);
              const isExpense = tx.type === 'expense';

              return (
                <div
                  key={tx.id}
                  id={`recent-tx-${tx.id}`}
                  onClick={() => onOpenTxDetail(tx.id)}
                  className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                      style={{
                        backgroundColor: cat ? cat.bgColor : '#f1f5f9',
                        color: cat ? cat.color : '#64748b',
                      }}
                    >
                      {cat ? getCategoryIcon(cat.iconName) : <Wallet className="w-5 h-5" />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {tx.description || tx.categoryName}
                        </h4>
                        {tx.receiptUrl && (
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 px-1.5 py-0.5 rounded font-medium">
                            Receipt
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <span>{formatFriendlyDate(tx.date)}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          {pmInfo.icon}
                          {pmInfo.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-3">
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
                    <span className="block text-[11px] text-slate-400 capitalize font-medium">
                      {tx.categoryName}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
