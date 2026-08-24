import React from 'react';
import { useCampus } from '../context/CampusContext';
import { QrCode, X, GraduationCap, ShieldCheck, Download, Sparkles } from 'lucide-react';

export const StudentIDCardModal: React.FC = () => {
  const { isIdCardOpen, setIsIdCardOpen, currentStudent } = useCampus();

  if (!isIdCardOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95">
      <div className="relative max-w-sm w-full">
        {/* Close Button */}
        <button
          onClick={() => setIsIdCardOpen(false)}
          className="absolute -top-12 right-0 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Digital ID Card Chassis */}
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-violet-950 text-white rounded-[28px] border border-white/25 shadow-2xl p-6 relative overflow-hidden ring-1 ring-white/20">
          {/* Subtle hologram sheen effect */}
          <div className="absolute -top-24 -right-24 w-52 h-52 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-52 h-52 bg-violet-500/20 rounded-full blur-3xl" />

          {/* College Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/15 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black tracking-wider uppercase">APEX INSTITUTE</h3>
                <p className="text-[9px] text-indigo-200 tracking-tight">OF TECHNOLOGY & SCIENCE</p>
              </div>
            </div>
            <span className="text-[9px] font-mono bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold px-2 py-0.5 rounded-full uppercase">
              Active Student
            </span>
          </div>

          {/* Student Photo & Credentials */}
          <div className="my-5 flex items-center gap-4 relative z-10">
            <div className="relative">
              <img
                src={currentStudent.avatarUrl}
                alt={currentStudent.name}
                className="w-20 h-20 rounded-2xl object-cover ring-2 ring-indigo-400 shadow-xl"
              />
              <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] ring-2 ring-slate-900 font-bold">
                ✓
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-base font-black tracking-tight text-white truncate">
                {currentStudent.name}
              </h2>
              <p className="text-xs text-indigo-300 font-semibold">{currentStudent.major}</p>
              <p className="text-[10px] text-slate-300 font-mono mt-0.5">
                ID: {currentStudent.studentId}
              </p>
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className="text-[9px] bg-white/10 px-2 py-0.5 rounded-md font-semibold text-slate-200">
                  Semester {currentStudent.semester}
                </span>
                <span className="text-[9px] bg-white/10 px-2 py-0.5 rounded-md font-semibold text-slate-200">
                  Batch 2026
                </span>
              </div>
            </div>
          </div>

          {/* Barcode & Security Hologram */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 relative z-10 text-center space-y-2">
            {/* Simulated Clean Barcode */}
            <div className="h-10 bg-white rounded-lg p-1.5 flex items-center justify-center gap-0.5 overflow-hidden">
              {Array.from({ length: 42 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-950 h-full rounded-sm"
                  style={{
                    width: i % 4 === 0 ? '3px' : i % 3 === 0 ? '2px' : '1px',
                    marginRight: i % 5 === 0 ? '2px' : '1px',
                  }}
                />
              ))}
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-indigo-200 px-1">
              <span>SCAN FOR CAMPUS ENTRY</span>
              <span>EXP: 06/2027</span>
            </div>
          </div>

          {/* Access Permissions */}
          <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-[10px] text-indigo-200/80 relative z-10">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Library & Lab Authorized
            </span>
            <span className="text-slate-400">NFC Gate Verified</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-3 flex justify-center">
          <button
            onClick={() => setIsIdCardOpen(false)}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold shadow-lg transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
