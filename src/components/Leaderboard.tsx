import React, { useState } from 'react';
import { LeaderboardRow } from '../types';
import { Search, Trophy, ArrowUp, Award } from 'lucide-react';

interface LeaderboardProps {
  entries: LeaderboardRow[];
}

export default function Leaderboard({ entries }: LeaderboardProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Sort by Post-test score descending, if equal, sort by improvement descending, if equal sort by pre-test score
  const sortedEntries = [...entries].sort((a, b) => {
    if (b.postScore !== a.postScore) {
      return b.postScore - a.postScore;
    }
    return b.improvement - a.improvement;
  });

  const filteredEntries = sortedEntries.filter((entry) =>
    entry.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return <span className="text-2xl">🥇</span>;
      case 1:
        return <span className="text-2xl">🥈</span>;
      case 2:
        return <span className="text-2xl">🥉</span>;
      default:
        return <span className="font-mono text-sm font-semibold text-slate-500">#{index + 1}</span>;
    }
  };

  return (
    <div id="leaderboard" className="bg-white/80 backdrop-blur-md rounded-[32px] p-6 md:p-8 shadow-sm border border-orange-100 relative overflow-hidden shine-effect">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl text-white shadow-md">
            <Trophy size={24} className="animate-bounce" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">ตารางอันดับผู้ทำคะแนนสูงสุด (Leaderboard)</h3>
            <p className="text-xs text-slate-500">เรียงตามคะแนนทดสอบหลังเรียนสูงสุดและการพัฒนาการ</p>
          </div>
        </div>

        {/* Real-time Search Box */}
        <div className="relative flex-1 max-w-md w-full">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหารายชื่อผู้เรียน..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-orange-100 bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all text-sm shadow-inner text-slate-800 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Leaderboard Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white/40">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-orange-400/10 to-amber-400/10 text-slate-700 text-sm font-semibold">
              <th className="py-4 px-6 text-center w-20">อันดับ</th>
              <th className="py-4 px-4">ชื่อ - นามสกุล</th>
              <th className="py-4 px-4 text-center">คะแนนก่อนเรียน</th>
              <th className="py-4 px-4 text-center">คะแนนหลังเรียน</th>
              <th className="py-4 px-4 text-center">การพัฒนาการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry, index) => (
                <tr
                  key={index}
                  className="border-t border-slate-100 hover:bg-white/60 transition-colors text-slate-700 text-sm"
                >
                  <td className="py-3 px-6 text-center">{getRankBadge(index)}</td>
                  <td className="py-3 px-4 font-medium text-slate-800">{entry.name}</td>
                  <td className="py-3 px-4 text-center font-mono font-semibold text-blue-600 bg-blue-50/20">
                    {entry.preScore} / 5
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-semibold text-emerald-600 bg-emerald-50/20">
                    {entry.postScore} / 5
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 font-mono font-bold px-2.5 py-1 rounded-full text-xs bg-amber-100 text-amber-700">
                      <ArrowUp size={12} className="stroke-[3]" />
                      +{entry.improvement}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  <p className="text-sm">ไม่พบรายชื่อผู้เรียนที่ค้นหา</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
