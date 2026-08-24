import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  Camera,
  Upload,
  X,
  Sparkles,
  Check,
  FileSpreadsheet,
  ScanText,
  DollarSign,
  Calendar,
} from 'lucide-react';
import { PaymentMethod } from '../types';

interface ReceiptScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptScannerModal: React.FC<ReceiptScannerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addTransaction, categories, user } = useFinance();
  const [isScanning, setIsScanning] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Extracted fields
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [isParsed, setIsParsed] = useState(false);

  if (!isOpen) return null;

  const handleSimulateScan = (presetType: 'cafe' | 'grocery' | 'fuel') => {
    setIsScanning(true);
    setIsParsed(false);

    let sampleImg = '';
    let sampleMerchant = '';
    let sampleAmount = '';
    let sampleCat = 'food';

    if (presetType === 'cafe') {
      sampleImg = 'https://images.unsplash.com/photo-1554415707-9e4c27258385?w=500&auto=format&fit=crop&q=80';
      sampleMerchant = 'Artisan Roastery & Bakery';
      sampleAmount = '24.50';
      sampleCat = 'food';
    } else if (presetType === 'grocery') {
      sampleImg = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80';
      sampleMerchant = 'Fresh Organic Supermarket';
      sampleAmount = '88.35';
      sampleCat = 'groceries';
    } else {
      sampleImg = 'https://images.unsplash.com/photo-1527018607616-05266a80e6d3?w=500&auto=format&fit=crop&q=80';
      sampleMerchant = 'Shell Station & EV Charge';
      sampleAmount = '45.00';
      sampleCat = 'travel';
    }

    setImagePreview(sampleImg);

    setTimeout(() => {
      setMerchant(sampleMerchant);
      setAmount(sampleAmount);
      setCategory(sampleCat);
      setIsScanning(false);
      setIsParsed(true);
    }, 1200);
  };

  const handleSaveScannedTx = () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    const catObj = categories.find((c) => c.id === category);

    addTransaction({
      type: 'expense',
      amount: parsedAmount,
      categoryId: category,
      categoryName: catObj ? catObj.name : 'Scanned Receipt',
      date,
      description: merchant || 'Receipt Expense',
      paymentMethod,
      tags: ['receipt', 'auto-scanned'],
      receiptUrl: imagePreview || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="receipt-scanner-modal"
        className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col max-h-[90vh]"
      >
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <ScanText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Smart Bill & Receipt Scanner
              </h3>
              <p className="text-[11px] text-slate-500">
                Instant extraction from photos or invoices
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Preset Buttons for instant realistic testing */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-500 block">
              Simulate Instant Photo Capture
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSimulateScan('cafe')}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
              >
                ☕ Café Bill
              </button>
              <button
                type="button"
                onClick={() => handleSimulateScan('grocery')}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
              >
                🛒 Groceries
              </button>
              <button
                type="button"
                onClick={() => handleSimulateScan('fuel')}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
              >
                ⛽ Fuel Station
              </button>
            </div>
          </div>

          {/* Image Preview & Scanning State */}
          <div className="relative rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 h-44 overflow-hidden flex items-center justify-center bg-slate-50 dark:bg-slate-800/50">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Uploaded Receipt"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-4 text-slate-400 space-y-2">
                <Camera className="w-8 h-8 mx-auto text-slate-400" />
                <p className="text-xs font-medium">
                  Tap one of the buttons above or drop a receipt image
                </p>
              </div>
            )}

            {isScanning && (
              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-2 animate-in fade-in">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-semibold">Extracting Merchant, Total & Category...</span>
              </div>
            )}
          </div>

          {/* Extracted Data Verification Form */}
          {isParsed && (
            <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 space-y-3 animate-in fade-in">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 dark:text-indigo-300">
                <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Data Extracted Successfully
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-500 block">Merchant Name</label>
                  <input
                    type="text"
                    value={merchant}
                    onChange={(e) => setMerchant(e.target.value)}
                    className="w-full p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-semibold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 block">Total Amount ({user.currency.symbol})</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-bold text-rose-600"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 block">Assigned Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                  >
                    {categories.filter((c) => c.type === 'expense').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 block">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                  >
                    <option value="credit_card">Credit Card</option>
                    <option value="debit_card">Debit Card</option>
                    <option value="upi">UPI</option>
                    <option value="cash">Cash</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveScannedTx}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors"
              >
                Confirm & Add Expense
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
