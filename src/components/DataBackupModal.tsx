import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  Download,
  Upload,
  Database,
  FileSpreadsheet,
  FileCode,
  RotateCcw,
  X,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface DataBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataBackupModal: React.FC<DataBackupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    transactions,
    exportDataCSV,
    exportDataJSON,
    importDataJSON,
    resetDemoData,
  } = useFinance();

  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDataJSON(content);
        if (success) {
          setImportStatus('Backup restored successfully!');
          setTimeout(() => {
            setImportStatus(null);
            onClose();
          }, 1500);
        } else {
          setImportStatus('Failed to parse backup JSON file.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="backup-modal-container"
        className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col"
      >
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Data Backup & Synchronization
              </h3>
              <p className="text-[11px] text-slate-500">
                Export to spreadsheets, save JSON snapshots, or restore
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

        <div className="p-5 space-y-4">
          {importStatus && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                importStatus.includes('successfully')
                  ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                  : 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60'
              }`}
            >
              {importStatus.includes('successfully') ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              )}
              {importStatus}
            </div>
          )}

          {/* Export Options */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider">
              Export Data ({transactions.length} Records)
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={exportDataCSV}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60 text-left transition-colors flex flex-col justify-between group"
              >
                <FileSpreadsheet className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Export CSV
                  </span>
                  <span className="text-[10px] text-slate-500">
                    For Excel & Google Sheets
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={exportDataJSON}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60 text-left transition-colors flex flex-col justify-between group"
              >
                <FileCode className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Export JSON
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Full configuration snapshot
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Import / Restore Section */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider">
              Import & Restore
            </span>

            <label className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors">
              <Upload className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Select JSON Backup File</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Reset Demo Data */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">Reset to default sandbox data:</span>
            <button
              onClick={() => {
                if (confirm('Reset to initial sample demo data?')) {
                  resetDemoData();
                  onClose();
                }
              }}
              className="flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
            >
              <RotateCcw className="w-3 h-3" /> Reset Sample
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
