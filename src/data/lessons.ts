export interface OperatorInfo {
  symbol: string;
  name: string;
  description: string;
  example: string;
  result: string;
  emoji: string;
}

export interface OperatorTypeInfo {
  title: string;
  description: string;
  emoji: string;
  color: string;
  examples: string[];
}

export const operatorTypes: OperatorTypeInfo[] = [
  {
    title: "1. ตัวดำเนินการทางคณิตศาสตร์ (Arithmetic Operators)",
    description: "ใช้ในการดำเนินการทางคณิตศาสตร์พื้นฐาน เช่น บวก ลบ คูณ หาร",
    emoji: "➕",
    color: "from-blue-400 to-indigo-500",
    examples: ["`+` (บวก)", "`-` (ลบ)", "`*` (คูณ)", "`/` (หาร)", "`%` (หารเอาเศษ)", "`//` (หารเอาส่วน)", "`**` (ยกกำลัง)"]
  },
  {
    title: "2. ตัวดำเนินการเปรียบเทียบ (Comparison Operators)",
    description: "ใช้เปรียบเทียบค่าสองค่า ผลลัพธ์ที่ได้จะเป็นจริง (True) หรือเท็จ (False)",
    emoji: "⚖️",
    color: "from-green-400 to-emerald-500",
    examples: ["`==` (เท่ากับ)", "`!=` (ไม่เท่ากับ)", `>` + " (มากกว่า)", `<` + " (น้อยกว่า)", `>=` + " (มากกว่าหรือเท่ากับ)", `<=` + " (น้อยกว่าหรือเท่ากับ)"]
  },
  {
    title: "3. ตัวดำเนินการกำหนดค่า (Assignment Operators)",
    description: "ใช้กำหนดค่าให้กับตัวแปร หรือดำเนินการแล้วกำหนดค่าใหม่",
    emoji: "💾",
    color: "from-amber-400 to-orange-500",
    examples: ["`=` (กำหนดค่า)", "`+=` (บวกเพิ่มแล้วกำหนดค่า)", "`-=` (ลบออกแล้วกำหนดค่า)", "`*=` (คูณแล้วกำหนดค่า)"]
  },
  {
    title: "4. ตัวดำเนินการทางตรรกศาสตร์ (Logical Operators)",
    description: "ใช้เชื่อมเงื่อนไขทางตรรกศาสตร์ ได้แก่ and (และ), or (หรือ), not (ไม่)",
    emoji: "🧠",
    color: "from-purple-400 to-pink-500",
    examples: ["`and` (เป็นจริงเมื่อทั้งคู่เป็นจริง)", "`or` (เป็นจริงเมื่อมีอย่างน้อยหนึ่งตัวเป็นจริง)", "`not` (กลับค่าตรรกะเดิม)"]
  }
];

export const arithmeticOperators: OperatorInfo[] = [
  {
    symbol: "+",
    name: "บวก (Addition)",
    description: "นำค่าสองค่ามาบวกกัน",
    example: "x = 10 + 5",
    result: "15",
    emoji: "🍎"
  },
  {
    symbol: "-",
    name: "ลบ (Subtraction)",
    description: "นำค่าทางขวามาลบออกจากค่าทางซ้าย",
    example: "x = 10 - 5",
    result: "5",
    emoji: "🍋"
  },
  {
    symbol: "*",
    name: "คูณ (Multiplication)",
    description: "นำค่าสองค่ามาคูณกัน",
    example: "x = 10 * 5",
    result: "50",
    emoji: "🍇"
  },
  {
    symbol: "/",
    name: "หาร (Division)",
    description: "นำค่าทางซ้ายตั้ง หารด้วยค่าทางขวา (ผลลัพธ์เป็นทศนิยมเสมอ)",
    example: "x = 10 / 4",
    result: "2.5",
    emoji: "🍉"
  },
  {
    symbol: "%",
    name: "หารเอาเศษ (Modulo)",
    description: "หารค่าทางซ้ายด้วยค่าทางขวาแล้วหาค่าเศษที่เหลือจากการหาร",
    example: "x = 10 % 3",
    result: "1",
    emoji: "🍰"
  },
  {
    symbol: "//",
    name: "หารเอาส่วนปัดเศษทิ้ง (Floor Division)",
    description: "หารสองจำนวนและปัดเศษทศนิยมทิ้งให้เป็นจำนวนเต็ม",
    example: "x = 10 // 3",
    result: "3",
    emoji: "🍕"
  },
  {
    symbol: "**",
    name: "ยกกำลัง (Exponentiation)",
    description: "นำค่าทางซ้ายมาเป็นตัวตั้ง และยกกำลังด้วยค่าทางขวา",
    example: "x = 2 ** 3  (คือ 2 x 2 x 2)",
    result: "8",
    emoji: "🚀"
  }
];
