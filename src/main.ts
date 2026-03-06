import './index.css';
import { createIcons, Home, Search, FilePlus, User, CheckCircle2, Clock, AlertCircle, ChevronRight, LogOut, LayoutDashboard, Users, FileText, Settings, Plus, Edit2, Trash2, Filter } from 'lucide';
import Swal from 'sweetalert2';

// --- CONFIGURATION ---
const GAS_URL = 'https://script.google.com/macros/s/AKfycbxhrCUKHLpYLeTYRFK4xMCaegKcehMWj2l7PoAVHIzByWvrWt7nPqbY6G0CN4yrd8v0tA/exec'; // User will replace this

// --- STATE MANAGEMENT ---
let currentPage = 'home';
let isAdmin = !!localStorage.getItem('moka_token');
let adminData: any = null;
let adminTab = 'dashboard';

// --- UTILS ---
const $ = (selector: string) => document.querySelector(selector);
const $$ = (selector: string) => document.querySelectorAll(selector);

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return dateStr;
  }
};

const isNear = (dateStr: string, thresholdDays: number) => {
  if (!dateStr) return false;
  const target = new Date(dateStr);
  const now = new Date();
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 && diffDays <= thresholdDays;
};

const render = () => {
  const main = $('#main-content');
  const navDesktop = $('#nav-desktop');
  const navMobile = $('#nav-mobile');
  if (!main) return;

  // If logged in as admin, force admin page if on home/login
  if (isAdmin && (currentPage === 'home' || currentPage === 'login')) {
    currentPage = 'admin';
  }

  // Show/Hide Main Navigation
  if (isAdmin || currentPage === 'admin') {
    if (navDesktop) (navDesktop as HTMLElement).style.display = 'none';
    if (navMobile) (navMobile as HTMLElement).style.display = 'none';
    main.className = 'min-h-screen'; // Reset classes for admin
  } else {
    // Reset display styles to let Tailwind classes work
    if (navDesktop) (navDesktop as HTMLElement).style.display = '';
    if (navMobile) (navMobile as HTMLElement).style.display = '';
    main.className = 'pt-24 pb-32 md:pb-12 px-4 max-w-5xl mx-auto';
  }

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
            <li class="flex items-center gap-2"><i data-lucide="check-circle-2" class="w-4 h-4 text-green-500"></i> Penilaian Kinerja (SKP)</li>
          </ul>
        </div>
        <div class="glass-card p-8 space-y-4">
          <div class="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
            <i data-lucide="users" class="w-8 h-8"></i>
          </div>
          <h3 class="text-2xl font-bold text-blue-900">Syarat KP</h3>
          <ul class="space-y-3 text-slate-600">
            <li class="flex items-center gap-2"><i data-lucide="check-circle-2" class="w-4 h-4 text-green-500"></i> SK CPNS & PNS</li>
            <li class="flex items-center gap-2"><i data-lucide="check-circle-2" class="w-4 h-4 text-green-500"></i> Ijazah Terakhir</li>
            <li class="flex items-center gap-2"><i data-lucide="check-circle-2" class="w-4 h-4 text-green-500"></i> SKP 2 Tahun Terakhir</li>
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
        <p class="text-slate-500">Masukkan NIK Anda untuk melihat status pengajuan terbaru</p>
      </div>
      
      <div class="glass-card p-8 space-y-6">
        <div class="space-y-4">
          <input type="text" id="nik-input" class="input-field text-center text-2xl font-bold tracking-widest" placeholder="MASUKKAN 16 DIGIT NIK">
          <button id="btn-cek" class="btn-primary">Cari Pengajuan</button>
        </div>
      </div>

      <div id="cek-result" class="hidden animate-fade-in">
        <!-- Result will be here -->
      </div>
    </div>
  `;

  $('#btn-cek')?.addEventListener('click', async () => {
    const nik = (($('#nik-input') as HTMLInputElement).value || '').trim();
    if (!nik) return Swal.fire('Error', 'Masukkan NIK Anda', 'error');
    if (nik.length < 10) return Swal.fire('Error', 'NIK tidak valid', 'error');

    const resultDiv = $('#cek-result');
    if (!resultDiv) return;

    resultDiv.innerHTML = '<div class="flex justify-center py-12"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>';
    resultDiv.classList.remove('hidden');

    try {
      const res = await fetch(`${GAS_URL}?action=checkByNIK&nik=${nik}`);
      const data = await res.json();

      if (!data.success) {
        resultDiv.innerHTML = `
          <div class="glass-card p-12 text-center space-y-4">
            <div class="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <i data-lucide="alert-circle" class="w-10 h-10"></i>
            </div>
            <h3 class="text-xl font-bold">Data Tidak Ditemukan</h3>
            <p class="text-slate-500">Belum ada pengajuan aktif untuk NIK ${nik}.</p>
          </div>
        `;
      } else {
        const { nama, nik: resNik, kategori, status, timeline, timestamp } = data.data;
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
                <p class="text-slate-500">NIK: ${resNik} • Kategori: <span class="font-bold text-blue-600">${kategori}</span></p>
                <p class="text-xs text-slate-400 mt-1">Diajukan: ${formatDate(timestamp)}</p>
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
                      <p class="text-xs opacity-70">${t.date ? formatDate(t.date) : ''}</p>
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
    <div class="animate-fade-in">
      <!-- Sidebar -->
      <aside class="admin-sidebar p-4 flex flex-col">
        <div class="sidebar-header px-4 py-6 mb-6 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
            <h2 class="font-bold text-slate-800 text-lg">SIMPEG</h2>
          </div>
        </div>
        
        <nav class="flex-1 space-y-2 flex md:flex-col">
          <button data-admin-tab="dashboard" class="admin-menu-item ${adminTab === 'dashboard' ? 'active' : ''}">
            <i data-lucide="layout-dashboard"></i> <span>Dashboard</span>
          </button>
          <button data-admin-tab="pegawai" class="admin-menu-item ${adminTab === 'pegawai' ? 'active' : ''}">
            <i data-lucide="users"></i> <span>Data Pegawai</span>
          </button>
          <button data-admin-tab="kp" class="admin-menu-item ${adminTab === 'kp' ? 'active' : ''}">
            <i data-lucide="file-text"></i> <span>Monitoring KP</span>
          </button>
          <button data-admin-tab="kgb" class="admin-menu-item ${adminTab === 'kgb' ? 'active' : ''}">
            <i data-lucide="file-text"></i> <span>Monitoring KGB</span>
          </button>
        </nav>

        <div class="sidebar-footer pt-4 mt-4 border-t border-slate-100">
          <button id="btn-logout" class="admin-menu-item text-red-500 hover:bg-red-50 w-full">
            <i data-lucide="log-out" class="w-4 h-4"></i> <span>Keluar</span>
          </button>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="admin-main">
        <!-- Header -->
        <header class="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-40 flex justify-between items-center">
          <div>
            <h1 id="admin-page-title" class="text-xl font-bold text-slate-800">Dashboard</h1>
            <p class="text-xs text-slate-400">Selamat datang di Sistem Monitoring Kepegawaian</p>
          </div>
          <div class="flex items-center gap-6">
            <div class="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 gap-2 w-64">
              <i data-lucide="search" class="w-4 h-4 text-slate-400"></i>
              <input type="text" placeholder="Cari pegawai..." class="bg-transparent border-none outline-none text-sm w-full">
            </div>
            <div class="flex items-center gap-4">
              <button class="relative p-2 text-slate-400 hover:text-blue-600 transition-colors">
                <i data-lucide="clock" class="w-5 h-5"></i>
                <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div class="h-8 w-px bg-slate-200"></div>
              <div class="flex items-center gap-3">
                <div class="text-right hidden sm:block">
                  <p class="text-xs font-bold text-slate-800">Admin SIMPEG</p>
                  <p class="text-[10px] text-slate-400">Administrator</p>
                </div>
                <div class="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                  <i data-lucide="user" class="w-6 h-6"></i>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div id="admin-content" class="p-8">
          <div class="flex justify-center py-12"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
        </div>
      </main>
    </div>
  `;

  $('#btn-logout')?.addEventListener('click', () => {
    localStorage.removeItem('moka_token');
    isAdmin = false;
    currentPage = 'home';
    render();
  });

  // Sidebar Tab Events
  $$('[data-admin-tab]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tab = (e.currentTarget as HTMLElement).getAttribute('data-admin-tab') || 'dashboard';
      adminTab = tab;
      
      // Update active state in UI
      $$('[data-admin-tab]').forEach(b => b.classList.remove('active'));
      (e.currentTarget as HTMLElement).classList.add('active');
      
      // Update Page Title
      const titleMap: any = { 'dashboard': 'Dashboard', 'pegawai': 'Data Pegawai', 'kp': 'Monitoring KP', 'kgb': 'Monitoring KGB' };
      const titleEl = $('#admin-page-title');
      if (titleEl) titleEl.textContent = titleMap[tab] || 'Dashboard';

      renderAdminContent();
    });
  });

  loadAdminData();
};

