import React, { useState, useEffect } from 'react';
import { User, LeaderboardRow } from '../types';
import { Search, Trash2, Shield, Users, Award, BookOpen, Download, Plus, CheckCircle, HelpCircle } from 'lucide-react';
import Swal from 'sweetalert2';

interface AdminPanelProps {
  user: User;
  leaderboardEntries: LeaderboardRow[];
  onUpdateLeaderboard: (entries: LeaderboardRow[]) => void;
}

export default function AdminPanel({ user, leaderboardEntries, onUpdateLeaderboard }: AdminPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'learning' | 'not_started'>('all');

  // Stats calculation
  const totalStudents = leaderboardEntries.length;
  const avgPre = totalStudents > 0 ? (leaderboardEntries.reduce((acc, curr) => acc + curr.preScore, 0) / totalStudents).toFixed(1) : '0.0';
  const avgPost = totalStudents > 0 ? (leaderboardEntries.reduce((acc, curr) => acc + curr.postScore, 0) / totalStudents).toFixed(1) : '0.0';
  const avgImprovement = totalStudents > 0 ? (leaderboardEntries.reduce((acc, curr) => acc + curr.improvement, 0) / totalStudents).toFixed(1) : '0.0';

  // Helper to determine status
  const getStatus = (entry: LeaderboardRow) => {
    if (entry.postScore !== undefined && entry.postScore >= 0) {
      return { label: 'เรียนจบหลักสูตร', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    }
    if (entry.preScore !== undefined && entry.preScore >= 0) {
      return { label: 'กำลังเรียนรู้', color: 'bg-amber-100 text-amber-800 border-amber-200' };
    }
    return { label: 'ยังไม่เริ่มต้น', color: 'bg-slate-100 text-slate-800 border-slate-200' };
  };

  const handleDelete = (name: string) => {
    Swal.fire({
      title: 'คุณต้องการลบข้อมูลผู้เรียนนี้?',
      text: `ลบผลคะแนนและประวัติของ "${name}" ออกจากระบบ`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ลบข้อมูล',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
    }).then((result) => {
      if (result.isConfirmed) {
        const filtered = leaderboardEntries.filter((item) => item.name !== name);
        onUpdateLeaderboard(filtered);
        localStorage.setItem('python_leaderboard', JSON.stringify(filtered));
        Swal.fire('ลบสำเร็จ!', 'ข้อมูลผู้เรียนได้รับการลบออกจากระบบแล้ว', 'success');
      }
    });
  };

  const handleExportCSV = () => {
    if (leaderboardEntries.length === 0) {
      Swal.fire('ไม่มีข้อมูล', 'ไม่มีข้อมูลผู้เรียนให้ออกรายงาน', 'info');
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // Include BOM for Thai language in Excel
    csvContent += "ชื่อ-นามสกุล,คะแนนก่อนเรียน (Pre-test),คะแนนหลังเรียน (Post-test),คะแนนพัฒนาการ (Improvement),เวลาเข้าระบบ,เวลาออกจากระบบ\n";

    leaderboardEntries.forEach((row) => {
      csvContent += `"${row.name}",${row.preScore},${row.postScore},${row.improvement},"${row.loginTime}","${row.logoutTime}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `รายงานผู้เรียน_Python_Operators_${new Date().toLocaleDateString('th-TH')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire({
      icon: 'success',
      title: 'ออกรายงานสำเร็จ!',
      text: 'ระบบได้ส่งรายงานคะแนนผู้เรียนเป็นไฟล์ CSV สำหรับเปิดใน Microsoft Excel แล้ว',
      confirmButtonColor: '#10b981',
    });
  };

  const handleAddMockStudent = () => {
    Swal.fire({
      title: 'เพิ่มผู้เรียนจำลองสำหรับสาธิต',
      html: `
        <input id="swal-input-name" class="swal2-input" placeholder="ชื่อ-นามสกุลผู้เรียน" style="font-size: 14px;">
        <input id="swal-input-pre" type="number" class="swal2-input" placeholder="คะแนนก่อนเรียน (0-5)" min="0" max="5" style="font-size: 14px;">
        <input id="swal-input-post" type="number" class="swal2-input" placeholder="คะแนนหลังเรียน (0-5)" min="0" max="5" style="font-size: 14px;">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'เพิ่มผู้เรียน',
      confirmButtonColor: '#f97316',
      preConfirm: () => {
        const name = (document.getElementById('swal-input-name') as HTMLInputElement).value;
        const pre = parseInt((document.getElementById('swal-input-pre') as HTMLInputElement).value);
        const post = parseInt((document.getElementById('swal-input-post') as HTMLInputElement).value);

        if (!name) {
          Swal.showValidationMessage('กรุณากรอกชื่อผู้เรียน');
          return false;
        }
        if (isNaN(pre) || pre < 0 || pre > 5) {
          Swal.showValidationMessage('คะแนนก่อนเรียนต้องอยู่ระหว่าง 0-5');
          return false;
        }
        if (isNaN(post) || post < 0 || post > 5) {
          Swal.showValidationMessage('คะแนนหลังเรียนต้องอยู่ระหว่าง 0-5');
          return false;
        }

        return { name, pre, post };
      }
    }).then((res) => {
      if (res.isConfirmed && res.value) {
        const data = res.value;
        const improvement = Math.max(0, data.post - data.pre);
        const now = new Date().toLocaleString('th-TH');
        
        const newEntry: LeaderboardRow = {
          name: data.name,
          preScore: data.pre,
          postScore: data.post,
          improvement: improvement,
          loginTime: now,
          logoutTime: now,
        };

        const updated = [newEntry, ...leaderboardEntries];
        onUpdateLeaderboard(updated);
        localStorage.setItem('python_leaderboard', JSON.stringify(updated));

        Swal.fire('สำเร็จ!', `เพิ่มข้อมูลของ ${data.name} เรียบร้อยแล้ว`, 'success');
      }
    });
  };

  // Filter & Search entries
  const filteredEntries = leaderboardEntries.filter((row) => {
    const matchesSearch = row.name.toLowerCase().includes(searchTerm.toLowerCase());
    const isCompleted = row.postScore !== undefined && row.postScore >= 0;
    
    if (filterStatus === 'completed') return matchesSearch && isCompleted;
    if (filterStatus === 'learning') return matchesSearch && !isCompleted && row.preScore !== undefined;
    return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/40 backdrop-blur-md rounded-3xl p-5 border border-white/60 flex items-center gap-4 shadow-sm">
          <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl">
            <Users size={24} />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">ผู้เรียนสะสมทั้งหมด</span>
            <span className="text-xl md:text-2xl font-black text-slate-800">{totalStudents}</span>
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur-md rounded-3xl p-5 border border-white/60 flex items-center gap-4 shadow-sm">
          <div className="p-3.5 bg-red-50 text-red-600 rounded-2xl">
            <Award size={24} />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">เฉลี่ยก่อนเรียน</span>
            <span className="text-xl md:text-2xl font-black text-slate-800">{avgPre} <span className="text-xs font-bold text-slate-400">/ 5</span></span>
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur-md rounded-3xl p-5 border border-white/60 flex items-center gap-4 shadow-sm">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl">
            <CheckCircle size={24} />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">เฉลี่ยหลังเรียน</span>
            <span className="text-xl md:text-2xl font-black text-slate-800">{avgPost} <span className="text-xs font-bold text-slate-400">/ 5</span></span>
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur-md rounded-3xl p-5 border border-white/60 flex items-center gap-4 shadow-sm">
          <div className="p-3.5 bg-orange-50 text-orange-600 rounded-2xl">
            <BookOpen size={24} />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">คะแนนพัฒนาการ</span>
            <span className="text-xl md:text-2xl font-black text-orange-600">+{avgImprovement}</span>
          </div>
        </div>
      </div>

      {/* Main Table and Control Section */}
      <div className="bg-white/40 backdrop-blur-md rounded-[32px] p-6 md:p-8 shadow-sm border border-white/60">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <Shield size={18} className="text-orange-500" />
              แผงควบคุมคุณครู / ผู้ดูแลระบบ
            </h3>
            <p className="text-xs text-slate-500">ติดตาม ประเมิน และจัดทำประวัติความก้าวหน้าผู้เรียนอย่างเป็นระบบ</p>
          </div>

          <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
            <button
              onClick={handleAddMockStudent}
              className="flex-1 md:flex-initial px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Plus size={14} />
              เพิ่มผู้เรียนจำลอง
            </button>
            <button
              onClick={handleExportCSV}
              className="flex-1 md:flex-initial px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Download size={14} />
              ออกรายงาน CSV
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          {/* Search Box */}
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหารายชื่อผู้เรียน..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200/80 bg-white/70 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
            />
          </div>

          {/* Filter switches */}
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/50">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${filterStatus === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${filterStatus === 'completed' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              เรียนจบแล้ว
            </button>
          </div>
        </div>

        {/* Table Render */}
        <div className="overflow-x-auto rounded-2xl border border-slate-100/80 bg-white/30 shadow-inner">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-[11px] font-black uppercase border-b border-slate-100">
                <th className="py-4 px-5">ชื่อ - นามสกุลผู้เรียน</th>
                <th className="py-4 px-4 text-center">ก่อนเรียน (Pre)</th>
                <th className="py-4 px-4 text-center">หลังเรียน (Post)</th>
                <th className="py-4 px-4 text-center">พัฒนาการ</th>
                <th className="py-4 px-4">สถานะความก้าวหน้า</th>
                <th className="py-4 px-4">เวลาลงชื่อ</th>
                <th className="py-4 px-4 text-center w-20">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400 text-xs font-semibold">
                    ไม่พบรายชื่อหรือประวัติผู้เรียนตามเงื่อนไขที่กำหนด
                  </td>
                </tr>
              ) : (
                filteredEntries.map((row, idx) => {
                  const statusInfo = getStatus(row);
                  return (
                    <tr
                      key={idx}
                      className="border-t border-slate-100 hover:bg-white/60 transition-colors text-slate-700 text-xs font-medium"
                    >
                      <td className="py-3.5 px-5 font-bold text-slate-800">
                        {row.name}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 font-mono font-bold">
                          {row.preScore} / 5
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2.5 py-1 rounded-md bg-orange-50 text-orange-600 font-mono font-bold">
                          {row.postScore !== undefined ? `${row.postScore} / 5` : '-'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full font-mono font-black text-[11px] ${row.improvement > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                          {row.improvement > 0 ? `+${row.improvement}` : row.improvement}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[11px] font-mono text-slate-400">
                        {row.loginTime}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleDelete(row.name)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 transition-colors"
                          title="ลบผู้เรียน"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
