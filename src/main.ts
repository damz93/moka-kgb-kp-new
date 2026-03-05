import './index.css';
import { createIcons, Home, Search, FilePlus, User, CheckCircle2, Clock, AlertCircle, ChevronRight, LogOut, LayoutDashboard, Users, FileText, Settings, Plus, Edit2, Trash2, Filter } from 'lucide';
import Swal from 'sweetalert2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

// --- CONFIGURATION ---
const GAS_URL = 'https://script.google.com/macros/s/AKfycbxtRrvx2gnUtopyDs238JNH8CO2baH2k2K-JbNRzY2XXxH4sEtYlzYiAqpn6YfyaXN7iQ/exec'; // User will replace this

// --- STATE MANAGEMENT ---
let currentPage = 'home';
let isAdmin = !!localStorage.getItem('moka_token');
let adminData: any = null;

// --- UTILS ---
const $ = (selector: string) => document.querySelector(selector);
const $$ = (selector: string) => document.querySelectorAll(selector);

const render = () => {
  const main = $('#main-content');
  if (!main) return;

  // Update Navigation Active State
  $$('[data-page]').forEach(el => {
    if (el.getAttribute('data-page') === currentPage) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });

  // Render Page Content
  switch (currentPage) {
    case 'home': renderHome(main); break;
    case 'cek': renderCek(main); break;
    case 'ajukan': renderAjukan(main); break;
    case 'login': isAdmin ? renderAdmin(main) : renderLogin(main); break;
    case 'admin': renderAdmin(main); break;
    default: renderHome(main);
  }

  // Re-initialize Icons
  createIcons({
    icons: { Home, Search, FilePlus, User, CheckCircle2, Clock, AlertCircle, ChevronRight, LogOut, LayoutDashboard, Users, FileText, Settings, Plus, Edit2, Trash2, Filter }
  });
};

// --- PAGES ---

const renderHome = (container: Element) => {
  container.innerHTML = `
    <div class="animate-fade-in space-y-12">
      <!-- Hero -->
      <section class="text-center space-y-6 py-8">
        <h1 class="text-4xl md:text-6xl font-extrabold text-blue-950 leading-tight">
          Pengajuan KGB & KP <br/>
          <span class="text-blue-600">Lebih Mudah & Transparan</span>
        </h1>
        <p class="text-slate-500 text-lg max-w-2xl mx-auto">
          Sistem Informasi Monitoring dan Pengajuan Kenaikan Gaji Berkala serta Kenaikan Pangkat secara online dan real-time.
        </p>
        <div class="flex flex-col md:flex-row gap-4 justify-center pt-4">
          <button data-page="ajukan" class="btn-primary md:w-auto px-10">Ajukan Sekarang</button>
          <button data-page="cek" class="px-10 py-4 bg-white text-blue-600 font-bold rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-all">Cek Status</button>
        </div>
      </section>

      <!-- Features -->
      <div class="grid md:grid-cols-2 gap-8">
        <div class="glass-card p-8 space-y-4">
          <div class="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
            <i data-lucide="file-text" class="w-8 h-8"></i>
          </div>
          <h3 class="text-2xl font-bold text-blue-900">Syarat KGB</h3>
          <ul class="space-y-3 text-slate-600">
            <li class="flex items-center gap-2"><i data-lucide="check-circle-2" class="w-4 h-4 text-green-500"></i> SK Pangkat Terakhir</li>
            <li class="flex items-center gap-2"><i data-lucide="check-circle-2" class="w-4 h-4 text-green-500"></i> SK KGB Terakhir</li>
          </ul>
        </div>
        <div class="glass-card p-8 space-y-4">
          <div class="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
            <i data-lucide="users" class="w-8 h-8"></i>
          </div>
          <h3 class="text-2xl font-bold text-blue-900">Syarat KP</h3>
          <ul class="space-y-3 text-slate-600">
            <li class="flex items-center gap-2"><i data-lucide="check-circle-2" class="w-4 h-4 text-green-500"></i> SK CPNS & PNS</li>
            <li class="flex items-center gap-2"><i data-lucide="check-circle-2" class="w-4 h-4 text-green-500"></i> SK Pangkat Terakhir</li>
            <li class="flex items-center gap-2"><i data-lucide="check-circle-2" class="w-4 h-4 text-green-500"></i> SK Jabatan Terakhir</li>
            <li class="flex items-center gap-2"><i data-lucide="check-circle-2" class="w-4 h-4 text-green-500"></i> Surat Pernyataan Pelantikan(khusus pejabat) </li>            
            <li class="flex items-center gap-2"><i data-lucide="check-circle-2" class="w-4 h-4 text-green-500"></i> Ijazah & Transkrip Terakhir</li>
          </ul>
        </div>
      </div>
    </div>
  `;
};

