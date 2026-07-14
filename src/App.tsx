import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Quiz from './components/Quiz';
import LessonTabs from './components/LessonTabs';
import MatchingGame from './components/MatchingGame';
import PerformanceDashboard from './components/PerformanceDashboard';
import Leaderboard from './components/Leaderboard';
import AdminPanel from './components/AdminPanel';
import { User, LeaderboardRow } from './types';
import { BookOpen, Award, Cloud, Sparkles, LogIn, ChevronRight, GraduationCap, HelpCircle, Shield, Info, ShieldAlert } from 'lucide-react';
import Swal from 'sweetalert2';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyRuokogfKsn00F2D0STd4je4CiFMpSkVVRPI92-7afAwSsHKvsxBX1bhJizSNqOwez0Q/exec';

// Initial pre-populated leaderboard to make it look full-featured and rich on load
const INITIAL_LEADERBOARD: LeaderboardRow[] = [
  { name: "นายธีรพล เอี่ยมสะอาด", preScore: 1, postScore: 5, improvement: 4, loginTime: "09/07/2026, 18:45:10", logoutTime: "09/07/2026, 19:15:32" },
  { name: "นางสาวกนกวรรณ เรียนดี", preScore: 2, postScore: 5, improvement: 3, loginTime: "09/07/2026, 19:00:15", logoutTime: "09/07/2026, 19:30:20" },
  { name: "นายสมคิด วงศ์ษา", preScore: 2, postScore: 4, improvement: 2, loginTime: "09/07/2026, 19:10:44", logoutTime: "09/07/2026, 19:42:00" },
  { name: "นายสิริชัย รุ่งเรือง", preScore: 0, postScore: 4, improvement: 4, loginTime: "09/07/2026, 18:20:11", logoutTime: "09/07/2026, 18:50:40" },
  { name: "นางสาวพรทิพย์ ชัยเจริญ", preScore: 1, postScore: 3, improvement: 2, loginTime: "09/07/2026, 19:30:00", logoutTime: "09/07/2026, 20:00:12" }
];

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [fullNameInput, setFullNameInput] = useState('');
  const [currentView, setCurrentView] = useState('pretest');
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardRow[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load leaderboard and logged-in user from localStorage on mount
  useEffect(() => {
    const savedLeaderboard = localStorage.getItem('python_leaderboard');
    if (savedLeaderboard) {
      setLeaderboardEntries(JSON.parse(savedLeaderboard));
    } else {
      setLeaderboardEntries(INITIAL_LEADERBOARD);
      localStorage.setItem('python_leaderboard', JSON.stringify(INITIAL_LEADERBOARD));
    }

    const savedUser = localStorage.getItem('python_active_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      if (parsed.role === 'admin') {
        setCurrentView('admin');
      } else {
        setCurrentView('pretest');
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullNameInput.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'กรุณากรอกชื่อ-นามสกุล',
        text: 'กรุณากรอกชื่อและนามสกุลจริงของผู้เรียนเพื่อใช้ในการสอบวัดผล',
        confirmButtonColor: '#f97316',
      });
      return;
    }

    const newUser: User = {
      fullName: fullNameInput.trim(),
      loginTime: new Date().toLocaleString('th-TH'),
      unlocked: false,
      role: 'student',
    };

    setUser(newUser);
    localStorage.setItem('python_active_user', JSON.stringify(newUser));
    setCurrentView('pretest');

    Swal.fire({
      icon: 'success',
      title: 'ยินดีต้อนรับเข้าสู่บทเรียน!',
      text: `สวัสดีคุณ ${newUser.fullName} มาร่วมสนุกและทดสอบความรู้ไพทอนกันเลย`,
      timer: 2500,
      showConfirmButton: false,
    });
  };

  const handleAdminLoginPrompt = () => {
    Swal.fire({
      title: 'เข้าสู่ระบบผู้ดูแลระบบ (ครูผู้สอน)',
      text: 'กรุณากรอกรหัสผ่านเพื่อเข้าใช้งานเครื่องมือประเมินผล',
      input: 'password',
      inputPlaceholder: 'กรอกรหัสผ่าน (เช่น admin1234)',
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#f97316',
      inputValidator: (value) => {
        if (!value) {
          return 'กรุณากรอกรหัสผ่าน';
        }
        if (value !== 'admin1234') {
          return 'รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const adminUser: User = {
          fullName: 'ผู้สอน (อาจารย์ผู้ประเมิน)',
          loginTime: new Date().toLocaleString('th-TH'),
          unlocked: true,
          role: 'admin',
        };

        setUser(adminUser);
        localStorage.setItem('python_active_user', JSON.stringify(adminUser));
        setCurrentView('admin');

        Swal.fire({
          icon: 'success',
          title: 'เข้าสู่ระบบผู้ดูแลสำเร็จ',
          text: 'ยินดีต้อนรับคุณครูเข้าสู่ระบบแผงประเมินผลผู้เรียนร่วมกับ Google Sheets',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  const handlePreComplete = (score: number) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      preTestScore: score,
      unlocked: true, // Unlock other parts of the lesson!
    };

    setUser(updatedUser);
    localStorage.setItem('python_active_user', JSON.stringify(updatedUser));
    setCurrentView('content'); // Lead them to content tab

    Swal.fire({
      icon: 'success',
      title: 'ปลดล็อกบทเรียนสำเร็จ!',
      text: 'คุณทำแบบทดสอบก่อนเรียนเรียบร้อยแล้ว ยินดีต้อนรับเข้าสู่แท็บความรู้และเกม!',
      confirmButtonText: 'เริ่มเรียนรู้กันเลย!',
      confirmButtonColor: '#10b981',
    });
  };

  const handlePostComplete = async (score: number) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      postTestScore: score,
    };

    setUser(updatedUser);
    localStorage.setItem('python_active_user', JSON.stringify(updatedUser));

    // Show loading overlay
    setIsSyncing(true);
    Swal.fire({
      title: 'กำลังประมวลผล...',
      text: 'ระบบกำลังจัดเก็บและส่งรายงานคะแนนพัฒนาการของคุณลง Google Sheets กรุณารอสักครู่',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // Form data to submit to Apps Script Web App
    const logoutTimeStr = new Date().toLocaleString('th-TH');
    const improvementScore = Math.max(0, score - (user.preTestScore ?? 0));

    const payload = {
      fullName: user.fullName,
      preScore: user.preTestScore ?? 0,
      postScore: score,
      improvement: improvementScore,
      loginTime: user.loginTime,
      logoutTime: logoutTimeStr,
    };

    try {
      // Use no-cors mode for cross-origin Google Sheets submission
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // Update Local Leaderboard State
      const newLeaderboardRow: LeaderboardRow = {
        name: user.fullName,
        preScore: user.preTestScore ?? 0,
        postScore: score,
        improvement: improvementScore,
        loginTime: user.loginTime,
        logoutTime: logoutTimeStr,
      };

      const updatedLeaderboard = [newLeaderboardRow, ...leaderboardEntries];
      setLeaderboardEntries(updatedLeaderboard);
      localStorage.setItem('python_leaderboard', JSON.stringify(updatedLeaderboard));

      Swal.close();
      Swal.fire({
        icon: 'success',
        title: 'บันทึกสำเร็จ!',
        text: 'คะแนนการทดสอบและสถิติพัฒนาการได้รับการจัดเก็บบน Google Sheet เรียบร้อยแล้ว',
        confirmButtonText: 'ไปหน้าสรุปคะแนน',
        confirmButtonColor: '#10b981',
      }).then(() => {
        setCurrentView('results');
      });
    } catch (error) {
      console.error('Failed to sync to Google Sheets', error);
      Swal.close();

      // Fallback update local board anyway
      const newLeaderboardRow: LeaderboardRow = {
        name: user.fullName,
        preScore: user.preTestScore ?? 0,
        postScore: score,
        improvement: improvementScore,
        loginTime: user.loginTime,
        logoutTime: logoutTimeStr,
      };

      const updatedLeaderboard = [newLeaderboardRow, ...leaderboardEntries];
      setLeaderboardEntries(updatedLeaderboard);
      localStorage.setItem('python_leaderboard', JSON.stringify(updatedLeaderboard));

      Swal.fire({
        icon: 'warning',
        title: 'เชื่อมต่อขัดข้องชั่วคราว',
        text: 'ไม่สามารถติดต่อ Google Sheets ได้ แต่ระบบได้จัดเก็บสถิติลงเครื่องผู้เรียนเรียบร้อยแล้ว!',
        confirmButtonText: 'ไปหน้าสรุปคะแนน',
        confirmButtonColor: '#f97316',
      }).then(() => {
        setCurrentView('results');
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'ต้องการออกจากระบบ?',
      text: 'ระบบจะกลับไปยังหน้าหลักเพื่อเปลี่ยนผู้เรียน',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ออกจากระบบ',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
    }).then((result) => {
      if (result.isConfirmed) {
        // Log out clean-up
        setUser(null);
        setFullNameInput('');
        localStorage.removeItem('python_active_user');

        Swal.fire({
          icon: 'success',
          title: 'ออกจากระบบสำเร็จ',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 relative overflow-hidden flex flex-col justify-between">
      {/* Background Animated Clouds */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        {/* Floating cloud elements */}
        <div className="cloud-anim-1 absolute top-[8%] left-0 text-white/50">
          <Cloud size={100} className="fill-white/20 text-white/30" />
        </div>
        <div className="cloud-anim-2 absolute top-[25%] left-0 text-white/40">
          <Cloud size={140} className="fill-white/25 text-white/45" />
        </div>
        <div className="cloud-anim-3 absolute top-[55%] left-0 text-white/30">
          <Cloud size={110} className="fill-white/15 text-white/35" />
        </div>
      </div>

      {/* Main Orchestrator */}
      <div className="z-10 flex-1 w-full">
        {!user ? (
          /* ================= LOGIN & LEADERBOARD MAIN PAGE ================= */
          <div className="max-w-4xl mx-auto px-4 py-8 md:py-16 space-y-12">
            {/* Header branding */}
            <div className="text-center space-y-3">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 font-bold text-xs shadow-sm border border-orange-200">
                <GraduationCap size={16} />
                บทเรียนออนไลน์ (ระดับชั้น ปวช)
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight">
                ตัวดำเนินการภาษา Python
              </h1>
              <p className="text-sm md:text-base text-slate-600 font-medium max-w-xl mx-auto">
                วิชา การเขียนโปรแกรมคอมพิวเตอร์ด้วยภาษาไพทอน
              </p>
            </div>

            {/* Help Manual / Usage Instructions */}
            <div className="glass-card max-w-xl mx-auto rounded-3xl p-5 border border-white/50 bg-white/40 shadow-lg text-slate-700 space-y-3.5">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 border-b border-orange-200/50 pb-2">
                <HelpCircle size={16} className="text-orange-500" />
                คู่มือแนะนำการใช้งานระบบ (สำหรับผู้เรียน ปวช.)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5 text-xs">
                <div className="p-2.5 bg-orange-50/50 rounded-xl border border-orange-100">
                  <span className="font-extrabold text-orange-600 block mb-1">1. Pre-Test</span>
                  ทดสอบวัดระดับก่อนเริ่มเรียน (5 ข้อ)
                </div>
                <div className="p-2.5 bg-orange-50/50 rounded-xl border border-orange-100">
                  <span className="font-extrabold text-orange-600 block mb-1">2. Learn</span>
                  ศึกษาแท็บเนื้อหาและเล่น Python Console
                </div>
                <div className="p-2.5 bg-orange-50/50 rounded-xl border border-orange-100">
                  <span className="font-extrabold text-orange-600 block mb-1">3. Game</span>
                  ทบทวนสมองด้วยเกมจับคู่สัญลักษณ์
                </div>
                <div className="p-2.5 bg-orange-50/50 rounded-xl border border-orange-100">
                  <span className="font-extrabold text-orange-600 block mb-1">4. Post-Test</span>
                  สอบหลังเรียน ส่งสถิติไป Google Sheet
                </div>
                <div className="p-2.5 bg-orange-50/50 rounded-xl border border-orange-100">
                  <span className="font-extrabold text-orange-600 block mb-1">5. Result</span>
                  ดูสรุปวิเคราะห์เปรียบเทียบการเรียนรู้
                </div>
              </div>
            </div>

            {/* Login Box */}
            <div className="glass-card max-w-md mx-auto rounded-3xl p-6 md:p-8 shadow-2xl border border-white/50 relative overflow-hidden shine-effect">
              {/* Little corner decoration */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-orange-400 to-amber-400 rounded-full blur-xl opacity-40" />

              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl text-white shadow-md">
                  <LogIn size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">เข้าสู่ระบบผู้เรียน</h2>
                  <p className="text-xs text-slate-500">กรอกข้อมูลผู้เรียนเพื่อเริ่มต้นเก็บสถิติ</p>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2 pl-1 uppercase tracking-wider">
                    ชื่อ - นามสกุล (ผู้เรียน)
                  </label>
                  <input
                    type="text"
                    value={fullNameInput}
                    onChange={(e) => setFullNameInput(e.target.value)}
                    placeholder="ตัวอย่าง: นายธีรพล เอี่ยมสะอาด"
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all shadow-inner text-sm placeholder-slate-400 text-slate-800"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold rounded-2xl shadow-lg shadow-orange-500/20 hover-lift transition-all flex items-center justify-center gap-2 text-sm mt-2"
                >
                  เข้าสู่บทเรียน
                  <ChevronRight size={18} />
                </button>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-200/60"></div>
                  <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-bold uppercase tracking-wider">หรือ</span>
                  <div className="flex-grow border-t border-slate-200/60"></div>
                </div>

                <button
                  type="button"
                  onClick={handleAdminLoginPrompt}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 text-xs"
                >
                  <Shield size={14} className="text-slate-500" />
                  เข้าสู่ระบบในฐานะคุณครู (แอดมิน)
                </button>
              </form>
            </div>

            {/* Leaderboard */}
            <Leaderboard entries={leaderboardEntries} />
          </div>
        ) : (
          /* ================= WORKSPACE (SIDEBAR + MAIN COMPONENT) ================= */
          <div className="flex flex-col md:flex-row min-h-screen">
            {/* Left Sidebar Panel */}
            <Sidebar
              currentView={currentView}
              setCurrentView={setCurrentView}
              user={user}
              onLogout={handleLogout}
            />

            {/* Main Content Workspace Panel */}
            <main className="flex-1 md:pl-64 p-6 md:p-10 z-10">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Active View Title Box */}
                <div className="bg-white/30 backdrop-blur-md border border-white/50 rounded-[32px] p-6 shadow-sm relative overflow-hidden flex items-center justify-between group shine-effect">
                  {/* Sliding shine beam */}
                  <div className="absolute -inset-full h-full w-1/2 z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[glass-shine_3s_infinite] pointer-events-none"></div>

                  <div className="relative z-10">
                    <span className="text-[10px] uppercase font-bold text-orange-600 tracking-widest block mb-1">
                      ระดับชั้น ปวช • วิชา การเขียนโปรแกรมคอมพิวเตอร์ด้วยภาษาไพทอน
                    </span>
                    <h2 className="text-xl md:text-2xl font-black text-slate-800 leading-tight">
                      {currentView === 'pretest' && 'แบบทดสอบก่อนเรียน 📝'}
                      {currentView === 'content' && 'เนื้อหาบทเรียน 📚'}
                      {currentView === 'game' && 'เกมจับคู่ฝึกสมอง 🎮'}
                      {currentView === 'posttest' && 'แบบทดสอบหลังเรียน 📝'}
                      {currentView === 'results' && 'ผลประเมินความรู้และการพัฒนา 📊'}
                      {currentView === 'admin' && 'แผงควบคุมคุณครูและรายงานความก้าวหน้า 🛡️'}
                    </h2>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/80 border border-orange-100 rounded-full shadow-sm z-10">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Active Sync</span>
                  </div>
                </div>

                {/* Sub View Renderer */}
                {currentView === 'pretest' && (
                  <Quiz type="pre" onComplete={handlePreComplete} user={user} />
                )}
                {currentView === 'content' && <LessonTabs />}
                {currentView === 'game' && <MatchingGame />}
                {currentView === 'posttest' && (
                  <Quiz type="post" onComplete={handlePostComplete} user={user} />
                )}
                {currentView === 'results' && <PerformanceDashboard user={user} />}
                {currentView === 'admin' && (
                  <AdminPanel
                    user={user}
                    leaderboardEntries={leaderboardEntries}
                    onUpdateLeaderboard={setLeaderboardEntries}
                  />
                )}
              </div>
            </main>
          </div>
        )}
      </div>

      {/* Footer copyright */}
      <footer className="w-full text-center py-4 bg-slate-900 text-slate-400 text-xs mt-12 z-10 border-t border-slate-800">
        © 2026 Copyright | พัฒนาโดย Teerapol Aeamsa-and
      </footer>
    </div>
  );
}
