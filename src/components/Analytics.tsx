import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';
import { getCategoryIcon } from '../utils/icons';
import {
  PieChart as PieChartIcon,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';

type TimeFrame = 'week' | 'month' | 'last_month' | 'year' | 'all';

export const Analytics: React.FC = () => {
  const { transactions, categories, user } = useFinance();
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('month');

  // Filter transactions according to selected timeframe
  const filteredTxs = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    return transactions.filter((tx) => {
      const [y, m, d] = tx.date.split('-').map(Number);
      const txDate = new Date(y, m - 1, d);

      if (timeFrame === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return txDate >= weekAgo;
      }
      if (timeFrame === 'month') {
        return txDate.getFullYear() === currentYear && txDate.getMonth() === currentMonth;
      }
      if (timeFrame === 'last_month') {
        const targetMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const targetYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        return txDate.getFullYear() === targetYear && txDate.getMonth() === targetMonth;
      }
      if (timeFrame === 'year') {
        return txDate.getFullYear() === currentYear;
      }
      return true; // 'all'
    });
  }, [transactions, timeFrame]);

  // Compute Metrics
  const summary = useMemo(() => {
    let income = 0;
    let expense = 0;
    const catMap: Record<string, { id: string; name: string; amount: number; color: string }> = {};
    const pmMap: Record<string, number> = {};

    filteredTxs.forEach((tx) => {
      if (tx.type === 'income') {
        income += tx.amount;
      } else {
        expense += tx.amount;
        const cat = categories.find((c) => c.id === tx.categoryId);
        const catColor = cat ? cat.color : '#64748b';

        if (!catMap[tx.categoryId]) {
          catMap[tx.categoryId] = {
            id: tx.categoryId,
            name: tx.categoryName,
            amount: 0,
            color: catColor,
          };
        }
        catMap[tx.categoryId].amount += tx.amount;

        pmMap[tx.paymentMethod] = (pmMap[tx.paymentMethod] || 0) + tx.amount;
      }
    });

    const categoryBreakdown = Object.values(catMap)
      .map((item) => ({
        ...item,
        percentage: expense > 0 ? Math.round((item.amount / expense) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    const netSavings = income - expense;
    const savingsRatio = income > 0 ? Math.round(((income - expense) / income) * 100) : 0;
    const expenseRatio = income > 0 ? Math.round((expense / income) * 100) : 100;

    return {
      income,
      expense,
      netSavings,
      savingsRatio,
      expenseRatio,
      categoryBreakdown,
      paymentMethodBreakdown: Object.entries(pmMap).map(([method, amount]) => ({
        method,
        amount,
        percentage: expense > 0 ? Math.round((amount / expense) * 100) : 0,
      })),
    };
  }, [filteredTxs, categories]);

  // Periodic Comparison Chart (e.g. Monthly / Daily breakdown)
  const comparisonData = useMemo(() => {
    // Group by either Day or Month based on timeframe
    if (timeFrame === 'week' || timeFrame === 'month') {
      // Group by Date
      const dateMap: Record<string, { label: string; income: number; expense: number }> = {};
      filteredTxs.forEach((tx) => {
        const label = tx.date.substring(5); // MM-DD
        if (!dateMap[label]) {
          dateMap[label] = { label, income: 0, expense: 0 };
        }
        if (tx.type === 'income') dateMap[label].income += tx.amount;
        else dateMap[label].expense += tx.amount;
      });
      return Object.values(dateMap).slice(-10);
    } else {
      // Group by Month (Jan, Feb, etc.)
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthMap: Record<string, { label: string; income: number; expense: number }> = {};

      monthNames.forEach((m) => {
        monthMap[m] = { label: m, income: 0, expense: 0 };
      });

      filteredTxs.forEach((tx) => {
        const monthIdx = parseInt(tx.date.split('-')[1], 10) - 1;
        const mName = monthNames[monthIdx];
        if (mName && monthMap[mName]) {
          if (tx.type === 'income') monthMap[mName].income += tx.amount;
          else monthMap[mName].expense += tx.amount;
        }
      });

      return Object.values(monthMap).filter((item) => item.income > 0 || item.expense > 0);
    }
  }, [filteredTxs, timeFrame]);

  return (
    <div className="space-y-6 pb-16">
      {/* Header & Timeframe Switcher */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Reports & Financial Analytics
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Visual insights into your income streams and spending patterns
            </p>
          </div>

          {/* Timeframe Chips */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs self-start sm:self-auto overflow-x-auto no-scrollbar">
            {[
              { id: 'week', label: '7 Days' },
              { id: 'month', label: 'This Month' },
              { id: 'last_month', label: 'Last Month' },
              { id: 'year', label: 'This Year' },
              { id: 'all', label: 'All Time' },
            ].map((tf) => (
              <button
                key={tf.id}
                id={`timeframe-${tf.id}`}
                onClick={() => setTimeFrame(tf.id as TimeFrame)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                  timeFrame === tf.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>

        {/* Analytics Key Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
              Total Income
            </span>
            <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-1 block">
              {formatCurrency(summary.income, user.currency)}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
              Total Expenses
            </span>
            <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-1 block">
              {formatCurrency(summary.expense, user.currency)}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
              Net Savings
            </span>
            <span
              className={`text-lg sm:text-xl font-extrabold mt-1 block ${
                summary.netSavings >= 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {formatCurrency(summary.netSavings, user.currency)}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
              Savings Rate
            </span>
            <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-1 block">
              {summary.savingsRatio}%
            </span>
          </div>
        </div>
      </div>

      {/* Income vs Expenses Cash Flow Comparison Chart */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              Cash Flow Trend
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Comparative income inflows vs expense outflows
            </p>
          </div>
        </div>

        <div className="h-64 w-full">
          {comparisonData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              No transactions for this timeframe.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white text-xs p-3 rounded-xl shadow-lg border border-slate-700 space-y-1">
                          <p className="font-bold text-slate-200">{data.label}</p>
                          <p className="text-emerald-400">
                            Income: {formatCurrency(data.income, user.currency)}
                          </p>
                          <p className="text-rose-400">
                            Expense: {formatCurrency(data.expense, user.currency)}
                          </p>
                          <p className="text-slate-300 font-mono text-[10px] pt-0.5 border-t border-slate-700">
                            Net: {formatCurrency(data.income - data.expense, user.currency)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Income" />
                <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Category-Wise Expense Donut & Ranking */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Donut Chart */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-indigo-600" />
              Category Breakdown
            </h3>
            <span className="text-xs font-medium text-slate-500">
              {summary.categoryBreakdown.length} active
            </span>
          </div>

          <div className="h-56 w-full relative flex items-center justify-center">
            {summary.categoryBreakdown.length === 0 ? (
              <div className="text-xs text-slate-400">No expenses recorded.</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={summary.categoryBreakdown}
                      dataKey="amount"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={3}
                    >
                      {summary.categoryBreakdown.map((entry) => (
                        <Cell key={entry.id} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const item = payload[0].payload;
                          return (
                            <div className="bg-slate-900 text-white text-xs p-2.5 rounded-xl shadow-lg border border-slate-700">
                              <p className="font-bold">{item.name}</p>
                              <p className="text-rose-400">
                                {formatCurrency(item.amount, user.currency)} ({item.percentage}%)
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Spent</span>
                  <span className="text-xs font-extrabold text-slate-800 dark:text-white">
                    {formatCurrency(summary.expense, user.currency)}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Category Ranking List */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Top Spending Categories
          </h3>

          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {summary.categoryBreakdown.length === 0 ? (
              <div className="text-xs text-slate-400 py-8 text-center">
                No categorized spending yet.
              </div>
            ) : (
              summary.categoryBreakdown.map((cat, idx) => (
                <div key={cat.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {idx + 1}. {cat.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {formatCurrency(cat.amount, user.currency)}
                      </span>
                      <span className="text-[10px] text-slate-400 ml-1.5 font-medium">
                        ({cat.percentage}%)
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${cat.percentage}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Spending Habits & Financial Health Insight Box */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              Smart Financial Insights
            </h3>
            <p className="text-xs text-slate-400">Automated spending heuristics and optimization</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1">
            <span className="font-semibold text-slate-200 block">
              💡 Budget Health Score
            </span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              {summary.savingsRatio >= 20
                ? 'Excellent financial health! You are saving over 20% of your earnings this period.'
                : 'Consider optimizing your discretionary purchases to bring savings closer to 20%.'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1">
            <span className="font-semibold text-slate-200 block">
              📊 Expense Velocity
            </span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              {summary.categoryBreakdown.length > 0
                ? `Your heaviest spending is focused in ${summary.categoryBreakdown[0].name}, making up ${summary.categoryBreakdown[0].percentage}% of expenditures.`
                : 'Log more transactions to unlock automated spending velocity insights.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
