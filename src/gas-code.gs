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
 * - Pegawai: NIK, Nama, Jabatan, Unit Kerja, Lokasi Kerja, TMT KGB Next, TMT KP Next, Status, ASN
 * - Admin: Username, Password, Token
 */

const SPREADSHEET_ID = '1UKTmm9YIW4yHLddAIJhoGiIpZn62x_HiiSbd7fl_Q8A';
const DRIVE_FOLDER_ID = '1CapLlJAqhax7OvHJCJ20XaewkoVopC1k';

function doGet(e) {
  try {
    const action = (e && e.parameter) ? e.parameter.action : '';
    
    if (action === 'checkTicket') {
      return handleCheckTicket(e.parameter.ticket);
    }
    
    if (action === 'checkNIP') {
      return handleCheckNIP(e.parameter.nip);
    }
    
    if (action === 'getAdminData') {
      return handleGetAdminData(e.parameter.token);
    }

    return createResponse({ success: false, message: 'Invalid action: ' + action });
  } catch (err) {
    return createResponse({ success: false, message: 'Server Error: ' + err.toString() });
  }
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return createResponse({ success: false, message: 'No payload provided' });
    }
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

    if (action === 'savePegawai') {
      return handleSavePegawai(data);
    }

    if (action === 'deletePegawai') {
      return handleDeletePegawai(data);
    }

    return createResponse({ success: false, message: 'Invalid action: ' + action });
  } catch (err) {
    return createResponse({ success: false, message: 'Server Error: ' + err.toString() });
  }
}

// --- HELPER FUNCTIONS ---

function getOrCreateSheet(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (headers && headers.length > 0) {
      sheet.appendRow(headers);
    }
  }
  return sheet;
}

// --- HANDLERS ---

function handleCheckTicket(ticket) {
  if (!ticket) return createResponse({ success: false, message: 'Nomor tiket tidak boleh kosong' });
  
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = getOrCreateSheet(ss, 'Pengajuan', ['Ticket', 'NIK', 'Nama', 'Kategori', 'Status', 'FileID', 'Timestamp', 'Timeline']);
  const rows = sheet.getDataRange().getValues();
  
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] && rows[i][0].toString().trim().toUpperCase() === ticket.toString().trim().toUpperCase()) {
      const status = rows[i][4] || 'Diajukan';
      
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
          status: status,
          timestamp: rows[i][6],
          timeline: timeline
        }
      });
    }
  }
  
  return createResponse({ success: false, message: 'Tiket tidak ditemukan' });
}

function handleSubmitRequest(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = getOrCreateSheet(ss, 'Pengajuan', ['Ticket', 'NIK', 'Nama', 'Kategori', 'Status', 'FileID', 'Timestamp', 'Timeline']);
  
  // Generate Ticket
  const ticket = 'TKT-' + Math.random().toString(36).substr(2, 6).toUpperCase();
  
  // Upload File to Drive if provided
  let fileId = '';
  if (data.fileData && data.fileName) {
    try {
      const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
      const blob = Utilities.newBlob(Utilities.base64Decode(data.fileData), 'application/pdf', data.fileName);
      const file = folder.createFile(blob);
      fileId = file.getId();
    } catch (e) {
      console.error('Drive upload error:', e);
    }
  }

  // Check if NIP is in Pegawai sheet, if not, auto add
  const pegawaiSheet = getOrCreateSheet(ss, 'Pegawai', ['NIK', 'Nama', 'Jabatan', 'Unit Kerja', 'Lokasi Kerja', 'TMT KGB Next', 'TMT KP Next', 'Status', 'ASN']);
  const pegawaiRows = pegawaiSheet.getDataRange().getValues();
  let found = false;
  for (let i = 1; i < pegawaiRows.length; i++) {
    if (pegawaiRows[i][0] && pegawaiRows[i][0].toString() === data.nik.toString()) {
      found = true;
      break;
    }
  }

  let isNewPegawai = false;
  if (!found && data.nik) {
    isNewPegawai = true;
    pegawaiSheet.appendRow([
      data.nik,
      data.nama || '-',
      '-',
      '-',
      '-',
      '',
      '',
      'Aktif',
      data.kategori === 'KP' ? 'PNS' : 'PNS'
    ]);
  }
  
  // Save to Sheet
  sheet.appendRow([
    ticket,
    data.nik,
    data.nama,
    data.kategori,
    'Diajukan',
    fileId,
    new Date(),
    JSON.stringify([])
  ]);
  
  return createResponse({ success: true, ticket: ticket, isNewPegawai: isNewPegawai });
}

function handleLogin(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = getOrCreateSheet(ss, 'Admin', ['Username', 'Password', 'Token']);
  const rows = sheet.getDataRange().getValues();
  
  // Auto-seed default admin if empty
  if (rows.length <= 1) {
    sheet.appendRow(['admin', 'admin123', '']);
    if (data.username === 'admin' && data.password === 'admin123') {
      const token = Utilities.getUuid();
      sheet.getRange(2, 3).setValue(token);
      return createResponse({ success: true, token: token });
    }
  }

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0].toString() === data.username.toString() && rows[i][1].toString() === data.password.toString()) {
      const token = Utilities.getUuid();
      sheet.getRange(i + 1, 3).setValue(token);
      return createResponse({ success: true, token: token });
    }
  }
  
  return createResponse({ success: false, message: 'Username atau password salah' });
}

