import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, getCurrentMonthRange } from '../utils/formatters';
import { getCategoryIcon } from '../utils/icons';
import {
  Target,
  AlertTriangle,
  CheckCircle2,
  Edit3,
  Sliders,
  DollarSign,
  TrendingUp,
  ShieldAlert,
  Sparkles,
  Plus,
} from 'lucide-react';

export const BudgetManager: React.FC = () => {
  const {
    categories,
    budgets,
    updateBudgets,
    user,
    transactions,
    updateUser,
  } = useFinance();

  const { name: currentMonthName } = getCurrentMonthRange();

  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [tempLimit, setTempLimit] = useState<string>('');
  const [overallLimitInput, setOverallLimitInput] = useState<string>(
    budgets.monthlyOverallBudget.toString()
  );
  const [savingsGoalInput, setSavingsGoalInput] = useState<string>(
    budgets.savingsGoal.toString()
  );
  const [alertThreshold, setAlertThreshold] = useState<number>(
    user.budgetAlertThreshold || 80
  );
  const [showOverallEdit, setShowOverallEdit] = useState(false);

  // Calculate current month's spending per category
  const now = new Date();
  const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const currentMonthSpentByCat = React.useMemo<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    transactions.forEach((tx) => {
      if (tx.type === 'expense' && tx.date.startsWith(currentMonthPrefix)) {
        map[tx.categoryId] = (map[tx.categoryId] || 0) + tx.amount;
      }
    });
    return map;
  }, [transactions, currentMonthPrefix]);

  const totalSpentThisMonth: number = (Object.values(currentMonthSpentByCat) as number[]).reduce((a: number, b: number) => a + b, 0);
  const overallPct = Math.min(100, Math.round((totalSpentThisMonth / budgets.monthlyOverallBudget) * 100));

  const expenseCategories = categories.filter((c) => c.type === 'expense');

  const handleSaveOverallBudget = () => {
    const val = parseFloat(overallLimitInput);
    const sVal = parseFloat(savingsGoalInput);
    if (!isNaN(val) && val > 0) {
      updateBudgets({
        monthlyOverallBudget: val,
        savingsGoal: !isNaN(sVal) ? sVal : budgets.savingsGoal,
      });
    }
    updateUser({ budgetAlertThreshold: alertThreshold });
    setShowOverallEdit(false);
  };

  const handleSaveCategoryLimit = (catId: string) => {
    const parsed = parseFloat(tempLimit);
    if (!isNaN(parsed) && parsed >= 0) {
      updateBudgets({
        categoryBudgets: {
          ...budgets.categoryBudgets,
          [catId]: parsed,
        },
      });
    }
    setEditingCategoryId(null);
    setTempLimit('');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Budget Management & Goals
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Set target caps to prevent overspending and hit your savings goals for {currentMonthName}
          </p>
        </div>

        <button
          id="edit-overall-budget-btn"
          onClick={() => setShowOverallEdit(!showOverallEdit)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold self-start sm:self-auto shadow-xs transition-colors"
        >
          <Sliders className="w-4 h-4" />
          <span>{showOverallEdit ? 'Close Settings' : 'Edit Targets'}</span>
        </button>
      </div>

      {/* Target Edit Drawer / Form */}
      {showOverallEdit && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 animate-in fade-in duration-200">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Global Budget & Notification Settings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                Monthly Total Spending Cap ({user.currency.symbol})
              </label>
              <input
                id="overall-budget-input"
                type="number"
                value={overallLimitInput}
                onChange={(e) => setOverallLimitInput(e.target.value)}
                className="w-full p-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                Monthly Savings Goal ({user.currency.symbol})
              </label>
              <input
                id="savings-goal-input"
                type="number"
                value={savingsGoalInput}
                onChange={(e) => setSavingsGoalInput(e.target.value)}
                className="w-full p-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                Trigger In-App Alert at % limit
              </label>
              <select
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(Number(e.target.value))}
                className="w-full p-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
              >
                <option value={70}>70% of budget reached</option>
                <option value={80}>80% of budget reached (Recommended)</option>
                <option value={90}>90% of budget reached</option>
                <option value={100}>100% of budget reached</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowOverallEdit(false)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveOverallBudget}
              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
            >
              Save Targets
            </button>
          </div>
        </div>
      )}

      {/* Overall Budget Status Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Monthly Overall Budget</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{currentMonthName}</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {formatCurrency(totalSpentThisMonth, user.currency)}
            </span>
            <span className="text-xs text-slate-400 block font-medium">
              of {formatCurrency(budgets.monthlyOverallBudget, user.currency)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                overallPct > 90 ? 'bg-rose-500' : overallPct > 75 ? 'bg-amber-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${overallPct}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{overallPct}% utilized</span>
            <span className={budgets.monthlyOverallBudget - totalSpentThisMonth < 0 ? 'text-rose-500 font-semibold' : 'text-emerald-600 dark:text-emerald-400 font-medium'}>
              {budgets.monthlyOverallBudget - totalSpentThisMonth >= 0
                ? `${formatCurrency(budgets.monthlyOverallBudget - totalSpentThisMonth, user.currency)} left`
                : 'Limit Exceeded!'}
            </span>
          </div>
        </div>
      </div>

      {/* Category Budgets Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Category Spending Limits
          </h3>
          <span className="text-xs text-slate-500">
            Click any category to update limit
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {expenseCategories.map((cat) => {
            const limit = budgets.categoryBudgets[cat.id] || 0;
            const spent = currentMonthSpentByCat[cat.id] || 0;
            const pct = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
            const isOver = limit > 0 && spent > limit;
            const isEditing = editingCategoryId === cat.id;

            return (
              <div
                key={cat.id}
                id={`cat-budget-card-${cat.id}`}
                className={`p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all ${
                  isOver
                    ? 'border-rose-300 dark:border-rose-900/60 shadow-xs'
                    : 'border-slate-200/80 dark:border-slate-800 shadow-xs'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shadow-xs"
                      style={{ backgroundColor: cat.bgColor, color: cat.color }}
                    >
                      {getCategoryIcon(cat.iconName, 'w-5 h-5')}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {cat.name}
                      </h4>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Spent: {formatCurrency(spent, user.currency)}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          autoFocus
                          placeholder="Limit"
                          value={tempLimit}
                          onChange={(e) => setTempLimit(e.target.value)}
                          className="w-20 p-1 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800"
                        />
                        <button
                          onClick={() => handleSaveCategoryLimit(cat.id)}
                          className="p-1 rounded-lg bg-indigo-600 text-white text-xs"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingCategoryId(cat.id);
                          setTempLimit(limit.toString());
                        }}
                        className="text-right group"
                      >
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 group-hover:text-indigo-600">
                          {limit > 0 ? formatCurrency(limit, user.currency) : 'No limit'}
                          <Edit3 className="w-3 h-3 text-slate-400" />
                        </span>
                        <span className="text-[10px] text-slate-400 block font-medium">Monthly Limit</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                {limit > 0 ? (
                  <div className="space-y-1 mt-3">
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isOver
                            ? 'bg-rose-500'
                            : pct > 80
                            ? 'bg-amber-500'
                            : 'bg-indigo-600'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                      <span>{pct}% spent</span>
                      <span className={isOver ? 'text-rose-500 font-bold' : ''}>
                        {isOver
                          ? `Exceeded by ${formatCurrency(spent - limit, user.currency)}`
                          : `${formatCurrency(limit - spent, user.currency)} left`}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                    <button
                      onClick={() => {
                        setEditingCategoryId(cat.id);
                        setTempLimit('200');
                      }}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      + Set a target limit
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