const renderCek = (container: Element) => {
  container.innerHTML = `
    <div class="animate-fade-in max-w-2xl mx-auto space-y-8">
      <div class="text-center space-y-2">
        <h2 class="text-3xl font-bold text-blue-950">Cek Status Pengajuan</h2>
        <p class="text-slate-500">Masukkan nomor tiket pengajuan Anda</p>
      </div>
      
      <div class="glass-card p-8 space-y-6">
        <div class="space-y-4">
          <input type="text" id="ticket-input" class="input-field text-center text-2xl font-bold tracking-widest uppercase" placeholder="TKT-XXXXXX">
          <button id="btn-cek" class="btn-primary">Cari Pengajuan</button>
        </div>
      </div>

      <div id="cek-result" class="hidden animate-fade-in">
        <!-- Result will be here -->
      </div>
    </div>
  `;

  $('#btn-cek')?.addEventListener('click', async () => {
    const ticket = (($('#ticket-input') as HTMLInputElement).value || '').trim();
    if (!ticket) return Swal.fire('Error', 'Masukkan nomor tiket', 'error');

    const resultDiv = $('#cek-result');
    if (!resultDiv) return;

    resultDiv.innerHTML = '<div class="flex justify-center py-12"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>';
    resultDiv.classList.remove('hidden');

    try {
      const res = await fetch(`${GAS_URL}?action=checkTicket&ticket=${ticket}`);
      const data = await res.json();

      if (!data.success) {
        resultDiv.innerHTML = `
          <div class="glass-card p-12 text-center space-y-4">
            <div class="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <i data-lucide="alert-circle" class="w-10 h-10"></i>
            </div>
            <h3 class="text-xl font-bold">Tiket Tidak Ditemukan</h3>
            <p class="text-slate-500">Pastikan nomor tiket yang Anda masukkan benar.</p>
          </div>
        `;
      } else {
        const { nama, nik, kategori, status, timeline } = data.data;
        const statusColors: any = {
          'Diajukan': 'bg-blue-100 text-blue-600',
          'Diverifikasi': 'bg-amber-100 text-amber-600',
          'Diproses': 'bg-indigo-100 text-indigo-600',
          'Selesai': 'bg-green-100 text-green-600',
          'Ditolak': 'bg-red-100 text-red-600'
        };

        resultDiv.innerHTML = `
          <div class="glass-card p-8 space-y-8">
            <div class="flex justify-between items-start border-b border-white/40 pb-6">
              <div>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Nama Pegawai</p>
                <h3 class="text-2xl font-bold text-blue-950">${nama}</h3>
                <p class="text-slate-500">NIK: ${nik}</p>
              </div>
              <span class="px-4 py-2 rounded-full text-sm font-bold ${statusColors[status] || 'bg-slate-100'}">${status}</span>
            </div>

            <div class="space-y-6">
              <h4 class="font-bold text-slate-700 flex items-center gap-2">
                <i data-lucide="clock" class="w-5 h-5"></i> Timeline Progress
              </h4>
              <div class="relative pl-8 space-y-8">
                <div class="timeline-line"></div>
                ${timeline.map((t: any, i: number) => `
                  <div class="relative animate-fade-in" style="animation-delay: ${i * 100}ms">
                    <div class="absolute -left-8 top-1 timeline-dot ${t.active ? 'bg-blue-600' : 'bg-slate-200'}"></div>
                    <div class="${t.active ? 'text-blue-900 font-bold' : 'text-slate-400'}">
                      <p class="text-sm">${t.label}</p>
                      <p class="text-xs opacity-70">${t.date || ''}</p>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `;
      }
      createIcons({ icons: { AlertCircle, Clock, CheckCircle2 } });
    } catch (e) {
      resultDiv.innerHTML = '<p class="text-center text-red-500">Gagal mengambil data. Periksa koneksi atau URL API.</p>';
    }
  });
};

const renderAjukan = (container: Element) => {
  container.innerHTML = `
    <div class="animate-fade-in max-w-2xl mx-auto space-y-8">
      <div class="text-center space-y-2">
        <h2 class="text-3xl font-bold text-blue-950">Form Pengajuan</h2>
        <p class="text-slate-500">Lengkapi data di bawah untuk mengajukan KGB/KP</p>
      </div>

      <form id="form-ajukan" class="glass-card p-8 space-y-6">
        <div class="space-y-2">
          <label class="text-sm font-bold text-slate-600 ml-1">NIK</label>
          <input type="text" name="nik" required class="input-field" placeholder="Masukkan 16 digit NIK">
        </div>
        <div class="space-y-2">
          <label class="text-sm font-bold text-slate-600 ml-1">Nama Lengkap</label>
          <input type="text" name="nama" required class="input-field" placeholder="Nama sesuai SK">
        </div>
        <div class="space-y-2">
          <label class="text-sm font-bold text-slate-600 ml-1">Kategori Pengajuan</label>
          <select name="kategori" required class="input-field appearance-none">
            <option value="KGB">Kenaikan Gaji Berkala (KGB)</option>
            <option value="KP">Kenaikan Pangkat (KP)</option>
          </select>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-bold text-slate-600 ml-1">Upload Berkas (PDF)</label>
          <div class="relative group">
            <input type="file" id="file-input" accept=".pdf" required class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10">
            <div class="input-field flex items-center justify-center gap-3 border-dashed border-2 border-blue-200 bg-blue-50/30 group-hover:bg-blue-50 transition-all py-8">
              <i data-lucide="file-plus" class="w-6 h-6 text-blue-500"></i>
              <span id="file-label" class="text-slate-500">Pilih file PDF (Maks 5MB)</span>
            </div>
          </div>
        </div>
        <div class="pt-4">
          <button type="submit" class="btn-primary">Kirim Pengajuan</button>
        </div>
      </form>
    </div>
  `;

  const fileInput = $('#file-input') as HTMLInputElement;
  fileInput?.addEventListener('change', (e: any) => {
    const fileName = e.target.files[0]?.name || 'Pilih file PDF (Maks 5MB)';
    const label = $('#file-label');
    if (label) label.textContent = fileName;
  });

  $('#form-ajukan')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const file = fileInput.files?.[0];

    if (!file) return Swal.fire('Error', 'Pilih file berkas', 'error');

    Swal.fire({
      title: 'Mengirim...',
      text: 'Mohon tunggu sebentar',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        
        const payload = {
          action: 'submitRequest',
          nik: formData.get('nik'),
          nama: formData.get('nama'),
          kategori: formData.get('kategori'),
          fileName: file.name,
          fileData: base64
        };

        const res = await fetch(GAS_URL, {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            html: `Simpan nomor tiket Anda:<br/><b class="text-2xl text-blue-600">${data.ticket}</b>`,
            confirmButtonText: 'Selesai'
          }).then(() => {
            currentPage = 'home';
            render();
          });
        } else {
          Swal.fire('Gagal', data.message || 'Terjadi kesalahan', 'error');
        }
      };
    } catch (err) {
      Swal.fire('Error', 'Gagal menghubungi server', 'error');
    }
  });
};

const renderLogin = (container: Element) => {
  container.innerHTML = `
    <div class="animate-fade-in max-w-md mx-auto space-y-8 pt-12">
      <div class="text-center space-y-2">
        <h2 class="text-3xl font-bold text-blue-950">Login Admin</h2>
        <p class="text-slate-500">Akses dashboard pengelolaan data</p>
      </div>

      <form id="form-login" class="glass-card p-8 space-y-6">
        <div class="space-y-2">
          <label class="text-sm font-bold text-slate-600 ml-1">Username</label>
          <input type="text" name="username" required class="input-field" placeholder="Admin username">
        </div>
        <div class="space-y-2">
          <label class="text-sm font-bold text-slate-600 ml-1">Password</label>
          <input type="password" name="password" required class="input-field" placeholder="••••••••">
        </div>
        <div class="pt-4">
          <button type="submit" class="btn-primary">Masuk</button>
        </div>
      </form>
    </div>
  `;

  $('#form-login')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    Swal.fire({ title: 'Authenticating...', didOpen: () => Swal.showLoading() });

    try {
      const res = await fetch(GAS_URL, {
        method: 'POST',
        body: JSON.stringify({
          action: 'login',
          username: formData.get('username'),
          password: formData.get('password')
        })
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('moka_token', data.token);
        isAdmin = true;
        Swal.close();
        currentPage = 'admin';
        render();
      } else {
        Swal.fire('Gagal', 'Username atau password salah', 'error');
      }
    } catch (err) {
      Swal.fire('Error', 'Gagal login', 'error');
    }
  });
};

const renderAdmin = (container: Element) => {
  container.innerHTML = `
    <div class="animate-fade-in space-y-8">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-3xl font-bold text-blue-950">Admin Dashboard</h2>
          <p class="text-slate-500">Monitoring pengajuan & data pegawai</p>
        </div>
        <button id="btn-logout" class="flex items-center gap-2 text-red-500 font-bold hover:bg-red-50 px-4 py-2 rounded-xl transition-all">
          <i data-lucide="log-out" class="w-5 h-5"></i> Keluar
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="glass-card p-6 text-center">
          <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total KGB</p>
          <h4 class="text-3xl font-bold text-blue-600" id="stat-kgb">0</h4>
        </div>
        <div class="glass-card p-6 text-center">
          <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total KP</p>
          <h4 class="text-3xl font-bold text-indigo-600" id="stat-kp">0</h4>
        </div>
        <div class="glass-card p-6 text-center">
          <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Pending</p>
          <h4 class="text-3xl font-bold text-amber-600" id="stat-pending">0</h4>
        </div>
        <div class="glass-card p-6 text-center">
          <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Selesai</p>
          <h4 class="text-3xl font-bold text-green-600" id="stat-selesai">0</h4>
        </div>
      </div>

      <!-- Charts -->
      <div class="grid md:grid-cols-2 gap-8">
        <div class="glass-card p-6">
          <h3 class="font-bold text-slate-700 mb-4">Tren Pengajuan Bulanan</h3>
          <canvas id="chart-monthly"></canvas>
        </div>
        <div class="glass-card p-6">
          <h3 class="font-bold text-slate-700 mb-4">Distribusi Kategori</h3>
          <canvas id="chart-category"></canvas>
        </div>
      </div>

      <!-- Tabs -->
      <div class="glass-card overflow-hidden">
        <div class="flex border-b border-white/40 bg-white/20">
          <button class="admin-tab active px-6 py-4 font-bold text-sm" data-tab="kgb">Data KGB</button>
          <button class="admin-tab px-6 py-4 font-bold text-sm" data-tab="kp">Data KP</button>
          <button class="admin-tab px-6 py-4 font-bold text-sm" data-tab="pegawai">Master Pegawai</button>
        </div>
        <div id="admin-tab-content" class="p-6 overflow-x-auto no-scrollbar">
          <div class="flex justify-center py-12"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
        </div>
      </div>
    </div>
  `;

  $('#btn-logout')?.addEventListener('click', () => {
    localStorage.removeItem('moka_token');
    isAdmin = false;
    currentPage = 'home';
    render();
  });

  loadAdminData();
};

const loadAdminData = async () => {
  try {
    const res = await fetch(`${GAS_URL}?action=getAdminData&token=${localStorage.getItem('moka_token')}`);
    const data = await res.json();
    if (!data.success) return renderLogin($('#main-content')!);

    adminData = data.data;
    
    // Update Stats
    if ($('#stat-kgb')) $('#stat-kgb')!.textContent = adminData.stats.kgb;
    if ($('#stat-kp')) $('#stat-kp')!.textContent = adminData.stats.kp;
    if ($('#stat-pending')) $('#stat-pending')!.textContent = adminData.stats.pending;
    if ($('#stat-selesai')) $('#stat-selesai')!.textContent = adminData.stats.selesai;

    // Render Charts
    renderCharts(adminData.charts);

    // Initial Tab
    renderAdminTab('kgb');

    // Tab Events
    $$('.admin-tab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        $$('.admin-tab').forEach(b => b.classList.remove('active', 'text-blue-600', 'border-b-2', 'border-blue-600'));
        (e.target as HTMLElement).classList.add('active', 'text-blue-600', 'border-b-2', 'border-blue-600');
        renderAdminTab((e.target as HTMLElement).getAttribute('data-tab') || 'kgb');
      });
    });

  } catch (err) {
    console.error(err);
  }
};

const renderCharts = (chartData: any) => {
  const ctxMonthly = (document.getElementById('chart-monthly') as HTMLCanvasElement)?.getContext('2d');
  const ctxCategory = (document.getElementById('chart-category') as HTMLCanvasElement)?.getContext('2d');

  if (ctxMonthly) {
    new Chart(ctxMonthly, {
      type: 'line',
      data: {
        labels: chartData.monthly.labels,
        datasets: [{
          label: 'Pengajuan',
          data: chartData.monthly.values,
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });
  }

  if (ctxCategory) {
    new Chart(ctxCategory, {
      type: 'doughnut',
      data: {
        labels: ['KGB', 'KP'],
        datasets: [{
          data: [chartData.category.kgb, chartData.category.kp],
          backgroundColor: ['#2563eb', '#6366f1']
        }]
      },
      options: { responsive: true }
    });
  }
};

const renderAdminTab = (tab: string) => {
  const content = $('#admin-tab-content');
  if (!content) return;

  if (tab === 'kgb' || tab === 'kp') {
    const list = adminData[tab];
    content.innerHTML = `
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="text-slate-400 text-xs uppercase tracking-widest border-b border-white/20">
            <th class="pb-4 font-bold">Tiket</th>
            <th class="pb-4 font-bold">Nama</th>
            <th class="pb-4 font-bold">Status</th>
            <th class="pb-4 font-bold text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="text-sm">
          ${list.map((item: any) => `
            <tr class="border-b border-white/10 hover:bg-white/10 transition-colors">
              <td class="py-4 font-mono font-bold text-blue-600">${item.ticket}</td>
              <td class="py-4 font-bold text-slate-700">${item.nama}</td>
              <td class="py-4">
                <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-50 text-blue-600">${item.status}</span>
              </td>
              <td class="py-4 text-right">
                <button onclick="window.updateStatus('${item.ticket}')" class="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"><i data-lucide="edit-2" class="w-4 h-4"></i></button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } else if (tab === 'pegawai') {
    content.innerHTML = `
      <div class="flex justify-between mb-4">
        <h4 class="font-bold text-slate-700">Master Pegawai</h4>
        <button class="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2"><i data-lucide="plus" class="w-4 h-4"></i> Tambah Pegawai</button>
      </div>
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="text-slate-400 text-xs uppercase tracking-widest border-b border-white/20">
            <th class="pb-4 font-bold">NIK</th>
            <th class="pb-4 font-bold">Nama</th>
            <th class="pb-4 font-bold">Jabatan</th>
            <th class="pb-4 font-bold text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="text-sm">
          ${adminData.pegawai.map((p: any) => `
            <tr class="border-b border-white/10 hover:bg-white/10 transition-colors">
              <td class="py-4 font-mono">${p.nik}</td>
              <td class="py-4 font-bold text-slate-700">${p.nama}</td>
              <td class="py-4 text-slate-500">${p.jabatan}</td>
              <td class="py-4 text-right space-x-2">
                <button class="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-all"><i data-lucide="edit-2" class="w-4 h-4"></i></button>
                <button class="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }
  createIcons({ icons: { Edit2, Trash2, Plus } });
};

// --- GLOBAL ACTIONS ---
(window as any).updateStatus = async (ticket: string) => {
  const { value: status } = await Swal.fire({
    title: 'Update Status',
    input: 'select',
    inputOptions: {
      'Diajukan': 'Diajukan',
      'Diverifikasi': 'Diverifikasi',
      'Diproses': 'Diproses',
      'Selesai': 'Selesai',
      'Ditolak': 'Ditolak'
    },
    inputPlaceholder: 'Pilih status baru',
    showCancelButton: true
  });

  if (status) {
    Swal.fire({ title: 'Updating...', didOpen: () => Swal.showLoading() });
    try {
      const res = await fetch(GAS_URL, {
        method: 'POST',
        body: JSON.stringify({
          action: 'updateStatus',
          ticket,
          status,
          token: localStorage.getItem('moka_token')
        })
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire('Berhasil', 'Status diperbarui', 'success');
        loadAdminData();
      } else {
        Swal.fire('Gagal', data.message, 'error');
      }
    } catch (err) {
      Swal.fire('Error', 'Gagal update status', 'error');
    }
  }
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  render();

  // Global Click Listener for Navigation
  document.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest('[data-page]');
    if (target) {
      const page = target.getAttribute('data-page');
      if (page) {
        currentPage = page;
        render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  });
});
