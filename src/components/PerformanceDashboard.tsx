import React from 'react';
import { User } from '../types';
import { Award, ArrowUpRight, TrendingUp, HelpCircle, CheckSquare, Sparkles } from 'lucide-react';

interface PerformanceProps {
  user: User;
}

export default function PerformanceDashboard({ user }: PerformanceProps) {
  const pre = user.preTestScore ?? 0;
  const post = user.postTestScore ?? 0;
  const dev = Math.max(0, post - pre);

  const getQualityLevel = (score: number) => {
    if (score === 5) return { label: 'ดีเยี่ยม (Excellent)', stars: '⭐️⭐️⭐️⭐️⭐️', color: 'text-emerald-500 bg-emerald-50 border-emerald-200' };
    if (score === 4) return { label: 'ดีมาก (Very Good)', stars: '⭐️⭐️⭐️⭐️', color: 'text-green-500 bg-green-50 border-green-200' };
    if (score === 3) return { label: 'ดี (Good)', stars: '⭐️⭐️⭐️', color: 'text-blue-500 bg-blue-50 border-blue-200' };
    if (score === 2) return { label: 'ผ่านเกณฑ์ (Pass)', stars: '⭐️⭐️', color: 'text-amber-500 bg-amber-50 border-amber-200' };
    return { label: 'ควรปรับปรุง (Needs Improvement)', stars: '⭐️', color: 'text-rose-500 bg-rose-50 border-rose-200' };
  };

  const quality = getQualityLevel(post);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white/40 backdrop-blur-md rounded-[32px] p-6 md:p-8 shadow-sm border border-white/60 relative overflow-hidden shine-effect">
        <div className="flex items-center gap-3.5 mb-6">
          <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl text-white shadow-md">
            <Award size={24} />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-800">
              ตรวจสอบคะแนนและการพัฒนาการเรียนรู้
            </h3>
            <p className="text-xs text-orange-600 font-semibold uppercase tracking-wider">
              Learning Assessment & Analytics
            </p>
          </div>
        </div>

        {/* Dynamic Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {/* Pre Test Card */}
          <div className="bg-white/60 p-5 rounded-2xl border border-slate-200/50 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">คะแนนทดสอบก่อนเรียน</span>
              <p className="text-[11px] text-slate-500 mt-1">Pre-Test Evaluation</p>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-black text-blue-600 font-mono">{user.preTestScore !== undefined ? user.preTestScore : '-'}</span>
              <span className="text-sm text-slate-500 font-medium">/ 5 คะแนน</span>
            </div>
          </div>

          {/* Post Test Card */}
          <div className="bg-white/60 p-5 rounded-2xl border border-slate-200/50 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 bg-emerald-500/10 text-emerald-600 rounded-bl-xl font-bold text-[10px]">
              ล่าสุด
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">คะแนนทดสอบหลังเรียน</span>
              <p className="text-[11px] text-slate-500 mt-1">Post-Test Evaluation</p>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-black text-emerald-600 font-mono">{user.postTestScore !== undefined ? user.postTestScore : '-'}</span>
              <span className="text-sm text-slate-500 font-medium">/ 5 คะแนน</span>
            </div>
          </div>

          {/* Development Card */}
          <div className="bg-gradient-to-br from-orange-400/10 to-amber-400/10 p-5 rounded-2xl border border-orange-200/50 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wide flex items-center gap-1">
                <TrendingUp size={14} />
                พัฒนาการรวม
              </span>
              <p className="text-[11px] text-orange-700/80 mt-1">Growth & Improvement</p>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-black text-orange-600 font-mono">+{dev}</span>
              <span className="text-sm text-slate-500 font-medium">คะแนนที่เพิ่มขึ้น</span>
            </div>
          </div>
        </div>

        {/* Comparison Metrics */}
        {user.postTestScore !== undefined && user.preTestScore !== undefined ? (
          <div className="space-y-6">
            {/* Visual comparison bar */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <h4 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-wider">
                เปรียบเทียบสัดส่วนคะแนนทดสอบ (Score Comparison)
              </h4>

              <div className="space-y-3.5">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                    <span>ก่อนเรียน (Pre-test)</span>
                    <span>{pre * 20}%</span>
                  </div>
                  <div className="w-full bg-slate-200/80 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${pre * 20}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                    <span>หลังเรียน (Post-test)</span>
                    <span>{post * 20}%</span>
                  </div>
                  <div className="w-full bg-slate-200/80 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${post * 20}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quality rating banner */}
            <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${quality.color} relative overflow-hidden`}>
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 text-slate-400/10">
                <Sparkles size={120} className="stroke-[3]" />
              </div>
              <div className="space-y-1 z-10">
                <span className="text-xs font-bold opacity-75 uppercase tracking-wide">
                  ระดับผลสัมฤทธิ์และคุณภาพวิชาการ (Achievement Rating)
                </span>
                <h4 className="text-lg font-extrabold text-slate-800 leading-tight">
                  {quality.label}
                </h4>
              </div>
              <div className="text-2xl font-black font-mono tracking-widest z-10 shrink-0">
                {quality.stars}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-100">
            <HelpCircle size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">คุณจำเป็นต้องทำการทดสอบหลังเรียน (Post-test) ก่อน จึงจะสามารถคำนวณและประเมินผลระดับคุณภาพได้อย่างสมบูรณ์</p>
          </div>
        )}
      </div>
    </div>
  );
}
