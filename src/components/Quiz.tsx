import React, { useState, useEffect, useRef } from 'react';
import { Question, User } from '../types';
import { pythonQuestions, shuffleArray, ExplanationQuestion } from '../data/questions';
import { Clock, CheckSquare, AlertCircle, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import Swal from 'sweetalert2';

interface QuizProps {
  type: 'pre' | 'post';
  onComplete: (score: number) => void;
  user: User;
}

export default function Quiz({ type, onComplete, user }: QuizProps) {
  const [questions, setQuestions] = useState<ExplanationQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const [scoreTracker, setScoreTracker] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize questions
  useEffect(() => {
    const prepared = pythonQuestions.map((q) => {
      if (type === 'post') {
        // Shuffle choices for post-test to evaluate actual learning retention
        return {
          ...q,
          options: shuffleArray(q.options),
        };
      }
      return q;
    });
    setQuestions(prepared);
  }, [type]);

  // Handle Question Timer
  useEffect(() => {
    if (!isTestStarted || hasChecked) return;

    setTimeLeft(20);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIdx, isTestStarted, hasChecked]);

  const handleTimeOut = () => {
    Swal.fire({
      icon: 'warning',
      title: 'หมดเวลา!',
      text: 'คุณหมดเวลาทำข้อนี้แล้ว ระบบจะแสดงเฉลยทันที',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });

    // Auto-select empty, set checked to show explanation
    const nextAnswers = [...answers];
    nextAnswers[currentIdx] = '';
    setAnswers(nextAnswers);
    setSelectedAnswer('');
    setHasChecked(true);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) {
      Swal.fire({
        icon: 'warning',
        title: 'แจ้งเตือน',
        text: 'กรุณาเลือกคำตอบก่อนตรวจคำตอบ',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#f97316',
      });
      return;
    }

    if (timerRef.current) clearInterval(timerRef.current);

    const isCorrect = selectedAnswer === questions[currentIdx].correctAnswer;
    if (isCorrect) {
      setScoreTracker((prev) => prev + 1);
    }

    const nextAnswers = [...answers];
    nextAnswers[currentIdx] = selectedAnswer;
    setAnswers(nextAnswers);
    setHasChecked(true);
  };

  const handleNext = () => {
    setHasChecked(false);
    setSelectedAnswer(null);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    Swal.fire({
      title: 'ส่งแบบทดสอบเรียบร้อยแล้ว!',
      html: `คุณทำคะแนนทดสอบ <strong>${type === 'pre' ? 'ก่อนเรียน' : 'หลังเรียน'}</strong> ได้ <span class="text-orange-600 font-extrabold text-2xl">${scoreTracker}</span> จาก 5 คะแนน`,
      icon: 'success',
      confirmButtonText: 'บันทึกคะแนนและดำเนินการต่อ',
      confirmButtonColor: '#10b981',
    }).then(() => {
      onComplete(scoreTracker);
    });
  };

  const startTest = () => {
    setIsTestStarted(true);
    setCurrentIdx(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setHasChecked(false);
    setScoreTracker(0);
  };

  const currentQuestion = questions[currentIdx];

  if (!isTestStarted) {
    return (
      <div className="bg-white/40 backdrop-blur-md rounded-[32px] p-6 md:p-8 shadow-sm border border-white/60 relative overflow-hidden max-w-2xl mx-auto text-center animate-fade-in shine-effect">
        <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg shadow-orange-500/20">
          <CheckSquare size={36} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-3">
          แบบทดสอบ{type === 'pre' ? 'ก่อนเรียน' : 'หลังเรียน'}
        </h2>
        <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto leading-relaxed">
          แบบทดสอบเกี่ยวกับ <strong className="text-orange-500">ตัวดำเนินการและเงื่อนไขภาษา Python</strong> จำนวน <strong className="text-orange-500">5 ข้อ</strong><br />
          มีเวลาข้อละ <strong className="text-orange-500">20 วินาที</strong> เพื่อประเมินทักษะความรู้ความเข้าใจของคุณ
        </p>

        {type === 'pre' ? (
          <div className="flex items-center gap-2 p-4 bg-orange-50 text-orange-700 text-xs rounded-2xl border border-orange-200/50 max-w-md mx-auto mb-6">
            <AlertCircle size={18} className="shrink-0" />
            <span className="text-left font-semibold">คำแนะนำ: คุณจำเป็นต้องทำแบบทดสอบก่อนเรียนเพื่อปลดล็อกเนื้อหาบทเรียนทั้งหมด และเริ่มเรียนรู้อย่างเป็นขั้นตอน</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 p-4 bg-orange-50 text-orange-700 text-xs rounded-2xl border border-orange-200/50 max-w-md mx-auto mb-6">
            <AlertCircle size={18} className="shrink-0" />
            <span className="text-left font-semibold">คำแนะนำ: แบบทดสอบหลังเรียนจะสลับตัวเลือกเพื่อวัดผลความก้าวหน้าที่แท้จริง สามารถทำซ้ำเพื่อพัฒนาตนเองได้เมื่อเรียนจบ</span>
          </div>
        )}

        <button
          onClick={startTest}
          className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/20 hover-lift text-base"
        >
          เริ่มทำแบบทดสอบ
        </button>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="bg-white/40 backdrop-blur-md rounded-[32px] p-6 md:p-8 shadow-sm border border-white/60 relative overflow-hidden max-w-2xl mx-auto border border-white/50 animate-fade-in">
      {/* Header Info */}
      <div className="flex justify-between items-center gap-4 mb-6 pb-4 border-b border-slate-100/60">
        <div>
          <span className="text-xs font-bold text-orange-500 bg-orange-100/80 px-3 py-1 rounded-full uppercase tracking-wider">
            ข้อที่ {currentIdx + 1} จาก 5
          </span>
          <h3 className="text-base font-bold text-slate-800 mt-1.5">
            แบบทดสอบ{type === 'pre' ? 'ก่อนเรียน' : 'หลังเรียน'}
          </h3>
        </div>

        {/* Timer UI */}
        {!hasChecked && (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-2xl border border-red-100/50 shadow-inner">
            <Clock size={16} className={`animate-pulse ${timeLeft <= 5 ? 'text-red-600 stroke-[3]' : ''}`} />
            <span className="font-mono text-sm font-black w-6 text-center">
              {timeLeft}s
            </span>
          </div>
        )}
        {hasChecked && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-bold rounded-full">
            <span>ตรวจเรียบร้อยแล้ว</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2.5 rounded-full mb-8 overflow-hidden">
        <div
          className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all duration-300"
          style={{ width: `${((currentIdx + 1) / 5) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-white/60 rounded-2xl p-5 mb-6 border border-slate-200/50 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-orange-400 to-amber-400" />
        <h4 className="text-lg font-bold text-slate-800 leading-relaxed font-mono whitespace-pre-line">
          {currentQuestion.question}
        </h4>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3.5 mb-6">
        {currentQuestion.options.map((option, idx) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === currentQuestion.correctAnswer;
          
          let btnClass = 'border-slate-200/80 bg-white/70 hover:border-slate-300 hover:bg-white text-slate-700';
          let circleClass = 'border-slate-300 text-slate-500';

          if (hasChecked) {
            if (isCorrect) {
              // Highlight correct answer in green
              btnClass = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
              circleClass = 'border-emerald-500 bg-emerald-500 text-white';
            } else if (isSelected) {
              // Highlight selected incorrect answer in red
              btnClass = 'border-red-500 bg-red-50 text-red-900 font-bold';
              circleClass = 'border-red-500 bg-red-500 text-white';
            } else {
              // Mute other answers
              btnClass = 'border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed opacity-60';
              circleClass = 'border-slate-200 text-slate-300';
            }
          } else {
            if (isSelected) {
              btnClass = 'border-orange-500 bg-orange-50/70 text-orange-800 font-semibold shadow-md';
              circleClass = 'border-orange-500 bg-orange-500 text-white';
            }
          }

          return (
            <button
              key={idx}
              disabled={hasChecked}
              onClick={() => setSelectedAnswer(option)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 text-sm leading-relaxed flex items-center justify-between gap-3.5 ${btnClass} ${!hasChecked ? 'hover-lift' : ''}`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 font-mono text-xs ${circleClass}`}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="font-medium">{option}</span>
              </div>
              {hasChecked && isCorrect && (
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              )}
              {hasChecked && isSelected && !isCorrect && (
                <XCircle size={18} className="text-red-600 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation Feedback Block */}
      {hasChecked && (
        <div className="mb-6 p-4 rounded-2xl bg-orange-50/50 border border-orange-100 text-slate-700 text-xs animate-fade-in">
          <div className="flex items-center gap-2 text-orange-700 font-bold mb-1.5">
            <AlertCircle size={14} />
            <span>คำอธิบายคำตอบ:</span>
          </div>
          <p className="leading-relaxed text-slate-600">{currentQuestion.explanation}</p>
        </div>
      )}

      {/* Control Area */}
      <div className="flex justify-end">
        {!hasChecked ? (
          <button
            onClick={handleCheckAnswer}
            className="px-6 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-2xl shadow-md hover-lift flex items-center gap-2 text-sm"
          >
            <span>ตรวจคำตอบ</span>
            <CheckSquare size={16} />
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-2xl shadow-md hover-lift flex items-center gap-2 text-sm"
          >
            <span>{currentIdx < questions.length - 1 ? 'ข้อถัดไป' : 'ส่งแบบทดสอบและดูสถิติ'}</span>
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