const loadAdminData = async () => {
  try {
    const res = await fetch(`${GAS_URL}?action=getAdminData&token=${localStorage.getItem('moka_token')}`);
    const data = await res.json();
    if (!data.success) return renderLogin($('#main-content')!);

    adminData = data.data;
    renderAdminContent();
  } catch (err) {
    console.error(err);
  }
};

const renderAdminContent = () => {
  const container = $('#admin-content');
  if (!container) return;

  switch (adminTab) {
    case 'dashboard': renderAdminDashboard(container as HTMLElement); break;
    case 'pegawai': renderAdminPegawai(container as HTMLElement); break;
    case 'kp': renderAdminMonitoring(container as HTMLElement, 'kp'); break;
    case 'kgb': renderAdminMonitoring(container as HTMLElement, 'kgb'); break;
  }

  createIcons({ icons: { LayoutDashboard, Users, FileText, LogOut, Plus, Edit2, Trash2, Filter, CheckCircle2, Clock, AlertCircle } });
};

const populateFilters = () => {
  const monthFilter = $('#filter-month') as HTMLSelectElement;
  const yearFilter = $('#filter-year') as HTMLSelectElement;
  if (!monthFilter || !yearFilter) return;

  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  monthFilter.innerHTML = months.map((m, i) => `<option value="${i}" ${i === new Date().getMonth() ? 'selected' : ''}>${m}</option>`).join('');

  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear - 2; y <= currentYear + 2; y++) {
    years.push(y);
  }
  yearFilter.innerHTML = years.map(y => `<option value="${y}" ${y === currentYear ? 'selected' : ''}>${y}</option>`).join('');

  monthFilter.addEventListener('change', renderMonthlyList);
  yearFilter.addEventListener('change', renderMonthlyList);
};

