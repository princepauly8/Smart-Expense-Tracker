import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Smartphone,
  FolderTree,
  FileCode2,
  Terminal,
} from 'lucide-react';
import JSZip from 'jszip';
import { ANDROID_PROJECT_FILES } from '../data/androidKotlinData';

export const AndroidSourceViewer: React.FC = () => {
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const currentFile = ANDROID_PROJECT_FILES[selectedFileIndex] || ANDROID_PROJECT_FILES[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      // Create Android Project Structure
      const rootFolder = zip.folder('CampusPulse-Android-Project');

      // Add README
      rootFolder?.file(
        'README.md',
        `# CampusPulse AI - Android Application
Intelligent College Student Companion Built with Kotlin & Jetpack Compose.

## Architecture:
- MVVM (Model-View-ViewModel) + Clean Architecture
- Jetpack Compose & Material Design 3
- Gemini AI SDK Integration (Client & Server proxy)
- Retrofit 2 + Kotlin Coroutines & Flow
- Room Local Cache & Offline First Persistence
- Firebase Cloud Messaging (FCM)

## Setup in Android Studio:
1. Open this directory in Android Studio (Giraffe or newer).
2. Sync Gradle dependencies.
3. Configure your backend endpoint in \`CampusApiService.kt\`.
4. Run on your Android emulator or physical device.
`
      );

      // Add each file
      ANDROID_PROJECT_FILES.forEach((f) => {
        rootFolder?.file(f.filePath, f.code);
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'CampusPulseAI-Android-Kotlin-Project.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto pb-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  Android Studio Kotlin Codebase
                </h2>
                <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-md">
                  Jetpack Compose & MVVM
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Production-ready Kotlin source files, ViewModels, Room DB & Retrofit client for
                Android Studio
              </p>
            </div>
          </div>

          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>
              {isZipping ? 'Packaging ZIP...' : 'Download Android Studio Starter (.ZIP)'}
            </span>
          </button>
        </div>

        {/* Architecture Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl">
            <span className="text-[10px] text-slate-400 font-bold block">UI Framework</span>
            <span className="font-bold text-slate-900 dark:text-white">Jetpack Compose M3</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl">
            <span className="text-[10px] text-slate-400 font-bold block">Architecture</span>
            <span className="font-bold text-slate-900 dark:text-white">MVVM + StateFlow</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl">
            <span className="text-[10px] text-slate-400 font-bold block">AI Engine</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">Gemini Flash SDK</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl">
            <span className="text-[10px] text-slate-400 font-bold block">Local Persistence</span>
            <span className="font-bold text-slate-900 dark:text-white">Room SQLite DB</span>
          </div>
        </div>
      </div>

      {/* Code Viewer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* File Explorer Sidebar */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
            <FolderTree className="w-4 h-4 text-emerald-600" />
            <span>Android Project File Tree</span>
          </div>

          <div className="space-y-1">
            {ANDROID_PROJECT_FILES.map((file, idx) => {
              const isSelected = idx === selectedFileIndex;
              return (
                <button
                  key={file.fileName}
                  onClick={() => setSelectedFileIndex(idx)}
                  className={`w-full text-left p-2.5 rounded-2xl text-xs transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileCode2 className="w-4 h-4 shrink-0 text-slate-400" />
                    <div className="truncate">
                      <div className="truncate">{file.fileName}</div>
                      <div className="text-[10px] text-slate-400 font-normal truncate">
                        {file.category.toUpperCase()} • {file.description}
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {file.language}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Code Content Window */}
        <div className="lg:col-span-8 bg-slate-950 text-slate-100 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col">
          {/* File Header Bar */}
          <div className="p-3 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-slate-200">
                {currentFile.filePath}
              </span>
            </div>

            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Code Viewer Body */}
          <div className="p-4 overflow-x-auto font-mono text-xs leading-relaxed text-slate-300 max-h-[550px] overflow-y-auto no-scrollbar">
            <pre>
              <code>{currentFile.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
