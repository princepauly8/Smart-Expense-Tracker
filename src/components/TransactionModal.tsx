import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { getCategoryIcon } from '../utils/icons';
import {
  X,
  Plus,
  Calendar,
  Clock,
  FileText,
  Tag,
  CreditCard,
  Camera,
  Check,
  Sparkles,
} from 'lucide-react';
import { PaymentMethod, Transaction, TransactionType } from '../types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editTxId?: string | null;
  initialType?: TransactionType;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  editTxId,
  initialType = 'expense',
}) => {
  const {
    transactions,
    categories,
    user,
    addTransaction,
    editTransaction,
    addCategory,
  } = useFinance();

  const [type, setType] = useState<TransactionType>(initialType);
  const [amount, setAmount] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>(
    new Date().toTimeString().split(' ')[0].substring(0, 5)
  );
  const [description, setDescription] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [tagInput, setTagInput] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [receiptUrl, setReceiptUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Category Creation state
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#3b82f6');

  // Filter categories by type
  const availableCategories = categories.filter((c) => c.type === type);

  // Populate data when editing
  useEffect(() => {
    if (editTxId) {
      const existing = transactions.find((t) => t.id === editTxId);
      if (existing) {
        setType(existing.type);
        setAmount(existing.amount.toString());
        setCategoryId(existing.categoryId);
        setDate(existing.date);
        setTime(existing.time || '12:00');
        setDescription(existing.description);
        setPaymentMethod(existing.paymentMethod);
        setTags(existing.tags || []);
        setReceiptUrl(existing.receiptUrl || '');
        return;
      }
    }

    // Default initialization for new transaction
    setType(initialType);
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setTime(new Date().toTimeString().split(' ')[0].substring(0, 5));
    setDescription('');
    setTags([]);
    setReceiptUrl('');

    const firstCat = categories.find((c) => c.type === initialType);
    if (firstCat) setCategoryId(firstCat.id);
  }, [editTxId, initialType, isOpen]);

  // When type changes, ensure valid category is selected
  useEffect(() => {
    const currentCatValid = categories.some((c) => c.id === categoryId && c.type === type);
    if (!currentCatValid) {
      const firstOfType = categories.find((c) => c.type === type);
      if (firstOfType) setCategoryId(firstOfType.id);
    }
  }, [type, categories]);

  if (!isOpen) return null;

  const handleAddQuickAmount = (val: number) => {
    const current = parseFloat(amount) || 0;
    setAmount((current + val).toFixed(2));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim().toLowerCase())) {
      setTags([...tags, tagInput.trim().toLowerCase().replace(/^#/, '')]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleCreateNewCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    addCategory({
      name: newCatName.trim(),
      iconName: 'CircleEllipsis',
      color: newCatColor,
      bgColor: `${newCatColor}20`,
      type,
    });

    setNewCatName('');
    setIsCreatingCategory(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Please enter a valid amount greater than 0.');
      return;
    }

    const selectedCategory = categories.find((c) => c.id === categoryId);
    const categoryName = selectedCategory ? selectedCategory.name : 'General';

    setIsSubmitting(true);

    if (editTxId) {
      editTransaction(editTxId, {
        type,
        amount: parsedAmount,
        categoryId,
        categoryName,
        date,
        time,
        description: description.trim() || categoryName,
        paymentMethod,
        tags,
        receiptUrl: receiptUrl || undefined,
      });
    } else {
      addTransaction({
        type,
        amount: parsedAmount,
        categoryId,
        categoryName,
        date,
        time,
        description: description.trim() || categoryName,
        paymentMethod,
        tags,
        receiptUrl: receiptUrl || undefined,
      });
    }

    setIsSubmitting(false);
    onClose();
  };

  const handleSimulateReceiptUpload = () => {
    // Simulated receipt placeholder
    const sampleReceipts = [
      'https://images.unsplash.com/photo-1554415707-9e4c27258385?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=500&auto=format&fit=crop&q=80',
    ];
    setReceiptUrl(sampleReceipts[Math.floor(Math.random() * sampleReceipts.length)]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="transaction-modal-container"
        className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {editTxId ? 'Edit Transaction' : 'Record Transaction'}
          </h3>
          <button
            id="close-transaction-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          {/* Type Toggle: Expense vs Income */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
            <button
              type="button"
              id="type-toggle-expense"
              onClick={() => setType('expense')}
              className={`py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                type === 'expense'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>💸 Expense</span>
            </button>
            <button
              type="button"
              id="type-toggle-income"
              onClick={() => setType('income')}
              className={`py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                type === 'income'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>💰 Income</span>
            </button>
          </div>

          {/* Amount Large Display */}
          <div className="text-center py-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Amount ({user.currency.code})
            </label>
            <div className="inline-flex items-center justify-center gap-1 w-full">
              <span className="text-2xl font-bold text-slate-400">{user.currency.symbol}</span>
              <input
                id="tx-amount-input"
                type="number"
                step="0.01"
                min="0.01"
                required
                autoFocus
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`text-3xl sm:text-4xl font-extrabold w-48 text-center bg-transparent border-b-2 focus:outline-hidden transition-colors ${
                  type === 'expense'
                    ? 'text-rose-600 dark:text-rose-400 border-rose-500/40 focus:border-rose-500'
                    : 'text-emerald-600 dark:text-emerald-400 border-emerald-500/40 focus:border-emerald-500'
                }`}
              />
            </div>

            {/* Quick Amount Chips */}
            <div className="flex items-center justify-center gap-1.5 mt-2.5">
              {[10, 25, 50, 100, 500].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleAddQuickAmount(val)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  +{user.currency.symbol}{val}
                </button>
              ))}
            </div>
          </div>

          {/* Category Selector Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Select Category
              </label>
              <button
                type="button"
                onClick={() => setIsCreatingCategory(!isCreatingCategory)}
                className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> New Category
              </button>
            </div>

            {isCreatingCategory && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <input
                  type="text"
                  placeholder="Category Name (e.g. Pet Care, Subscriptions)"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {['#f97316', '#10b981', '#0ea5e9', '#ec4899', '#8b5cf6', '#ef4444'].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewCatColor(color)}
                        className={`w-5 h-5 rounded-full border-2 ${
                          newCatColor === color ? 'border-slate-900 dark:border-white scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleCreateNewCategory}
                    className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-[11px] font-semibold"
                  >
                    Save Category
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-40 overflow-y-auto p-1">
              {availableCategories.map((cat) => {
                const isSelected = categoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    id={`cat-select-${cat.id}`}
                    onClick={() => setCategoryId(cat.id)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:border-indigo-500 font-bold scale-[1.02]'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center mb-1 shadow-xs"
                      style={{
                        backgroundColor: cat.bgColor,
                        color: cat.color,
                      }}
                    >
                      {getCategoryIcon(cat.iconName, 'w-4 h-4')}
                    </div>
                    <span className="text-[11px] text-slate-700 dark:text-slate-300 truncate w-full text-center">
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description / Merchant Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Description / Merchant
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="tx-description-input"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Starbucks Latte, Netflix, Salary..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Date
              </label>
              <div className="relative">
                <input
                  id="tx-date-input"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Time
              </label>
              <div className="relative">
                <input
                  id="tx-time-input"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Payment Method
            </label>
            <select
              id="tx-payment-method-select"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-full p-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              <option value="credit_card">💳 Credit Card</option>
              <option value="debit_card">💳 Debit Card</option>
              <option value="cash">💵 Cash</option>
              <option value="bank_transfer">🏛️ Bank Transfer</option>
              <option value="upi">📱 UPI / Instant Payment</option>
              <option value="mobile_wallet">👛 Mobile Wallet</option>
              <option value="crypto">🪙 Crypto</option>
              <option value="other">❓ Other</option>
            </select>
          </div>

          {/* Tags & Receipt Attachment */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Tags & Receipt Attachment
            </label>

            {/* Tag Input */}
            <div className="flex gap-1.5">
              <input
                type="text"
                placeholder="Add tag (e.g. food, trip, tax)..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 text-xs rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold"
              >
                Add Tag
              </button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 text-[11px] bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="hover:text-rose-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Receipt Upload / Preview */}
            <div className="flex items-center gap-2 pt-1">
              {receiptUrl ? (
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-full">
                  <img
                    src={receiptUrl}
                    alt="Receipt"
                    className="w-10 h-10 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block truncate">
                      Receipt Attached
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                      Verified
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReceiptUrl('')}
                    className="text-xs text-rose-500 hover:underline p-1"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSimulateReceiptUpload}
                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs font-medium text-slate-600 dark:text-slate-300 transition-colors"
                >
                  <Camera className="w-4 h-4 text-slate-400" />
                  <span>Attach Receipt / Invoice</span>
                </button>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-3 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              id="save-transaction-btn"
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-2.5 rounded-xl font-semibold text-xs text-white shadow-xs transition-all ${
                type === 'expense'
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {editTxId ? 'Save Changes' : `Save ${type === 'expense' ? 'Expense' : 'Income'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
