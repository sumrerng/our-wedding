const SHEET_NAME = 'RSVP'

function doGet() {
  return ContentService
    .createTextOutput('RSVP endpoint is ready')
    .setMimeType(ContentService.MimeType.TEXT)
}

function doPost(event) {
  if (!event || !event.postData || !event.postData.contents) {
    throw new Error('doPost ต้องเรียกผ่าน Web App URL จากฟอร์มเว็บไซต์ ไม่ใช่กด Run ใน Apps Script')
  }

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  if (!spreadsheet) {
    throw new Error('Apps Script นี้ยังไม่ได้ผูกกับ Google Sheet ให้สร้างจาก Extensions > Apps Script ในไฟล์ Sheet')
  }

  const sheet = spreadsheet.getSheetByName(SHEET_NAME)
  if (!sheet) {
    throw new Error(`ไม่พบแท็บชื่อ ${SHEET_NAME} กรุณาสร้างแท็บ RSVP ใน Google Sheet`)
  }

  const data = JSON.parse(event.postData.contents)

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Name', 'Guests', 'Contact', 'Note'])
  }

  sheet.appendRow([
    new Date(),
    data.guestName || '',
    data.guests || '',
    data.contact || '',
    data.note || '',
  ])

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON)
}