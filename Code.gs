function doGet(e) {
  if (e.parameter && e.parameter.action === 'appendSale') {
    try {
      const ss = SpreadsheetApp.openById('1yu_6kjN7e1fTSpRfY5Z2HSRCO_YNgDNXn1lM1WUJix4');
      const sheet = ss.getSheetByName('المبيعات');

      const row = [
        e.parameter.date || '',
        e.parameter.product || '',
        e.parameter.total || '',
        e.parameter.soldQty || ''
      ];

      // حصر نطاق A4:D100
      const START_ROW = 4;
      const END_ROW = 100;
      const RANGE_ROWS = END_ROW - START_ROW + 1;

      const range = sheet.getRange(`A${START_ROW}:D${END_ROW}`);
      const values = range.getValues();

      // البحث عن أول صف فارغ داخل هذا النطاق
      let targetRowIndex = -1;
      for (let i = 0; i < RANGE_ROWS; i++) {
        if (values[i].join('') === '') {
          targetRowIndex = START_ROW + i;
          break;
        }
      }

      if (targetRowIndex === -1) {
        throw new Error('لا يوجد صف فارغ متاح في النطاق A4:D100');
      }

      // إدخال البيانات في الصف الفارغ المحدد
      sheet.getRange(targetRowIndex, 1, 1, 4).setValues([row]);

      Logger.log(`✅ Sale row inserted at row ${targetRowIndex}: ${JSON.stringify(row)}`);

      return ContentService
        .createTextOutput(JSON.stringify({ success: true, insertedAt: targetRowIndex }))
        .setMimeType(ContentService.MimeType.JSON);

    } catch (err) {
      Logger.log('🚨 Error: ' + err.message);
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: err.message }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService
    .createTextOutput(JSON.stringify({ success: false, error: 'No action or invalid action specified' }))
    .setMimeType(ContentService.MimeType.JSON);
}
