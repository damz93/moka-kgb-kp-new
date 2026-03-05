/**
 * MOKA KGB KP - Google Apps Script Backend
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a Google Spreadsheet.
 * 2. Rename Sheet1 to "Pengajuan".
 * 3. Create another sheet named "Pegawai".
 * 4. Create another sheet named "Admin".
 * 5. Create a folder in Google Drive for file uploads.
 * 
 * SPREADSHEET COLUMNS:
 * - Pengajuan: Ticket, NIK, Nama, Kategori, Status, FileID, Timestamp, Timeline
 * - Pegawai: NIK, Nama, Jabatan
 * - Admin: Username, Password, Token
 */

const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';
const DRIVE_FOLDER_ID = 'YOUR_DRIVE_FOLDER_ID';

function doGet(e) {
  const action = e.parameter.action;
  
  if (action === 'checkTicket') {
    return handleCheckTicket(e.parameter.ticket);
  }
  
  if (action === 'getAdminData') {
    return handleGetAdminData(e.parameter.token);
  }

  return createResponse({ success: false, message: 'Invalid action' });
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const action = data.action;

  if (action === 'submitRequest') {
    return handleSubmitRequest(data);
  }

  if (action === 'login') {
    return handleLogin(data);
  }

  if (action === 'updateStatus') {
    return handleUpdateStatus(data);
  }

  return createResponse({ success: false, message: 'Invalid action' });
}

// --- HANDLERS ---

function handleCheckTicket(ticket) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Pengajuan');
  const rows = sheet.getDataRange().getValues();
  
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === ticket) {
      const timelineRaw = rows[i][7] ? JSON.parse(rows[i][7]) : [];
      const status = rows[i][4];
      
      const timeline = [
        { label: 'Pengajuan Diterima', active: true, date: rows[i][6] },
        { label: 'Verifikasi Berkas', active: ['Diverifikasi', 'Diproses', 'Selesai'].includes(status) },
        { label: 'Sedang Diproses', active: ['Diproses', 'Selesai'].includes(status) },
        { label: 'Selesai / Diterbitkan', active: status === 'Selesai' }
      ];

      return createResponse({
        success: true,
        data: {
          ticket: rows[i][0],
          nik: rows[i][1],
          nama: rows[i][2],
          kategori: rows[i][3],
          status: rows[i][4],
          timeline: timeline
        }
      });
    }
  }
  
  return createResponse({ success: false });
}

function handleSubmitRequest(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Pengajuan');
  
  // Generate Ticket
  const ticket = 'TKT-' + Math.random().toString(36).substr(2, 6).toUpperCase();
  
  // Upload File to Drive
  const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
  const blob = Utilities.newBlob(Utilities.base64Decode(data.fileData), 'application/pdf', data.fileName);
  const file = folder.createFile(blob);
  
  // Save to Sheet
  sheet.appendRow([
    ticket,
    data.nik,
    data.nama,
    data.kategori,
    'Diajukan',
    file.getId(),
    new Date(),
    JSON.stringify([])
  ]);
  
  return createResponse({ success: true, ticket: ticket });
}

function handleLogin(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Admin');
  const rows = sheet.getDataRange().getValues();
  
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === data.username && rows[i][1] === data.password) {
      const token = Utilities.getUuid();
      sheet.getRange(i + 1, 3).setValue(token);
      return createResponse({ success: true, token: token });
    }
  }
  
  return createResponse({ success: false });
}

function handleGetAdminData(token) {
  if (!validateToken(token)) return createResponse({ success: false, message: 'Unauthorized' });
  
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const pengajuan = ss.getSheetByName('Pengajuan').getDataRange().getValues();
  const pegawai = ss.getSheetByName('Pegawai').getDataRange().getValues();
  
  const kgb = [];
  const kp = [];
  let pending = 0;
  let selesai = 0;
  
  for (let i = 1; i < pengajuan.length; i++) {
    const item = {
      ticket: pengajuan[i][0],
      nik: pengajuan[i][1],
      nama: pengajuan[i][2],
      kategori: pengajuan[i][3],
      status: pengajuan[i][4]
    };
    
    if (item.kategori === 'KGB') kgb.push(item);
    else kp.push(item);
    
    if (item.status === 'Diajukan') pending++;
    if (item.status === 'Selesai') selesai++;
  }
  
  const masterPegawai = [];
  for (let i = 1; i < pegawai.length; i++) {
    masterPegawai.push({ nik: pegawai[i][0], nama: pegawai[i][1], jabatan: pegawai[i][2] });
  }
  
  return createResponse({
    success: true,
    data: {
      stats: { kgb: kgb.length, kp: kp.length, pending, selesai },
      kgb: kgb.slice(-10).reverse(),
      kp: kp.slice(-10).reverse(),
      pegawai: masterPegawai,
      charts: {
        monthly: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei'], values: [12, 19, 3, 5, 2] },
        category: { kgb: kgb.length, kp: kp.length }
      }
    }
  });
}

function handleUpdateStatus(data) {
  if (!validateToken(data.token)) return createResponse({ success: false, message: 'Unauthorized' });
  
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Pengajuan');
  const rows = sheet.getDataRange().getValues();
  
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === data.ticket) {
      sheet.getRange(i + 1, 5).setValue(data.status);
      return createResponse({ success: true });
    }
  }
  
  return createResponse({ success: false, message: 'Ticket not found' });
}

function validateToken(token) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Admin');
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][2] === token) return true;
  }
  return false;
}

function createResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
