import React, { useState } from 'react';
import { operatorTypes, arithmeticOperators } from '../data/lessons';
import { PlayCircle, BookOpen, Cpu, Code2, CheckCircle2, XCircle, Terminal, HelpCircle, AlertCircle, RefreshCw } from 'lucide-react';
import Swal from 'sweetalert2';

export default function LessonTabs() {
  const [activeTab, setActiveTab] = useState<'tab1' | 'tab2' | 'tab3' | 'tab4'>('tab1');

  // Checkpoint 1 state (Operators quiz)
  const [cp1Selected, setCp1Selected] = useState<number | null>(null);
  const [cp1Checked, setCp1Checked] = useState(false);

  // Checkpoint 2 state (Conditionals quiz)
  const [cp2Selected, setCp2Selected] = useState<number | null>(null);
  const [cp2Checked, setCp2Checked] = useState(false);

  // Python Playground states
  const [playgroundCode, setPlaygroundCode] = useState<string>(
    "# เลือกตัวอย่างโค้ดด้านบน หรือเขียนรหัสของคุณที่นี่\nscore = 85\n\nif score >= 80:\n    print('เกรด A ดีเยี่ยม!')\nelif score >= 70:\n    print('เกรด B ยอดเยี่ยม')\nelse:\n    print('ผ่านเกรด C')\n"
  );
  const [playgroundOutput, setPlaygroundOutput] = useState<string[]>(["ยินดีต้อนรับสู่โปรแกรมจำลอง Python Console! กดปุ่ม 'รันโปรแกรม' เพื่อประมวลผลโค้ด"]);
  const [isConsoleRunning, setIsConsoleRunning] = useState(false);

  // Playground presets
  const presets = [
    {
      name: "1. การหารเอาส่วนและเศษ",
      code: "apples = 17\nstudents = 5\n\n# หาว่านักเรียนแต่ละคนได้กี่ลูก\neach = apples // students\n# หาว่าเหลือเศษกี่ลูก\nleftover = apples % students\n\nprint('แอปเปิ้ลทั้งหมด:', apples, 'ผล')\nprint('นักเรียนได้คนละ:', each, 'ผล')\nprint('เหลือแอปเปิ้ลเศษ:', leftover, 'ผล')"
    },
    {
      name: "2. ตัวดำเนินการเปรียบเทียบ",
      code: "x = 25\ny = 30\n\nis_greater = x > y\nis_equal = x == y\n\nprint('x มากกว่า y หรือไม่?:', is_greater)\nprint('x เท่ากับ y หรือไม่?:', is_equal)"
    },
    {
      name: "3. เงื่อนไข If-Elif-Else (คำนวณอายุ)",
      code: "age = 17\n\nif age >= 20:\n    print('คุณบรรลุนิติภาวะแล้ว')\nelif age >= 15:\n    print('คุณเป็นวัยรุ่น (ระดับ ปวช / มัธยม)')\nelse:\n    print('คุณยังเป็นเด็กเล็ก')"
    },
    {
      name: "4. ตัวดำเนินการทางตรรกศาสตร์",
      code: "has_grade = True\nhas_good_conduct = True\n\n# ต้องสอบผ่าน และ ความประพฤติดี\nget_scholarship = has_grade and has_good_conduct\n\nprint('เงื่อนไขผ่านตรรกะ AND:', get_scholarship)\nprint('ถ้าได้ทุนการศึกษา พิมพ์ True:', get_scholarship)"
    }
  ];

  const handleRunPlayground = () => {
    setIsConsoleRunning(true);
    setPlaygroundOutput(["กำลังประมวลผล..."]);

    setTimeout(() => {
      try {
        const logs: string[] = [];
        // A mini-interpreter for Python simulation to handle print and variable output!
        const lines = playgroundCode.split('\n');
        const variables: Record<string, any> = {};

        // Parse lines in a very safe/interactive simulation way
        lines.forEach((line) => {
          const cleanLine = line.trim();
          if (!cleanLine || cleanLine.startsWith('#')) return;

          // Check for assignments like x = 10
          if (cleanLine.includes('=') && !cleanLine.includes('==') && !cleanLine.includes('!=') && !cleanLine.includes('>=') && !cleanLine.includes('<=')) {
            const parts = cleanLine.split('=');
            const varName = parts[0].trim();
            const varValExpr = parts[1].trim();

            // Evaluate standard arithmetic in variables safely
            try {
              let evalExpr = varValExpr
                .replace(/and/g, '&&')
                .replace(/or/g, '||')
                .replace(/True/g, 'true')
                .replace(/False/g, 'false');
              
              // Handle variables replace
              Object.keys(variables).forEach((v) => {
                const reg = new RegExp(`\\b${v}\\b`, 'g');
                evalExpr = evalExpr.replace(reg, variables[v]);
              });

              // Handle python-style arithmetic operators
              evalExpr = evalExpr.replace(/\*\*/g, '^'); // handle exponential visualization
              if (evalExpr.includes('//')) {
                const divParts = evalExpr.split('//');
                const num1 = eval(divParts[0]);
                const num2 = eval(divParts[1]);
                variables[varName] = Math.floor(num1 / num2);
              } else if (evalExpr.includes('%')) {
                const modParts = evalExpr.split('%');
                const num1 = eval(modParts[0]);
                const num2 = eval(modParts[1]);
                variables[varName] = num1 % num2;
              } else {
                // simple math or logic evaluation
                variables[varName] = eval(evalExpr);
              }
            } catch {
              // fallback default values
              if (varValExpr === 'True') variables[varName] = true;
              else if (varValExpr === 'False') variables[varName] = false;
              else if (!isNaN(Number(varValExpr))) variables[varName] = Number(varValExpr);
              else variables[varName] = varValExpr.replace(/['"]/g, '');
            }
          }

          // Check for print statement
          if (cleanLine.startsWith('print(') && cleanLine.endsWith(')')) {
            const inside = cleanLine.substring(6, cleanLine.length - 1);
            // split by comma, ignoring commas inside strings
            const items: string[] = [];
            let currentItem = "";
            let insideQuote = false;
            let quoteChar = "";

            for (let i = 0; i < inside.length; i++) {
              const char = inside[i];
              if ((char === '"' || char === "'") && (i === 0 || inside[i-1] !== '\\')) {
                if (!insideQuote) {
                  insideQuote = true;
                  quoteChar = char;
                } else if (char === quoteChar) {
                  insideQuote = false;
                }
              }
              if (char === ',' && !insideQuote) {
                items.push(currentItem.trim());
                currentItem = "";
              } else {
                currentItem += char;
              }
            }
            if (currentItem.trim()) {
              items.push(currentItem.trim());
            }

            const outputLine = items.map((item) => {
              // If it's a quoted string
              if ((item.startsWith('"') && item.endsWith('"')) || (item.startsWith("'") && item.endsWith("'"))) {
                return item.substring(1, item.length - 1);
              }
              // If it's a variable or expression
              try {
                let evalExpr = item;
                Object.keys(variables).forEach((v) => {
                  const reg = new RegExp(`\\b${v}\\b`, 'g');
                  evalExpr = evalExpr.replace(reg, JSON.stringify(variables[v]));
                });
                return eval(evalExpr);
              } catch {
                return variables[item] !== undefined ? String(variables[item]) : item;
              }
            }).join(' ');

            logs.push(outputLine);
          }

          // Simulation of if statements specifically
          if (cleanLine.startsWith('if ') && cleanLine.endsWith(':')) {
            // we will simulate based on the user's variables
            const cond = cleanLine.substring(3, cleanLine.length - 1);
            let evalCond = cond
              .replace(/and/g, '&&')
              .replace(/or/g, '||')
              .replace(/True/g, 'true')
              .replace(/False/g, 'false');
            
            Object.keys(variables).forEach((v) => {
              const reg = new RegExp(`\\b${v}\\b`, 'g');
              evalCond = evalCond.replace(reg, variables[v]);
            });

            try {
              const conditionMet = eval(evalCond);
              variables['_if_met'] = conditionMet;
              variables['_any_met'] = conditionMet;
            } catch {
              variables['_if_met'] = false;
              variables['_any_met'] = false;
            }
          }

          // Elif branch
          if (cleanLine.startsWith('elif ') && cleanLine.endsWith(':')) {
            if (variables['_any_met']) {
              variables['_if_met'] = false;
            } else {
              const cond = cleanLine.substring(5, cleanLine.length - 1);
              let evalCond = cond
                .replace(/and/g, '&&')
                .replace(/or/g, '||')
                .replace(/True/g, 'true')
                .replace(/False/g, 'false');
              
              Object.keys(variables).forEach((v) => {
                const reg = new RegExp(`\\b${v}\\b`, 'g');
                evalCond = evalCond.replace(reg, variables[v]);
              });

              try {
                const conditionMet = eval(evalCond);
                variables['_if_met'] = conditionMet;
                if (conditionMet) variables['_any_met'] = true;
              } catch {
                variables['_if_met'] = false;
              }
            }
          }

          // Else branch
          if (cleanLine === 'else:') {
            variables['_if_met'] = !variables['_any_met'];
          }

          // Indented prints (simulating block execution)
          if (line.startsWith('    ') && line.trim().startsWith('print(')) {
            if (variables['_if_met'] === true) {
              const blockPrint = line.trim();
              const inside = blockPrint.substring(6, blockPrint.length - 1);
              let outputVal = inside;
              if ((inside.startsWith('"') && inside.endsWith('"')) || (inside.startsWith("'") && inside.endsWith("'"))) {
                outputVal = inside.substring(1, inside.length - 1);
              } else {
                try {
                  let evalExpr = inside;
                  Object.keys(variables).forEach((v) => {
                    const reg = new RegExp(`\\b${v}\\b`, 'g');
                    evalExpr = evalExpr.replace(reg, JSON.stringify(variables[v]));
                  });
                  outputVal = eval(evalExpr);
                } catch {
                  outputVal = variables[inside] !== undefined ? String(variables[inside]) : inside;
                }
              }
              logs.push(outputVal);
            }
          }
        });

        if (logs.length === 0) {
          logs.push("รันโค้ดสำเร็จ! (ไม่มีคำสั่ง print สำหรับแสดงผลลัพธ์)");
        }
        setPlaygroundOutput(logs);
      } catch (err: any) {
        setPlaygroundOutput(["เกิดข้อผิดพลาดทางไวยากรณ์ (Syntax Error):", err.message, "กรุณาลองตรวจสอบเครื่องหมายและการเว้นวรรคให้ถูกต้องตามหลักภาษา Python"]);
      } finally {
        setIsConsoleRunning(false);
      }
    }, 800);
  };

  const handleCheckpoint1Submit = () => {
    if (cp1Selected === null) {
      Swal.fire({
        icon: 'warning',
        text: 'กรุณาเลือกคำตอบก่อนส่งคำตอบ',
        confirmButtonColor: '#f97316',
      });
      return;
    }
    setCp1Checked(true);
    if (cp1Selected === 2) {
      Swal.fire({
        icon: 'success',
        title: 'ถูกต้องเก่งมาก! 🎉',
        text: 'ตัวดำเนินการ // คือ การหารเอาเฉพาะผลจำนวนเต็มที่เป็นส่วนปัดเศษทศนิยมทิ้งทั้งหมด',
        confirmButtonColor: '#10b981',
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'ยังไม่ถูกน้า ลองดูใหม่อีกครั้ง!',
        text: 'สัญลักษณ์ // แตกต่างจากการหารปกติ (/) และหารเอาเศษ (%)',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  const handleCheckpoint2Submit = () => {
    if (cp2Selected === null) {
      Swal.fire({
        icon: 'warning',
        text: 'กรุณาเลือกคำตอบก่อนส่งคำตอบ',
        confirmButtonColor: '#f97316',
      });
      return;
    }
    setCp2Checked(true);
    if (cp2Selected === 1) {
      Swal.fire({
        icon: 'success',
        title: 'ถูกต้อง ยอดเยี่ยมมาก! 🌟',
        text: 'คะแนนคือ 65 ซึ่งไม่เข้าเงื่อนไขแรก (>= 80) จึงมาตรวจที่ elif score >= 50 ซึ่งเป็นจริง โปรแกรมจึงพิมพ์ผลลัพธ์ว่า ปรับปรุง!',
        confirmButtonColor: '#10b981',
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'คำตอบยังไม่ถูกต้อง ลองวิเคราะห์เงื่อนไขทีละขั้นตอนดูนะ!',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Navigation Tab Switcher */}
      <div className="flex flex-wrap bg-orange-100/40 p-2 rounded-2xl md:rounded-full gap-1 shadow-inner border border-orange-200">
        <button
          onClick={() => setActiveTab('tab1')}
          className={`flex-1 min-w-[120px] py-2.5 text-xs md:text-sm font-black rounded-full transition-all duration-300 flex items-center justify-center gap-2 ${
            activeTab === 'tab1'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
              : 'text-slate-600 hover:bg-white/40 bg-transparent'
          }`}
        >
          <BookOpen size={15} />
          ประเภทตัวดำเนินการ
        </button>
        <button
          onClick={() => setActiveTab('tab2')}
          className={`flex-1 min-w-[120px] py-2.5 text-xs md:text-sm font-black rounded-full transition-all duration-300 flex items-center justify-center gap-2 ${
            activeTab === 'tab2'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
              : 'text-slate-600 hover:bg-white/40 bg-transparent'
          }`}
        >
          <Cpu size={15} />
          ตัวดำเนินการคณิตศาสตร์
        </button>
        <button
          onClick={() => setActiveTab('tab3')}
          className={`flex-1 min-w-[120px] py-2.5 text-xs md:text-sm font-black rounded-full transition-all duration-300 flex items-center justify-center gap-2 ${
            activeTab === 'tab3'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
              : 'text-slate-600 hover:bg-white/40 bg-transparent'
          }`}
        >
          <HelpCircle size={15} />
          โครงสร้างเงื่อนไข (Conditionals)
        </button>
        <button
          onClick={() => setActiveTab('tab4')}
          className={`flex-1 min-w-[120px] py-2.5 text-xs md:text-sm font-black rounded-full transition-all duration-300 flex items-center justify-center gap-2 ${
            activeTab === 'tab4'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
              : 'text-slate-600 hover:bg-white/40 bg-transparent'
          }`}
        >
          <Terminal size={15} />
          Python Console จำลอง
        </button>
      </div>

      {/* TAB 1: OPERATORS SUMMARY */}
      {activeTab === 'tab1' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white/40 backdrop-blur-md rounded-[32px] p-6 md:p-8 shadow-sm border border-white/60 relative overflow-hidden shine-effect">
            <div className="flex items-center gap-3.5 mb-4 relative z-10">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-sm">
                <BookOpen size={24} />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-800">
                  ความหมายและประเภทของตัวดำเนินการใน Python
                </h3>
                <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wider">
                  Python Operators Concept
                </p>
              </div>
            </div>
            
            <p className="text-sm text-slate-600 leading-relaxed mb-6 relative z-10">
              <strong className="text-slate-800 font-bold">ตัวดำเนินการ (Operators)</strong> คือ เครื่องหมายหรือสัญลักษณ์พิเศษในภาษา Python ที่ใช้สำหรับสั่งการให้โปรแกรมประมวลผลข้อมูล คำนวณ เปรียบเทียบค่า หรือดำเนินการทางตรรกะ เพื่อควบคุมโปรแกรมให้ตอบสนองได้อย่างถูกต้องและมีประสิทธิภาพ
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
              {operatorTypes.map((type, idx) => (
                <div
                  key={idx}
                  className="bg-white/60 hover:bg-white/85 rounded-2xl p-5 border border-orange-100 shadow-sm hover-lift relative overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2.5 mb-3.5">
                      <span className="text-2xl">{type.emoji}</span>
                      <h4 className="font-bold text-slate-800 text-sm leading-tight">
                        {type.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      {type.description}
                    </p>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                      {type.examples.map((ex, exIdx) => (
                        <span
                          key={exIdx}
                          className="text-[10px] bg-slate-100 font-semibold px-2 py-1 rounded-md text-slate-600 font-mono"
                        >
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checkpoint 1 Challenge */}
          <div className="bg-gradient-to-br from-indigo-50/50 to-orange-50/50 backdrop-blur-md rounded-[32px] p-6 md:p-8 shadow-sm border border-indigo-100/80 relative">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-wider">
                คำถามชวนคิดที่ 1
              </span>
              <span className="text-xs text-slate-500 font-bold">ทดสอบความเข้าใจด่วน! ตอบรับผลลัพธ์ทันที</span>
            </div>
            <h4 className="text-sm md:text-base font-bold text-slate-800 mb-4 font-mono">
              โจทย์: กำหนดให้ `a = 15` และ `b = 4` ผลลัพธ์จากการดำเนินการ `a // b` จะได้ค่าเท่าใด?
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              {[
                { label: "ก) 3.75", value: 0 },
                { label: "ข) 3 เศษ 3", value: 1 },
                { label: "ค) 3", value: 2 }
              ].map((item) => {
                const isSelected = cp1Selected === item.value;
                const isCorrect = item.value === 2;
                
                let btnStyle = "border-slate-200 bg-white text-slate-700";
                if (cp1Checked) {
                  if (isCorrect) {
                    btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold";
                  } else if (isSelected) {
                    btnStyle = "border-red-500 bg-red-50 text-red-950 font-bold";
                  } else {
                    btnStyle = "border-slate-100 bg-slate-50/50 text-slate-400 opacity-60";
                  }
                } else if (isSelected) {
                  btnStyle = "border-indigo-600 bg-indigo-50 text-indigo-950 font-bold";
                }

                return (
                  <button
                    key={item.value}
                    disabled={cp1Checked}
                    onClick={() => setCp1Selected(item.value)}
                    className={`p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${btnStyle} ${!cp1Checked ? 'hover:border-indigo-400 hover:bg-slate-50' : ''}`}
                  >
                    <span>{item.label}</span>
                    {cp1Checked && isCorrect && <CheckCircle2 size={14} className="text-emerald-600" />}
                    {cp1Checked && isSelected && !isCorrect && <XCircle size={14} className="text-red-500" />}
                  </button>
                );
              })}
            </div>

            {cp1Checked && (
              <div className="p-3 bg-white/70 border border-indigo-100 rounded-xl text-xs text-slate-600 leading-relaxed mb-4">
                <strong>เฉลยและอธิบาย:</strong> สัญลักษณ์ `//` หมายถึงการหารปัดเศษทศนิยมทิ้ง (Floor Division) เอาเฉพาะส่วนที่เป็นจำนวนเต็ม ผลลัพธ์ของ `15 // 4` คือ `3` (ปัดเศษทศนิยม `.75` ทิ้งทั้งหมด)
              </div>
            )}

            {!cp1Checked ? (
              <button
                onClick={handleCheckpoint1Submit}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all hover-lift"
              >
                ส่งตรวจคำตอบ
              </button>
            ) : (
              <button
                onClick={() => {
                  setCp1Checked(false);
                  setCp1Selected(null);
                }}
                className="px-5 py-2.5 bg-slate-600 hover:bg-slate-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <RefreshCw size={12} />
                ฝึกฝนใหม่อีกครั้ง
              </button>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ARITHMETIC OPERATORS & VIDEO */}
      {activeTab === 'tab2' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white/40 backdrop-blur-md rounded-[32px] p-6 md:p-8 shadow-sm border border-white/60 relative overflow-hidden shine-effect">
            <div className="flex items-center gap-3.5 mb-4 relative z-10">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl shadow-sm">
                <Cpu size={24} />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-800">
                  ตัวดำเนินการคณิตศาสตร์ใน Python
                </h3>
                <p className="text-xs text-orange-600 font-semibold uppercase tracking-wider">
                  Arithmetic Operators & Video Media
                </p>
              </div>
            </div>
            
            <p className="text-sm text-slate-600 leading-relaxed mb-6 relative z-10">
              เรียนรู้ตัวดำเนินการบวก ลบ คูณ หาร และ ตัวดำเนินการพิเศษที่มีเฉพาะในระดับโปรแกรมมิ่ง เช่น ยกกำลัง ยกเว้นเศษ และหาเศษค้างคา
            </p>

            {/* Multimedia Video Embed (Responsive and speed adjustable) */}
            <div className="mb-8 max-w-3xl mx-auto relative z-10">
              <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-video border border-slate-200 bg-black">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/1UgkQpoWqcQ"
                  title="วิดีโอประกอบการเรียนรู้เรื่องตัวดำเนินการ Python"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="flex items-center gap-2 mt-3 justify-center text-slate-500 text-xs font-semibold">
                <PlayCircle size={14} className="text-red-500" />
                <span>วิดีโอเสริมความรู้เพื่อความเข้าใจสูงสุดเรื่อง ตัวดำเนินการคณิตศาสตร์</span>
              </div>
            </div>

            {/* Arithmetic Table with styling */}
            <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white/40 shadow-inner relative z-10">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-gradient-to-r from-orange-400/10 to-amber-400/10 text-slate-700 text-xs font-bold uppercase">
                    <th className="py-4 px-4 text-center w-16">สัญลักษณ์</th>
                    <th className="py-4 px-4 w-44">ตัวดำเนินการ</th>
                    <th className="py-4 px-4">คำอธิบายการประมวลผล</th>
                    <th className="py-4 px-4 font-mono w-48">ตัวอย่างโค้ด</th>
                    <th className="py-4 px-4 text-center w-24">ผลลัพธ์</th>
                  </tr>
                </thead>
                <tbody>
                  {arithmeticOperators.map((op, idx) => (
                    <tr
                      key={idx}
                      className="border-t border-slate-100 hover:bg-white/60 transition-colors text-slate-700 text-xs"
                    >
                      <td className="py-3.5 px-4 text-center font-bold text-base font-mono text-orange-600 bg-orange-50/10">
                        {op.symbol}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        <span className="mr-1.5">{op.emoji}</span>
                        {op.name}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">{op.description}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-600 bg-slate-50/20">
                        {op.example}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-black text-emerald-600 bg-emerald-50/20 text-sm">
                        {op.result}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CONDITIONALS LESSON */}
      {activeTab === 'tab3' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white/40 backdrop-blur-md rounded-[32px] p-6 md:p-8 shadow-sm border border-white/60 relative overflow-hidden shine-effect">
            <div className="flex items-center gap-3.5 mb-4 relative z-10">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl shadow-sm">
                <Code2 size={24} />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-800">
                  โครงสร้างเงื่อนไขในภาษา Python (Conditionals: if, elif, else)
                </h3>
                <p className="text-xs text-amber-600 font-semibold uppercase tracking-wider">
                  Python Control Flow Decision Making
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              ในการเขียนโปรแกรมภาษา Python การตัดสินใจเพื่อเลือกทำงานอย่างใดอย่างหนึ่งขึ้นอยู่กับความต้องการและเงื่อนไขขณะนั้น เรียกว่า <strong className="text-slate-800">โครงสร้างควบคุมแบบเลือกทำ (Selection Structure)</strong> โดยใช้คำสำคัญ 3 คำคือ:
            </p>

            {/* Conditionals Infographic cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-100">
                <span className="px-2 py-0.5 bg-emerald-600 text-white font-mono text-[10px] font-bold rounded-md">if</span>
                <h4 className="text-sm font-bold text-slate-800 mt-2 mb-1">ตรวจสอบเงื่อนไขแรก</h4>
                <p className="text-xs text-slate-500 leading-relaxed">ใช้เมื่อต้องการประเมินเงื่อนไขแรกสุด หากผลลัพธ์ของตรรกะเป็นจริง (True) โปรแกรมจะทำคำสั่งในบล็อกทันที</p>
              </div>
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-100">
                <span className="px-2 py-0.5 bg-indigo-600 text-white font-mono text-[10px] font-bold rounded-md">elif</span>
                <h4 className="text-sm font-bold text-slate-800 mt-2 mb-1">ตรวจสอบเงื่อนไขย่อยถัดมา</h4>
                <p className="text-xs text-slate-500 leading-relaxed">ย่อมาจาก (else if) ใช้เมื่อเงื่อนไขก่อนหน้าเป็นเท็จ และมีเงื่อนไขอื่นๆ ให้ตรวจสอบเพิ่มเติมอย่างเป็นลำดับ</p>
              </div>
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-100">
                <span className="px-2 py-0.5 bg-amber-600 text-white font-mono text-[10px] font-bold rounded-md">else</span>
                <h4 className="text-sm font-bold text-slate-800 mt-2 mb-1">กรณีที่เหลือทั้งหมด</h4>
                <p className="text-xs text-slate-500 leading-relaxed">ใช้เมื่อเงื่อนไขด้านบนเป็นเท็จทั้งหมด โปรแกรมจะเข้าทำในบล็อกนี้ทันทีโดยไม่ต้องตรวจสอบเพิ่มเติม</p>
              </div>
            </div>

            {/* Code syntax example */}
            <div className="bg-slate-900 text-slate-200 p-5 rounded-2xl font-mono text-xs shadow-md mb-6 relative">
              <div className="absolute top-3 right-3 text-[10px] text-slate-500 font-bold tracking-widest">SYNTAX</div>
              <p className="text-slate-400"># โครงสร้างการแบ่งช่วงคะแนนผู้เรียน (ปวช)</p>
              <p className="text-orange-400"><span className="text-indigo-400">score</span> = 75</p>
              <br />
              <p><span className="text-pink-400">if</span> score &gt;= 80:</p>
              <p className="text-emerald-400">    print("ผลการเรียนดีเยี่ยม")</p>
              <p><span className="text-pink-400">elif</span> score &gt;= 50:</p>
              <p className="text-emerald-400">    print("ผลการเรียนผ่านเกณฑ์")</p>
              <p><span className="text-pink-400">else</span>:</p>
              <p className="text-emerald-400">    print("ผลการเรียนไม่ผ่านเกณฑ์")</p>
            </div>
          </div>

          {/* Checkpoint 2 Challenge */}
          <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 backdrop-blur-md rounded-[32px] p-6 md:p-8 shadow-sm border border-orange-100 relative">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-orange-600 text-white rounded-full text-[10px] font-black uppercase tracking-wider">
                คำถามชวนคิดที่ 2
              </span>
              <span className="text-xs text-slate-500 font-bold">ฝึกประเมินทิศทางเงื่อนไข Python!</span>
            </div>
            <h4 className="text-sm md:text-base font-bold text-slate-800 mb-4 font-mono">
              โจทย์: หากค่าในตัวแปร `score = 65` หลังผ่านการประมวลผลโค้ดด้านล่างนี้ โปรแกรมจะตอบอย่างไร?
              <div className="bg-slate-800 text-slate-200 p-3 rounded-xl mt-3 font-mono text-xs">
                if score &gt;= 80:<br />
                &nbsp;&nbsp;&nbsp;&nbsp;print("ผ่านยอดเยี่ยม!")<br />
                elif score &gt;= 50:<br />
                &nbsp;&nbsp;&nbsp;&nbsp;print("ปรับปรุง!")<br />
                else:<br />
                &nbsp;&nbsp;&nbsp;&nbsp;print("ไม่ผ่านเกณฑ์!")
              </div>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              {[
                { label: "ก) ผ่านยอดเยี่ยม!", value: 0 },
                { label: "ข) ปรับปรุง!", value: 1 },
                { label: "ค) ไม่ผ่านเกณฑ์!", value: 2 }
              ].map((item) => {
                const isSelected = cp2Selected === item.value;
                const isCorrect = item.value === 1;
                
                let btnStyle = "border-slate-200 bg-white text-slate-700";
                if (cp2Checked) {
                  if (isCorrect) {
                    btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold";
                  } else if (isSelected) {
                    btnStyle = "border-red-500 bg-red-50 text-red-950 font-bold";
                  } else {
                    btnStyle = "border-slate-100 bg-slate-50/50 text-slate-400 opacity-60";
                  }
                } else if (isSelected) {
                  btnStyle = "border-orange-500 bg-orange-50 text-orange-950 font-bold";
                }

                return (
                  <button
                    key={item.value}
                    disabled={cp2Checked}
                    onClick={() => setCp2Selected(item.value)}
                    className={`p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${btnStyle} ${!cp2Checked ? 'hover:border-orange-400 hover:bg-slate-50' : ''}`}
                  >
                    <span>{item.label}</span>
                    {cp2Checked && isCorrect && <CheckCircle2 size={14} className="text-emerald-600" />}
                    {cp2Checked && isSelected && !isCorrect && <XCircle size={14} className="text-red-500" />}
                  </button>
                );
              })}
            </div>

            {cp2Checked && (
              <div className="p-3 bg-white/70 border border-orange-100 rounded-xl text-xs text-slate-600 leading-relaxed mb-4">
                <strong>เฉลยและอธิบาย:</strong> ตัวแปร `score` มีค่า `65` เมื่อตรวจสอบเงื่อนไขแรก {"score >= 80"} ({"65 >= 80"}) เป็นเท็จ จึงส่งข้ามมาตรวจสอบที่ {"elif score >= 50"} ({"65 >= 50"}) ซึ่งพบว่าเป็นจริง โปรแกรมจึงเลือกประมวลผลคำสั่งในบล็อกนั้น พิมพ์คำว่า <strong>"ปรับปรุง!"</strong>
              </div>
            )}

            {!cp2Checked ? (
              <button
                onClick={handleCheckpoint2Submit}
                className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md transition-all hover-lift"
              >
                ส่งตรวจคำตอบ
              </button>
            ) : (
              <button
                onClick={() => {
                  setCp2Checked(false);
                  setCp2Selected(null);
                }}
                className="px-5 py-2.5 bg-slate-600 hover:bg-slate-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <RefreshCw size={12} />
                ฝึกฝนใหม่อีกครั้ง
              </button>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: SIMULATED PYTHON CONSOLE */}
      {activeTab === 'tab4' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white/40 backdrop-blur-md rounded-[32px] p-6 md:p-8 shadow-sm border border-white/60 relative overflow-hidden shine-effect">
            <div className="flex items-center gap-3.5 mb-2 relative z-10">
              <div className="p-3 bg-slate-900 text-orange-400 rounded-2xl shadow-sm">
                <Terminal size={24} />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-800">
                  ห้องปฏิบัติการจำลองคอนโซล (Python Code Simulator)
                </h3>
                <p className="text-xs text-orange-600 font-semibold uppercase tracking-wider">
                  Self-Learning Interactive Playground
                </p>
              </div>
            </div>
            
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              ทดลองเปลี่ยนค่าตัวแปรในหน้าจอบรรณาธิการโค้ด และกดปุ่มรันเพื่อดูการแสดงผลแบบไลฟ์สตรีมทางหน้าจอคอนโซลทันที เพื่อเพิ่มพูนความสามารถและการเข้าใจของตนเอง!
            </p>

            {/* Presets Selection bar */}
            <div className="mb-4">
              <span className="text-xs font-bold text-slate-600 block mb-2 pl-1">เลือกตัวอย่างโค้ดเพื่อเริ่มเรียนรู้รวดเร็ว:</span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPlaygroundCode(p.code);
                      setPlaygroundOutput(["เปลี่ยนโค้ดเป็น '" + p.name + "' เรียบร้อยแล้ว! กดปุ่ม 'รันโปรแกรม' เพื่อประมวลผล"]);
                    }}
                    className="p-2 text-left bg-white/70 hover:bg-orange-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 transition-all hover:border-orange-300 truncate"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Workspace Area: Editor & Terminal Side-by-Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Left: Code Editor box */}
              <div className="flex flex-col">
                <div className="bg-slate-800/90 text-slate-300 px-4 py-2.5 rounded-t-2xl font-bold text-xs flex items-center justify-between border-b border-slate-700">
                  <span>code_editor.py</span>
                  <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded-md text-orange-400 font-mono">Editable</span>
                </div>
                <textarea
                  value={playgroundCode}
                  onChange={(e) => setPlaygroundCode(e.target.value)}
                  rows={10}
                  className="w-full bg-slate-900 text-slate-100 font-mono text-xs p-4 rounded-b-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 leading-relaxed resize-none border-t-0 shadow-inner"
                  placeholder="# เขียนรหัสภาษา Python ที่นี่..."
                />
                
                {/* Submit trigger button */}
                <button
                  onClick={handleRunPlayground}
                  disabled={isConsoleRunning}
                  className="mt-3 w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                >
                  {isConsoleRunning ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>กำลังรันโปรแกรม...</span>
                    </>
                  ) : (
                    <>
                      <Terminal size={16} />
                      <span>รันโปรแกรมคอนโซล (Run Python)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Right: Console Output terminal */}
              <div className="flex flex-col">
                <div className="bg-slate-900 text-slate-400 px-4 py-2.5 rounded-t-2xl font-bold text-xs flex items-center justify-between border-b border-slate-800">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    <span>Python Simulated Output Console</span>
                  </span>
                  <button
                    onClick={() => setPlaygroundOutput(["พร้อมทำงาน..."])}
                    className="text-[10px] hover:text-slate-200 transition-colors"
                  >
                    ล้างจอ
                  </button>
                </div>
                <div className="flex-1 bg-slate-950 text-emerald-400 font-mono text-xs p-4 rounded-b-2xl h-[240px] overflow-y-auto leading-relaxed shadow-inner">
                  {playgroundOutput.map((line, idx) => (
                    <div key={idx} className="whitespace-pre-wrap">
                      <span className="text-slate-600 mr-1.5">&gt;&gt;&gt;</span>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
