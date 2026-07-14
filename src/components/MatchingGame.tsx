import React, { useState, useEffect } from 'react';
import { Gamepad2, RefreshCw, Star, CheckCircle } from 'lucide-react';
import Swal from 'sweetalert2';

interface MatchItem {
  id: string;
  text: string;
  type: 'symbol' | 'meaning';
  pairId: string; // Used to identify correct match
}

export default function MatchingGame() {
  const initialSymbols: MatchItem[] = [
    { id: 's1', text: '+', type: 'symbol', pairId: 'pair1' },
    { id: 's2', text: '//', type: 'symbol', pairId: 'pair2' },
    { id: 's3', text: '%', type: 'symbol', pairId: 'pair3' },
    { id: 's4', text: '**', type: 'symbol', pairId: 'pair4' },
    { id: 's5', text: '!=', type: 'symbol', pairId: 'pair5' },
  ];

  const initialMeanings: MatchItem[] = [
    { id: 'm1', text: 'บวก (Addition)', type: 'meaning', pairId: 'pair1' },
    { id: 'm2', text: 'หารเอาส่วนปัดเศษทิ้ง (Floor Division)', type: 'meaning', pairId: 'pair2' },
    { id: 'm3', text: 'หารเอาเศษ (Modulo)', type: 'meaning', pairId: 'pair3' },
    { id: 'm4', text: 'ยกกำลัง (Exponentiation)', type: 'meaning', pairId: 'pair4' },
    { id: 'm5', text: 'ไม่เท่ากับ (Not Equal)', type: 'meaning', pairId: 'pair5' },
  ];

  const [symbols, setSymbols] = useState<MatchItem[]>([]);
  const [meanings, setMeanings] = useState<MatchItem[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<MatchItem | null>(null);
  const [selectedMeaning, setSelectedMeaning] = useState<MatchItem | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]); // holds pairIds
  const [score, setScore] = useState(0);

  // Initialize and shuffle
  useEffect(() => {
    resetGame();
  }, []);

  const shuffle = (array: MatchItem[]) => {
    const arr = [...array];
    return arr.sort(() => Math.random() - 0.5);
  };

  const resetGame = () => {
    setSymbols(shuffle(initialSymbols));
    setMeanings(shuffle(initialMeanings));
    setSelectedSymbol(null);
    setSelectedMeaning(null);
    setMatchedPairs([]);
    setScore(0);
  };

  const handleSelect = (item: MatchItem) => {
    if (matchedPairs.includes(item.pairId)) return; // Already matched

    if (item.type === 'symbol') {
      setSelectedSymbol(item);
      // Check if meaning is already selected
      if (selectedMeaning) {
        checkMatch(item, selectedMeaning);
      }
    } else {
      setSelectedMeaning(item);
      // Check if symbol is already selected
      if (selectedSymbol) {
        checkMatch(selectedSymbol, item);
      }
    }
  };

  const checkMatch = (sym: MatchItem, mean: MatchItem) => {
    if (sym.pairId === mean.pairId) {
      // SUCCESSFUL MATCH!
      setMatchedPairs((prev) => [...prev, sym.pairId]);
      setScore((prev) => prev + 20);
      setSelectedSymbol(null);
      setSelectedMeaning(null);

      // Play matching popup alert
      Swal.fire({
        title: 'ถูกต้อง!',
        text: `จับคู่สำเร็จ: ${sym.text} คือ ${mean.text}`,
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      // MISMATCH
      setSelectedSymbol(null);
      setSelectedMeaning(null);

      Swal.fire({
        title: 'ยังไม่ถูกนะ!',
        text: 'ลองจับคู่ใหม่อีกครั้งนะเด็กๆ',
        icon: 'error',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  // Check game completion
  useEffect(() => {
    if (matchedPairs.length === 5) {
      Swal.fire({
        title: 'ยินดีด้วย! คุณเก่งมาก!',
        text: 'คุณจับคู่ตัวดำเนินการภาษา Python ได้ถูกต้องครบถ้วน สมบูรณ์แบบ!',
        icon: 'success',
        confirmButtonText: 'รับดาว ⭐️⭐️⭐️⭐️⭐️',
        confirmButtonColor: '#f97316',
      });
    }
  }, [matchedPairs]);

  return (
    <div className="bg-white/40 backdrop-blur-md rounded-[32px] p-6 md:p-8 shadow-sm border border-white/60 relative overflow-hidden animate-fade-in shine-effect">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100/60">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl text-white shadow-md">
            <Gamepad2 size={24} className="animate-spin" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">เกมจับคู่ตัวดำเนินการ (Operator Matcher)</h3>
            <p className="text-xs text-slate-500">จงจับคู่สัญลักษณ์ตัวดำเนินการทางซ้ายและคำอธิบายทางขวา</p>
          </div>
        </div>

        <button
          onClick={resetGame}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm border border-slate-200"
        >
          <RefreshCw size={14} />
          เริ่มใหม่
        </button>
      </div>

      {/* Game Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-100 flex items-center justify-between">
          <span className="text-sm font-bold text-slate-700">คะแนนในเกม:</span>
          <span className="text-xl font-black text-amber-600 font-mono flex items-center gap-1">
            <Star size={18} className="fill-amber-400 stroke-amber-500" />
            {score}
          </span>
        </div>
        <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100 flex items-center justify-between">
          <span className="text-sm font-bold text-slate-700">จับคู่สำเร็จแล้ว:</span>
          <span className="text-xl font-black text-emerald-600 font-mono">
            {matchedPairs.length} / 5 คู่
          </span>
        </div>
      </div>

      {/* Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        {/* Symbols Column */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-widest pl-2">
            สัญลักษณ์คณิตศาสตร์ / ตรรกะ (Operators)
          </h4>
          <div className="space-y-3">
            {symbols.map((item) => {
              const isMatched = matchedPairs.includes(item.pairId);
              const isSelected = selectedSymbol?.id === item.id;
              return (
                <button
                  key={item.id}
                  disabled={isMatched}
                  onClick={() => handleSelect(item)}
                  className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 text-left hover-lift flex items-center justify-between ${
                    isMatched
                      ? 'border-emerald-200 bg-emerald-50/40 text-emerald-700 cursor-not-allowed'
                      : isSelected
                      ? 'border-indigo-500 bg-indigo-50/80 text-indigo-800 font-bold shadow-md shadow-indigo-500/10 scale-[1.02]'
                      : 'border-slate-200/80 bg-white/70 hover:bg-white text-slate-700'
                  }`}
                >
                  <span className="font-mono text-2xl font-black">{item.text}</span>
                  {isMatched && <CheckCircle size={18} className="text-emerald-500 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Meanings Column */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-orange-500 uppercase tracking-widest pl-2">
            คำอธิบายและความหมาย (Descriptions)
          </h4>
          <div className="space-y-3">
            {meanings.map((item) => {
              const isMatched = matchedPairs.includes(item.pairId);
              const isSelected = selectedMeaning?.id === item.id;
              return (
                <button
                  key={item.id}
                  disabled={isMatched}
                  onClick={() => handleSelect(item)}
                  className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 text-left hover-lift flex items-center justify-between ${
                    isMatched
                      ? 'border-emerald-200 bg-emerald-50/40 text-emerald-700 cursor-not-allowed'
                      : isSelected
                      ? 'border-orange-500 bg-orange-50/80 text-orange-800 font-bold shadow-md shadow-orange-500/10 scale-[1.02]'
                      : 'border-slate-200/80 bg-white/70 hover:bg-white text-slate-700'
                  }`}
                >
                  <span className="font-semibold text-sm">{item.text}</span>
                  {isMatched && <CheckCircle size={18} className="text-emerald-500 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
