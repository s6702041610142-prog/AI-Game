/**
 * Google Apps Script (สำหรับบันทึกความก้าวหน้าการเรียนลง Google Sheets)
 * 
 * วิธีการติดตั้งและใช้งาน:
 * 1. เปิด Google Sheets ใหม่ หรือที่มีอยู่เดิม
 * 2. ไปที่เมนู "ส่วนขยาย" -> "Apps Script" (Extensions -> Apps Script)
 * 3. คัดลอกโค้ดด้านล่างนี้ทั้งหมดไปวางแทนที่โค้ดเดิมใน Editor
 * 4. กดปุ่มบันทึก (ไอคอนแผ่นดิสก์)
 * 5. กดปุ่ม "การทำให้ใช้งานได้" (Deploy) -> "การทำให้ใช้งานได้ใหม่" (New deployment)
 * 6. เลือกประเภทเป็น "เว็บแอป" (Web app)
 *    - คำอธิบาย: บันทึกคะแนนผู้เรียนภาษา Python
 *    - ผู้มีสิทธิ์เข้าถึง: เลือก "ทุกคน" (Anyone) ** สำคัญมาก **
 * 7. กด "การทำให้ใช้งานได้" (Deploy) แล้วคัดลอก URL เว็บแอปที่ได้ ไปใส่ในไฟล์ `/src/App.tsx` แทนที่ `APPS_SCRIPT_URL`
 */

function doPost(e) {
  // ดึงชีตปัจจุบันที่กำลังทำงาน
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // ตรวจสอบและตั้งค่าหัวตารางหากเป็นชีตว่างเปล่า
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "ชื่อ-นามสกุลผู้เรียน", 
      "คะแนนก่อนเรียน (Pre-test)", 
      "คะแนนหลังเรียน (Post-test)", 
      "คะแนนพัฒนาการ (Improvement)", 
      "เวลาเข้าเรียน", 
      "เวลาเรียนจบการประเมิน"
    ]);
  }
  
  try {
    // แปลงข้อมูล JSON ที่ส่งมาจากเว็บไซต์บทเรียนออนไลน์
    var data = JSON.parse(e.postData.contents);
    
    // บันทึกข้อมูลลงแถวใหม่
    sheet.appendRow([
      data.fullName,
      data.preScore,
      data.postScore,
      data.improvement,
      data.loginTime,
      data.logoutTime
    ]);
    
    // ตอบกลับสำเร็จในรูปแบบ JSON (หลีกเลี่ยงการใช้ setHeader เพื่อไม่ให้เกิด TypeError)
    return ContentService.createTextOutput(JSON.stringify({ 
      "status": "success", 
      "message": "บันทึกผลการเรียนลง Google Sheets สำเร็จแล้ว!" 
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // ตอบกลับเมื่อเกิดข้อผิดพลาด
    return ContentService.createTextOutput(JSON.stringify({ 
      "status": "error", 
      "message": error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("ระบบเชื่อมโยงข้อมูลวิชา Python ทำงานปกติ!")
    .setMimeType(ContentService.MimeType.TEXT);
}
