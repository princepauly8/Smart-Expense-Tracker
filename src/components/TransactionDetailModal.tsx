import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatFriendlyDate } from '../utils/formatters';
import { getCategoryIcon, getPaymentMethodInfo } from '../utils/icons';
import {
  X,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  CreditCard,
  Tag,
  FileText,
  Receipt,
} from 'lucide-react';

interface TransactionDetailModalProps {
  txId: string | null;
  onClose: () => void;
  onEdit: (txId: string) => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  txId,
  onClose,
  onEdit,
}) => {
  const { transactions, categories, user, deleteTransaction } = useFinance();

  if (!txId) return null;
  const tx = transactions.find((t) => t.id === txId);
  if (!tx) return null;

  const cat = categories.find((c) => c.id === tx.categoryId);
  const pmInfo = getPaymentMethodInfo(tx.paymentMethod);
  const isExpense = tx.type === 'expense';

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this transaction record?')) {
      deleteTransaction(tx.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="tx-detail-modal-container"
        className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col"
      >
        {/* Header with Category Color Theme */}
        <div
          className="p-6 text-center relative"
          style={{
            backgroundColor: cat ? cat.bgColor : '#f1f5f9',
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/60 dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 hover:bg-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-xs mb-2"
            style={{
              backgroundColor: cat ? cat.color : '#4f46e5',
              color: '#ffffff',
            }}
          >
            {cat ? getCategoryIcon(cat.iconName, 'w-7 h-7') : <Receipt className="w-7 h-7" />}
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            {tx.categoryName}
          </span>
          <div
            className={`text-2xl sm:text-3xl font-extrabold mt-0.5 ${
              isExpense ? 'text-rose-600' : 'text-emerald-600'
            }`}
          >
            {isExpense ? '-' : '+'}
            {formatCurrency(tx.amount, user.currency)}
          </div>
          <span className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/80 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 mt-1">
            {tx.type === 'expense' ? 'Expense Record' : 'Income Deposit'}
          </span>
        </div>

        {/* Transaction Body Specs */}
        <div className="p-5 space-y-4 flex-1 overflow-y-auto">
          <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {/* Description */}
            <div className="flex items-start justify-between pt-2">
              <span className="text-slate-500 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-400" /> Description
              </span>
              <span className="font-semibold text-slate-900 dark:text-white max-w-[200px] text-right">
                {tx.description}
              </span>
            </div>

            {/* Date & Time */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" /> Date & Time
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {formatFriendlyDate(tx.date)} {tx.time ? `at ${tx.time}` : ''}
              </span>
            </div>

            {/* Payment Method */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-500 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-slate-400" /> Payment Method
              </span>
              <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                {pmInfo.icon} {pmInfo.label}
              </span>
            </div>

            {/* Tags */}
            {tx.tags && tx.tags.length > 0 && (
              <div className="flex items-start justify-between pt-2">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-slate-400" /> Tags
                </span>
                <div className="flex flex-wrap gap-1 justify-end max-w-[200px]">
                  {tx.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Attached Receipt Image */}
            {tx.receiptUrl && (
              <div className="pt-2 space-y-1.5">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-slate-400" /> Attached Receipt
                </span>
                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-48">
                  <img
                    src={tx.receiptUrl}
                    alt="Receipt"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => {
                onClose();
                onEdit(tx.id);
              }}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit Record
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
