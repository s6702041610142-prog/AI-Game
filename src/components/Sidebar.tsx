import React, { useState } from 'react';
import { BookOpen, Gamepad2, Award, LogOut, CheckCircle2, Lock, Menu, X, CheckSquare, Shield } from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  user: User;
  onLogout: () => void;
}

export default function Sidebar({ currentView, setCurrentView, user, onLogout }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isAdmin = user.role === 'admin';

  const menuItems = [
    {
      id: 'pretest',
      name: 'แบบทดสอบก่อนเรียน',
      icon: CheckSquare,
      locked: false, // Pretest is never locked
      completed: user.preTestScore !== undefined,
    },
    {
      id: 'content',
      name: 'เนื้อหาบทเรียน',
      icon: BookOpen,
      locked: !isAdmin && !user.unlocked, // Locked until pretest completed unless admin
      completed: false,
    },
    {
      id: 'game',
      name: 'เกมจับคู่ฝึกสมอง',
      icon: Gamepad2,
      locked: !isAdmin && !user.unlocked,
      completed: false,
    },
    {
      id: 'posttest',
      name: 'แบบทดสอบหลังเรียน',
      icon: CheckSquare,
      locked: !isAdmin && !user.unlocked,
      completed: user.postTestScore !== undefined,
    },
    {
      id: 'results',
      name: 'คะแนนและการพัฒนา',
      icon: Award,
      locked: !isAdmin && !user.unlocked,
      completed: user.preTestScore !== undefined && user.postTestScore !== undefined,
    },
  ];

  // If user is admin, add Admin Panel menu item
  if (isAdmin) {
    menuItems.push({
      id: 'admin',
      name: 'แผงควบคุมคุณครู',
      icon: Shield,
      locked: false,
      completed: false,
    });
  }

  const handleNavClick = (itemId: string, locked: boolean) => {
    if (locked) {
      // We will handle warning in main component or let it be
      return;
    }
    setCurrentView(itemId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Hamburger Header */}
      <div className="md:hidden w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white p-4 flex items-center justify-between shadow-md sticky top-0 z-50">
        <div className="flex flex-col">
          <span className="text-xs opacity-90 font-medium">ระดับชั้น ปวช</span>
          <span className="text-base font-bold truncate max-w-[240px]">ตัวดำเนินการภาษา Python</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-xl bg-white/20 active:bg-white/30 transition-all"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white/70 backdrop-blur-xl border-r border-orange-200 text-slate-800 flex flex-col justify-between shadow-lg z-50 transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Branding Area */}
        <div className="p-6 border-b border-orange-100 bg-orange-50/20">
          <div className="inline-block px-3 py-1 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full text-[10px] font-bold text-white uppercase tracking-wider mb-2">
            ระดับชั้น ปวช
          </div>
          <h1 className="text-xl font-black text-slate-800 leading-tight mb-1">
            ตัวดำเนินการ Python
          </h1>
          <p className="text-[11px] text-orange-600 font-bold truncate">
            วิชา การเขียนโปรแกรมคอมพิวเตอร์ด้วยภาษาไพทอน
          </p>
        </div>

        {/* Current Active User Profile Card */}
        <div className="px-6 py-4 border-b border-orange-100 bg-white/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 to-amber-500 flex items-center justify-center font-bold text-white shadow-md text-sm border-2 border-white">
            {user.fullName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xs text-slate-400">ผู้เรียนปัจจุบัน:</h2>
            <p className="text-sm font-bold text-slate-700 truncate">{user.fullName}</p>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-6 space-y-2.5 overflow-y-auto">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isSelected = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id, item.locked)}
                disabled={item.locked}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all duration-200 text-left ${
                  item.locked
                    ? 'opacity-40 cursor-not-allowed hover:bg-transparent text-slate-400'
                    : isSelected
                    ? 'bg-orange-500 text-white font-semibold shadow-md shadow-orange-200 scale-[1.02]'
                    : 'text-slate-700 hover:bg-white bg-white/40 border border-slate-100/50 shadow-sm hover:text-slate-950'
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent size={18} className={isSelected ? 'text-white' : 'text-slate-500'} />
                  <span className="text-sm">{item.name}</span>
                </div>

                {/* Lock or Checkmark indicator */}
                <div>
                  {item.locked ? (
                    <Lock size={14} className="text-slate-400" />
                  ) : item.completed ? (
                    <CheckCircle2 size={16} className="text-emerald-500 stroke-[2.5]" />
                  ) : null}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Exit & Sign Out Area */}
        <div className="p-4 border-t border-orange-100 bg-orange-50/10">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 hover:text-red-700 font-bold transition-all text-sm"
          >
            <LogOut size={16} />
            ออกจากระบบ
          </button>
          <div className="text-center mt-3">
            <span className="text-[10px] text-slate-400">
              © 2026 Copyright | พัฒนาโดย Teerapol
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