function handleGetAdminData(token) {
  if (!validateToken(token)) return createResponse({ success: false, message: 'Unauthorized' });
  
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const pengajuanSheet = getOrCreateSheet(ss, 'Pengajuan', ['Ticket', 'NIK', 'Nama', 'Kategori', 'Status', 'FileID', 'Timestamp', 'Timeline']);
  const pegawaiSheet = getOrCreateSheet(ss, 'Pegawai', ['NIK', 'Nama', 'Jabatan', 'Unit Kerja', 'Lokasi Kerja', 'TMT KGB Next', 'TMT KP Next', 'Status', 'ASN']);
  
  const pengajuan = pengajuanSheet.getDataRange().getValues();
  const pegawai = pegawaiSheet.getDataRange().getValues();
  
  const kgb = [];
  const kp = [];
  let pending = 0;
  let selesai = 0;
  
  for (let i = 1; i < pengajuan.length; i++) {
    if (!pengajuan[i][0]) continue;
    const item = {
      ticket: pengajuan[i][0],
      nik: pengajuan[i][1],
      nama: pengajuan[i][2],
      kategori: pengajuan[i][3],
      status: pengajuan[i][4],
      timestamp: pengajuan[i][6]
    };
    
    if (item.kategori === 'KGB') kgb.push(item);
    else kp.push(item);
    
    if (item.status === 'Diajukan') pending++;
    if (item.status === 'Selesai') selesai++;
  }
  
  const masterPegawai = [];
  for (let i = 1; i < pegawai.length; i++) {
    if (!pegawai[i][0]) continue;
    masterPegawai.push({ 
      nik: pegawai[i][0], 
      nama: pegawai[i][1], 
      jabatan: pegawai[i][2],
      unitKerja: pegawai[i][3],
      lokasiKerja: pegawai[i][4],
      tmtKgbNext: pegawai[i][5],
      tmtKpNext: pegawai[i][6],
      status: pegawai[i][7],
      asn: pegawai[i][8] || 'PNS'
    });
  }
  
  return createResponse({
    success: true,
    data: {
      stats: { kgb: kgb.length, kp: kp.length, pending, selesai },
      kgb: kgb.reverse(),
      kp: kp.reverse(),
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
  const sheet = getOrCreateSheet(ss, 'Pengajuan', ['Ticket', 'NIK', 'Nama', 'Kategori', 'Status', 'FileID', 'Timestamp', 'Timeline']);
  const rows = sheet.getDataRange().getValues();
  
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] && rows[i][0].toString() === data.ticket.toString()) {
      sheet.getRange(i + 1, 5).setValue(data.status);
      return createResponse({ success: true });
    }
  }
  
  return createResponse({ success: false, message: 'Ticket not found' });
}

function handleSavePegawai(data) {
  if (!validateToken(data.token)) return createResponse({ success: false, message: 'Unauthorized' });
  
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = getOrCreateSheet(ss, 'Pegawai', ['NIK', 'Nama', 'Jabatan', 'Unit Kerja', 'Lokasi Kerja', 'TMT KGB Next', 'TMT KP Next', 'Status', 'ASN']);
  const rows = sheet.getDataRange().getValues();
  
  let foundIndex = -1;
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] && rows[i][0].toString() === data.nik.toString()) {
      foundIndex = i + 1;
      break;
    }
  }
  
  const rowData = [
    data.nik, 
    data.nama, 
    data.jabatan, 
    data.unitKerja, 
    data.lokasiKerja, 
    data.tmtKgbNext, 
    data.tmtKpNext, 
    data.status,
    data.asn || 'PNS'
  ];
  
  if (foundIndex !== -1) {
    sheet.getRange(foundIndex, 1, 1, 9).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }
  
  return createResponse({ success: true });
}

function handleDeletePegawai(data) {
  if (!validateToken(data.token)) return createResponse({ success: false, message: 'Unauthorized' });
  
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = getOrCreateSheet(ss, 'Pegawai', ['NIK', 'Nama', 'Jabatan', 'Unit Kerja', 'Lokasi Kerja', 'TMT KGB Next', 'TMT KP Next', 'Status', 'ASN']);
  const rows = sheet.getDataRange().getValues();
  
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] && rows[i][0].toString() === data.nik.toString()) {
      sheet.deleteRow(i + 1);
      return createResponse({ success: true });
    }
  }
  
  return createResponse({ success: false, message: 'Pegawai not found' });
}

function handleCheckNIP(nip) {
  if (!nip) return createResponse({ success: false, message: 'NIP tidak boleh kosong' });
  
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = getOrCreateSheet(ss, 'Pegawai', ['NIK', 'Nama', 'Jabatan', 'Unit Kerja', 'Lokasi Kerja', 'TMT KGB Next', 'TMT KP Next', 'Status', 'ASN']);
  const rows = sheet.getDataRange().getValues();
  
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] && rows[i][0].toString().trim() === nip.toString().trim()) {
      return createResponse({
        success: true,
        data: {
          nik: rows[i][0],
          nama: rows[i][1],
          jabatan: rows[i][2],
          unitKerja: rows[i][3],
          lokasiKerja: rows[i][4],
          tmtKgbNext: rows[i][5],
          tmtKpNext: rows[i][6],
          status: rows[i][7],
          asn: rows[i][8] || 'PNS'
        }
      });
    }
  }
  
  return createResponse({ success: false, message: 'NIP tidak ditemukan' });
}

function validateToken(token) {
  if (!token) return false;
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = getOrCreateSheet(ss, 'Admin', ['Username', 'Password', 'Token']);
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][2] && rows[i][2].toString() === token.toString()) return true;
  }
  return false;
}

function createResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
