import { Question } from '../types';

export interface ExplanationQuestion extends Question {
  explanation: string;
}

export const pythonQuestions: ExplanationQuestion[] = [
  {
    id: 1,
    question: "ตัวดำเนินการ `//` ในภาษา Python หมายถึงข้อใด และผลลัพธ์ของ `10 // 3` คืออะไร?",
    options: [
      "ก) หารเอาส่วน (Floor Division) ผลลัพธ์คือ 3",
      "ข) หารปกติ (Division) ผลลัพธ์คือ 3.33",
      "ค) หารเอาเศษ (Modulo) ผลลัพธ์คือ 1",
      "ง) ยกกำลัง (Exponentiation) ผลลัพธ์คือ 1000"
    ],
    correctAnswer: "ก) หารเอาส่วน (Floor Division) ผลลัพธ์คือ 3",
    explanation: "ตัวดำเนินการ `//` คือ Floor Division ใช้ในการหารปัดเศษทศนิยมทิ้งให้เหลือเฉพาะจำนวนเต็ม ดังนั้น `10 // 3` จะได้ผลลัพธ์เป็น 3 (ปัด 3.333... ทิ้ง)"
  },
  {
    id: 2,
    question: "หากต้องการตรวจสอบว่าค่าในตัวแปร x เป็นเลขคู่หรือไม่ (เช่น หารด้วย 2 ลงตัว) ควรเขียนเงื่อนไขอย่างไร?",
    options: [
      "ก) if x % 2 == 0:",
      "ข) if x / 2 == 0:",
      "ค) if x // 2 == 0:",
      "ง) if x ** 2 == 0:"
    ],
    correctAnswer: "ก) if x % 2 == 0:",
    explanation: "เครื่องหมาย `%` (Modulo) ใช้สำหรับหาเศษจากการหาร ถ้าต้องการตรวจสอบเลขคู่ เศษที่ได้จากการหารด้วย 2 จะต้องเป็น 0 เสมอ จึงใช้ `x % 2 == 0`"
  },
  {
    id: 3,
    question: "กำหนดเงื่อนไข: `score = 75` \nถ้ามีโค้ด:\n```python\nif score >= 80:\n    print('A')\nelif score >= 70:\n    print('B')\nelse:\n    print('C')\n```\nโปรแกรมจะพิมพ์ผลลัพธ์ใดออกทางหน้าจอ?",
    options: [
      "ก) A",
      "ข) B",
      "ค) C",
      "ง) ไม่พิมพ์ข้อความใดเลย"
    ],
    correctAnswer: "ข) B",
    explanation: "ค่า `score` คือ 75 เมื่อผ่านเงื่อนไขแรก `score >= 80` (75 >= 80) เป็นเท็จ จึงข้ามมาที่เงื่อนไขถัดไป `elif score >= 70` (75 >= 70) ซึ่งเป็นจริง ดังนั้นโปรแกรมจะทำงานในบล็อกนี้และพิมพ์ 'B'"
  },
  {
    id: 4,
    question: "ตัวดำเนินการเปรียบเทียบในข้อใดหมายถึง 'ไม่เท่ากับ' ในภาษา Python?",
    options: [
      "ก) !=",
      "ข) <>",
      "ค) !==",
      "ง) =="
    ],
    correctAnswer: "ก) !=",
    explanation: "ในภาษา Python สัญลักษณ์ที่ใช้แทนความหมาย 'ไม่เท่ากับ' คือ `!=` ส่วน `==` หมายถึง 'เท่ากับ' และ `=` คือการกำหนดค่า"
  },
  {
    id: 5,
    question: "ตัวดำเนินการทางตรรกศาสตร์ `and` (และ) จะให้ผลลัพธ์เป็น จริง (True) ในกรณีใด?",
    options: [
      "ก) เงื่อนไขทั้งซ้ายและขวาต้องเป็น จริง (True) ทั้งคู่",
      "ข) เงื่อนไขด้านซ้ายเป็น จริง (True) เพียงด้านเดียว",
      "ค) เงื่อนไขด้านขวาเป็น จริง (True) เพียงด้านเดียว",
      "ง) เงื่อนไขทั้งสองด้านเป็น เท็จ (False) ทั้งคู่"
    ],
    correctAnswer: "ก) เงื่อนไขทั้งซ้ายและขวาต้องเป็น จริง (True) ทั้งคู่",
    explanation: "ตัวดำเนินการ `and` (และ) จะให้ผลลัพธ์เป็นจริงเมื่อเงื่อนไขแวดล้อมทั้งหมดที่นำมาเชื่อมโยงเป็นจริงร่วมกันเท่านั้น หากมีตัวใดตัวหนึ่งเป็นเท็จ ผลลัพธ์จะเป็นเท็จทันที"
  }
];

// Helper to shuffle array elements (useful for choices)
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