const renderMonthlyList = () => {
  const container = $('#monthly-list-container');
  const monthFilter = $('#filter-month') as HTMLSelectElement;
  const yearFilter = $('#filter-year') as HTMLSelectElement;
  if (!container || !monthFilter || !yearFilter) return;

  const month = parseInt(monthFilter.value);
  const year = parseInt(yearFilter.value);

  const allRequests = [...adminData.kgb, ...adminData.kp];
  const filtered = allRequests.filter(item => {
    const date = new Date(item.timestamp);
    return date.getMonth() === month && date.getFullYear() === year;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<p class="text-center py-12 text-slate-400">Tidak ada pengajuan pada periode ini.</p>`;
    return;
  }

  container.innerHTML = `
    <div class="mb-4 flex items-center justify-between">
      <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Ditemukan ${filtered.length} Pengajuan</p>
    </div>
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="text-slate-400 text-xs uppercase tracking-widest border-b border-white/20">
          <th class="pb-4 font-bold">Tanggal</th>
          <th class="pb-4 font-bold">Nama</th>
          <th class="pb-4 font-bold">Kategori</th>
          <th class="pb-4 font-bold">Status</th>
        </tr>
      </thead>
      <tbody class="text-sm">
        ${filtered.map(item => `
          <tr class="border-b border-white/10 hover:bg-white/10 transition-colors">
            <td class="py-4 text-slate-500">${formatDate(item.timestamp).split(' pukul')[0]}</td>
            <td class="py-4 font-bold text-slate-700">${item.nama}</td>
            <td class="py-4">
              <span class="px-2 py-1 rounded-md text-[10px] font-bold uppercase ${item.kategori === 'KGB' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'}">${item.kategori}</span>
            </td>
            <td class="py-4">
              <span class="text-xs font-medium text-slate-600">${item.status}</span>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
};

const renderAdminDashboard = (container: HTMLElement) => {
  container.innerHTML = `
    <div class="animate-fade-in space-y-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-4">
          <div class="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white">
            <i data-lucide="users" class="w-6 h-6"></i>
          </div>
          <div>
            <p class="text-slate-400 text-xs font-medium">Total Pegawai</p>
            <div class="flex items-baseline gap-2">
              <h4 class="text-3xl font-bold text-slate-800">${adminData.pegawai.length}</h4>
              <span class="text-[10px] text-green-500 font-bold">+2 bulan ini</span>
            </div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-4 relative">
          <div class="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white">
            <i data-lucide="file-text" class="w-6 h-6"></i>
          </div>
          <div>
            <p class="text-slate-400 text-xs font-medium">Jatuh Tempo Kenaikan Pangkat</p>
            <div class="flex items-baseline gap-2">
              <h4 class="text-3xl font-bold text-slate-800">${adminData.pegawai.filter((p: any) => isNear(p.tmtKpNext, 180)).length}</h4>
              <span class="text-[10px] text-slate-400 font-medium">6 bulan ke depan</span>
            </div>
          </div>
          <span class="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full"></span>
        </div>
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-4 relative">
          <div class="w-12 h-12 bg-pink-500 rounded-2xl flex items-center justify-center text-white">
            <i data-lucide="file-text" class="w-6 h-6"></i>
          </div>
          <div>
            <p class="text-slate-400 text-xs font-medium">Jatuh Tempo Kenaikan Gaji Berkala</p>
            <div class="flex items-baseline gap-2">
              <h4 class="text-3xl font-bold text-slate-800">${adminData.pegawai.filter((p: any) => isNear(p.tmtKgbNext, 90)).length}</h4>
              <span class="text-[10px] text-slate-400 font-medium">3 bulan ke depan</span>
            </div>
          </div>
          <span class="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full"></span>
        </div>
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-4">
          <div class="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white">
            <i data-lucide="check-circle-2" class="w-6 h-6"></i>
          </div>
          <div>
            <p class="text-slate-400 text-xs font-medium">Pegawai Aktif</p>
            <div class="flex items-baseline gap-2">
              <h4 class="text-3xl font-bold text-slate-800">${adminData.pegawai.length}</h4>
              <span class="text-[10px] text-slate-400 font-medium">98% dari total</span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Chart Section -->
        <div class="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-8">
          <div class="flex justify-between items-center">
            <h3 class="font-bold text-slate-800">Distribusi Pegawai per Bidang</h3>
            <select class="bg-slate-50 border-none text-xs font-bold text-slate-500 rounded-lg px-3 py-2 outline-none">
              <option>Tahun 2024</option>
            </select>
          </div>
          <div class="h-64 flex items-end justify-around gap-4 pt-4">
            <div class="flex-1 flex flex-col items-center gap-3">
              <div class="w-full bg-blue-500 rounded-t-lg" style="height: 60%"></div>
              <span class="text-[10px] text-slate-400 font-bold">Umum</span>
            </div>
            <div class="flex-1 flex flex-col items-center gap-3">
              <div class="w-full bg-indigo-500 rounded-t-lg" style="height: 60%"></div>
              <span class="text-[10px] text-slate-400 font-bold">Perencanaan</span>
            </div>
            <div class="flex-1 flex flex-col items-center gap-3">
              <div class="w-full bg-pink-500 rounded-t-lg" style="height: 80%"></div>
              <span class="text-[10px] text-slate-400 font-bold">Sekretariat</span>
            </div>
            <div class="flex-1 flex flex-col items-center gap-3">
              <div class="w-full bg-red-500 rounded-t-lg" style="height: 20%"></div>
              <span class="text-[10px] text-slate-400 font-bold">Kepegawaian</span>
            </div>
            <div class="flex-1 flex flex-col items-center gap-3">
              <div class="w-full bg-amber-500 rounded-t-lg" style="height: 20%"></div>
              <span class="text-[10px] text-slate-400 font-bold">Keuangan</span>
            </div>
          </div>
        </div>

        <!-- Notifications Section -->
        <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <h3 class="font-bold text-slate-800">Pemberitahuan Terkini</h3>
          <div class="space-y-6">
            <div class="flex gap-4">
              <div class="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 shrink-0">
                <i data-lucide="clock" class="w-5 h-5"></i>
              </div>
              <div class="space-y-1">
                <p class="text-sm font-bold text-slate-800">KGB Mendatang</p>
                <p class="text-xs text-slate-500 leading-relaxed">3 Pegawai di Bidang Keuangan akan jatuh tempo KGB bulan depan.</p>
                <p class="text-[10px] font-bold text-blue-600 uppercase tracking-wider pt-1">Baru Saja</p>
              </div>
            </div>
            <div class="flex gap-4">
              <div class="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500 shrink-0">
                <i data-lucide="alert-circle" class="w-5 h-5"></i>
              </div>
              <div class="space-y-1">
                <p class="text-sm font-bold text-slate-800">Berkas KP Kurang</p>
                <p class="text-xs text-slate-500 leading-relaxed">Andi Wijaya belum mengunggah SK Jabatan terakhir.</p>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-1">2 Jam Yang Lalu</p>
              </div>
            </div>
            <div class="flex gap-4">
              <div class="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-500 shrink-0">
                <i data-lucide="check-circle-2" class="w-5 h-5"></i>
              </div>
              <div class="space-y-1">
                <p class="text-sm font-bold text-slate-800">KP Disetujui</p>
                <p class="text-xs text-slate-500 leading-relaxed">Kenaikan pangkat Siti Aminah telah disetujui BKN.</p>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-1">Kemarin</p>
              </div>
            </div>
          </div>
          <button class="w-full py-3 text-blue-600 text-xs font-bold hover:bg-blue-50 rounded-xl transition-colors mt-4">Lihat Semua Aktivitas</button>
        </div>
      </div>
    </div>
  `;
};

const renderAdminPegawai = (container: HTMLElement) => {
  container.innerHTML = `
    <div class="animate-fade-in space-y-6">
      <!-- Filters & Actions -->
      <div class="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="flex flex-1 w-full md:w-auto gap-4">
          <div class="flex-1 flex items-center bg-slate-50 rounded-2xl px-4 py-3 gap-3 border border-slate-100">
            <i data-lucide="search" class="w-4 h-4 text-slate-400"></i>
            <input type="text" placeholder="Cari NIP atau Nama..." class="bg-transparent border-none outline-none text-sm w-full">
          </div>
          <div class="flex items-center bg-slate-50 rounded-2xl px-4 py-3 gap-3 border border-slate-100 min-w-[120px]">
            <i data-lucide="filter" class="w-4 h-4 text-slate-400"></i>
            <select class="bg-transparent border-none outline-none text-sm w-full font-medium text-slate-600">
              <option>Semua</option>
            </select>
          </div>
        </div>
        <div class="flex gap-3 w-full md:w-auto">
          <button class="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <i data-lucide="file-plus" class="w-4 h-4"></i> Export
          </button>
          <button onclick="window.editPegawai()" class="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
            <i data-lucide="plus" class="w-4 h-4"></i> Tambah Pegawai
          </button>
        </div>
      </div>

      <div class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="overflow-x-auto no-scrollbar">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="text-slate-400 text-[10px] uppercase tracking-widest border-b border-slate-50 bg-slate-50/50">
                <th class="p-6 font-bold">Pegawai</th>
                <th class="p-6 font-bold">Jabatan / GOL</th>
                <th class="p-6 font-bold">Bidang</th>
                <th class="p-6 font-bold">Status</th>
                <th class="p-6 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="text-sm">
              ${adminData.pegawai.map((p: any) => {
                const initials = p.nama.split(' ').map((n: any) => n[0]).join('').substring(0, 2).toUpperCase();
                return `
                <tr class="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td class="p-6">
                    <div class="flex items-center gap-4">
                      <div class="avatar">${initials}</div>
                      <div>
                        <p class="font-bold text-slate-800">${p.nama}</p>
                        <p class="text-[10px] font-mono text-slate-400">${p.nik}</p>
                      </div>
                    </div>
                  </td>
                  <td class="p-6">
                    <p class="text-xs font-bold text-slate-600">${p.jabatan}</p>
                    <p class="text-[10px] text-slate-400 mt-1">III/D</p>
                  </td>
                  <td class="p-6 text-slate-500 text-xs">Umum</td>
                  <td class="p-6">
                    <span class="status-badge status-active">Aktif</span>
                  </td>
                  <td class="p-6 text-right">
                    <div class="flex justify-end gap-2">
                      <button onclick="window.editPegawai('${p.nik}')" class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><i data-lucide="edit-2" class="w-4 h-4"></i></button>
                      <button onclick="window.deletePegawai('${p.nik}')" class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                    </div>
                  </td>
                </tr>
              `}).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
};

const renderAdminMonitoring = (container: HTMLElement, type: 'kp' | 'kgb') => {
  const nearCount = adminData.pegawai.filter((p: any) => isNear(type === 'kp' ? p.tmtKpNext : p.tmtKgbNext, type === 'kp' ? 180 : 90)).length;
  const overdueCount = adminData.pegawai.filter((p: any) => {
    const date = type === 'kp' ? p.tmtKpNext : p.tmtKgbNext;
    if (!date) return false;
    return new Date(date) < new Date();
  }).length;

  // Filter pegawai yang "Soon" atau "Overdue"
  const filteredPegawai = adminData.pegawai.filter((p: any) => {
    const targetDate = type === 'kp' ? p.tmtKpNext : p.tmtKgbNext;
    if (!targetDate) return false;
    const isOverdue = new Date(targetDate) < new Date();
    const isSoon = isNear(targetDate, type === 'kp' ? 180 : 90);
    return isOverdue || isSoon;
  });

  const themeColor = type === 'kp' ? 'blue' : 'pink';
  const themeBg = type === 'kp' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-pink-600 to-rose-600';

  container.innerHTML = `
    <div class="animate-fade-in space-y-8">
      <!-- Header Banner -->
      <div class="${themeBg} p-10 rounded-[40px] text-white flex flex-col md:flex-row justify-between items-center gap-8 shadow-xl shadow-${themeColor}-200">
        <div class="space-y-2 text-center md:text-left">
          <h2 class="text-3xl font-bold">Monitoring ${type === 'kp' ? 'Kenaikan Pangkat' : 'Kenaikan Gaji Berkala'}</h2>
          <p class="text-white/80 text-sm max-w-md">Terdapat ${nearCount} pegawai menjelang ${type.toUpperCase()} dan ${overdueCount} pegawai melewati masa ${type.toUpperCase()}.</p>
        </div>
        <div class="flex gap-4">
          <div class="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 text-center min-w-[100px]">
            <p class="text-4xl font-bold">${adminData.pegawai.length}</p>
            <p class="text-[10px] font-bold uppercase tracking-widest opacity-70">Total Pegawai</p>
          </div>
          <div class="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 text-center min-w-[100px]">
            <p class="text-4xl font-bold">${overdueCount}</p>
            <p class="text-[10px] font-bold uppercase tracking-widest opacity-70">Melewati Masa</p>
          </div>
          <div class="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 text-center min-w-[100px] text-yellow-300">
            <p class="text-4xl font-bold">${nearCount}</p>
            <p class="text-[10px] font-bold uppercase tracking-widest opacity-70">Menjelang ${type.toUpperCase()}</p>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <i data-lucide="clock" class="w-5 h-5 text-${themeColor}-600"></i>
            <h3 class="font-bold text-slate-800">Daftar Pegawai Jatuh Tempo ${type.toUpperCase()}</h3>
          </div>
          <p class="text-xs text-slate-400 font-medium">Menampilkan ${filteredPegawai.length} pegawai yang memerlukan perhatian</p>
        </div>

        <div class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div class="overflow-x-auto no-scrollbar">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="text-slate-400 text-[10px] uppercase tracking-widest border-b border-slate-50 bg-slate-50/50">
                  <th class="p-6 font-bold">Pegawai</th>
                  <th class="p-6 font-bold">Jabatan</th>
                  <th class="p-6 font-bold">${type.toUpperCase()} Berikutnya</th>
                  <th class="p-6 font-bold">Status Pengajuan</th>
                  <th class="p-6 font-bold">Sisa Waktu</th>
                  <th class="p-6 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="text-sm">
                ${filteredPegawai.length === 0 ? `
                  <tr>
                    <td colspan="6" class="p-12 text-center text-slate-400">Tidak ada pegawai yang mendekati jatuh tempo ${type.toUpperCase()}.</td>
                  </tr>
                ` : filteredPegawai.map((p: any) => {
                  const targetDate = type === 'kp' ? p.tmtKpNext : p.tmtKgbNext;
                  const initials = p.nama.split(' ').map((n: any) => n[0]).join('').substring(0, 2).toUpperCase();
                  const isOverdue = new Date(targetDate) < new Date();
                  const isSoon = isNear(targetDate, type === 'kp' ? 180 : 90);
                  
                  // Cari pengajuan aktif
                  const requests = type === 'kp' ? adminData.kp : adminData.kgb;
                  const activeRequest = requests.find((r: any) => r.nik.toString() === p.nik.toString());
                  
                  return `
                  <tr class="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td class="p-6">
                      <div class="flex items-center gap-4">
                        <div class="avatar">${initials}</div>
                        <div>
                          <p class="font-bold text-slate-800">${p.nama}</p>
                          <p class="text-[10px] font-mono text-slate-400">${p.nik}</p>
                        </div>
                      </div>
                    </td>
                    <td class="p-6">
                      <p class="text-xs font-bold text-slate-600">${p.jabatan}</p>
                    </td>
                    <td class="p-6">
                      <p class="text-xs font-bold ${isOverdue ? 'text-red-600' : isSoon ? 'text-amber-600' : 'text-slate-800'}">
                        ${formatDate(targetDate).split(' pukul')[0]}
                      </p>
                    </td>
                    <td class="p-6">
                      ${activeRequest ? `
                        <span class="px-2 py-1 bg-green-50 text-green-600 rounded-md text-[10px] font-bold uppercase">
                          ${activeRequest.status}
                        </span>
                      ` : `
                        <span class="px-2 py-1 bg-slate-50 text-slate-400 rounded-md text-[10px] font-bold uppercase">
                          Belum Diajukan
                        </span>
                      `}
                    </td>
                    <td class="p-6">
                      <div class="flex items-center gap-3">
                        <div class="progress-bar flex-1">
                          <div class="progress-fill ${isOverdue ? 'bg-red-500' : isSoon ? 'bg-amber-500' : 'bg-blue-500'}" style="width: ${isOverdue ? '100%' : '70%'}"></div>
                        </div>
                        <span class="text-[10px] font-bold uppercase ${isOverdue ? 'text-red-600' : isSoon ? 'text-amber-600' : 'text-slate-400'}">
                          ${isOverdue ? 'Overdue' : isSoon ? 'Segera' : 'Aman'}
                        </span>
                      </div>
                    </td>
                    <td class="p-6 text-right">
                      ${activeRequest ? `
                        <button onclick="window.updateStatus('${activeRequest.ticket}')" class="px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-bold uppercase shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
                          Update Status
                        </button>
                      ` : `
                        <button onclick="window.editPegawai('${p.nik}')" class="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-bold uppercase hover:bg-slate-200 transition-all">
                          Cek Data
                        </button>
                      `}
                    </td>
                  </tr>
                `}).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
};

// --- GLOBAL ACTIONS ---
(window as any).editPegawai = async (nik?: string) => {
  // Gunakan toString() untuk memastikan perbandingan NIK akurat (string vs number)
  const p = nik ? adminData.pegawai.find((item: any) => item.nik.toString() === nik.toString()) : null;
  
  const formatDateForInput = (dateVal: any) => {
    if (!dateVal) return '';
    try {
      const d = new Date(dateVal);
      return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
    } catch (e) { return ''; }
  };

  const { value: formValues } = await Swal.fire({
    title: nik ? 'Edit Pegawai' : 'Tambah Pegawai',
    html: `
      <div class="space-y-4 text-left p-2">
        <div>
          <label class="text-xs font-bold text-slate-400">NIK</label>
          <input id="swal-nik" class="input-field mt-1" placeholder="NIK" value="${p?.nik || ''}" ${nik ? 'disabled' : ''}>
        </div>
        <div>
          <label class="text-xs font-bold text-slate-400">Nama Lengkap</label>
          <input id="swal-nama" class="input-field mt-1" placeholder="Nama Lengkap" value="${p?.nama || ''}">
        </div>
        <div>
          <label class="text-xs font-bold text-slate-400">Jabatan</label>
          <input id="swal-jabatan" class="input-field mt-1" placeholder="Jabatan" value="${p?.jabatan || ''}">
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-xs font-bold text-slate-400">TMT KGB Berikutnya</label>
            <input id="swal-kgb" type="date" class="input-field mt-1" value="${formatDateForInput(p?.tmtKgbNext)}">
          </div>
          <div>
            <label class="text-xs font-bold text-slate-400">TMT KP Berikutnya</label>
            <input id="swal-kp" type="date" class="input-field mt-1" value="${formatDateForInput(p?.tmtKpNext)}">
          </div>
        </div>
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    preConfirm: () => {
      const nikVal = (document.getElementById('swal-nik') as HTMLInputElement).value;
      const namaVal = (document.getElementById('swal-nama') as HTMLInputElement).value;
      if (!nikVal || !namaVal) {
        Swal.showValidationMessage('NIK dan Nama wajib diisi');
        return false;
      }
      return {
        nik: nikVal,
        nama: namaVal,
        jabatan: (document.getElementById('swal-jabatan') as HTMLInputElement).value,
        tmtKgbNext: (document.getElementById('swal-kgb') as HTMLInputElement).value,
        tmtKpNext: (document.getElementById('swal-kp') as HTMLInputElement).value
      }
    }
  });

  if (formValues) {
    Swal.fire({ title: 'Menyimpan...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    try {
      const res = await fetch(GAS_URL, {
        method: 'POST',
        body: JSON.stringify({
          action: 'savePegawai',
          ...formValues,
          token: localStorage.getItem('moka_token')
        })
      });
      const data = await res.json();
      if (data.success) {
        await Swal.fire('Berhasil', 'Data pegawai berhasil disimpan', 'success');
        loadAdminData();
      } else {
        Swal.fire('Gagal', data.message || 'Terjadi kesalahan pada server', 'error');
      }
    } catch (err) {
      console.error('Save Error:', err);
      Swal.fire('Error', 'Gagal menghubungi server. Pastikan GAS_URL sudah benar.', 'error');
    }
  }
};

(window as any).deletePegawai = async (nik: string) => {
  const result = await Swal.fire({
    title: 'Hapus Pegawai?',
    text: "Data yang dihapus tidak dapat dikembalikan!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    confirmButtonText: 'Ya, Hapus!'
  });

  if (result.isConfirmed) {
    Swal.fire({ title: 'Deleting...', didOpen: () => Swal.showLoading() });
    try {
      const res = await fetch(GAS_URL, {
        method: 'POST',
        body: JSON.stringify({
          action: 'deletePegawai',
          nik,
          token: localStorage.getItem('moka_token')
        })
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire('Terhapus', 'Data pegawai telah dihapus', 'success');
        loadAdminData();
      } else {
        Swal.fire('Gagal', data.message, 'error');
      }
    } catch (err) {
      Swal.fire('Error', 'Gagal menghapus data', 'error');
    }
  }
};

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
