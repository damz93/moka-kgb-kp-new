
import './index.css';
import { createIcons, icons } from 'lucide';
import Swal from 'sweetalert2';

// --- CONFIGURATION ---
// const GAS_URL = 'https://script.google.com/macros/s/AKfycbxhrCUKHLpYLeTYRFK4xMCaegKcehMWj2l7PoAVHIzByWvrWt7nPqbY6G0CN4yrd8v0tA/exec';
// const GAS_URL = 'https://script.google.com/macros/s/AKfycbwxKIZQu0D7jrXzIwCNTQwU2KAhjY99wjx4lxlJOmtFEU6nf5ne7-UYKmMdYyfgrBITqg/exec';
// const GAS_URL = 'https://script.google.com/macros/s/AKfycbx18wfWpMC5w3lNZ8gIY24L-FbllGFroFM0FJWEm1kHFdGxwjOPJCcB4JU4sPtMjsbf-A/exec';
// const GAS_URL = 'https://script.google.com/macros/s/AKfycbyC7hYE5w1_hB3JnSJ_Z_LuEcLaBFChTvHgH30mHFwm2387LBNuJX9zyRWN8YqWH5yJfw/exec';
//const GAS_URL = 'https://script.google.com/macros/s/AKfycbzorsD488lhGHkTq1tmj1JxhgaPZwcXC1tySDzFCiHMRYnu8eRs-3KdcBmjK3nKJLq8Cg/exec';
const GAS_URL = 'https://script.google.com/macros/s/AKfycbxviWAQuc53YssIjf4OeG-d-m8wcB4gmFkMBRsQ6vL71yysmxJ4ua-CEGIEp7wVFFoG9w/exec';

let currentPage = 'home';
let isAdmin = !!localStorage.getItem('moka_token');
let adminData: any = null;
let adminTab = 'dashboard';
let showProfileMenu = false;

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
    case 'cek-nip': renderCekNip(main); break;
    case 'cek-tiket': renderCekTiket(main); break;
    case 'login': isAdmin ? renderAdmin(main) : renderLogin(main); break;
    case 'admin': renderAdmin(main); break;
    default: renderHome(main);
  }

  // Re-initialize Icons
  setTimeout(() => {
    createIcons({ icons });
  }, 100);
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
          <button data-page="cek-nip" class="btn-primary md:w-auto px-10 flex items-center justify-center gap-2">
            <i data-lucide="search"></i> Cek NIP / Ajukan
          </button>
          <button data-page="cek-tiket" class="px-10 py-4 bg-white text-blue-600 font-bold rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2">
            <i data-lucide="ticket"></i> Cek Status Tiket
          </button>
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
            <li class="flex items-center gap-2"><i data-lucide="circle-check-big" class="w-4 h-4 text-green-500"></i> SK Pangkat Terakhir</li>
            <li class="flex items-center gap-2"><i data-lucide="circle-check-big" class="w-4 h-4 text-green-500"></i> SK KGB Terakhir</li>
            <li class="flex items-center gap-2"><i data-lucide="circle-check-big" class="w-4 h-4 text-green-500"></i> Penilaian Kinerja (SKP)</li>
          </ul>
        </div>
        <div class="glass-card p-8 space-y-4">
          <div class="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
            <i data-lucide="users" class="w-8 h-8"></i>
          </div>
          <h3 class="text-2xl font-bold text-blue-900">Syarat KP</h3>
          <ul class="space-y-3 text-slate-600">
            <li class="flex items-center gap-2"><i data-lucide="circle-check-big" class="w-4 h-4 text-green-500"></i> SK CPNS & PNS</li>
            <li class="flex items-center gap-2"><i data-lucide="circle-check-big" class="w-4 h-4 text-green-500"></i> Ijazah Terakhir</li>
            <li class="flex items-center gap-2"><i data-lucide="circle-check-big" class="w-4 h-4 text-green-500"></i> SKP 2 Tahun Terakhir</li>
          </ul>
        </div>
      </div>
    </div>
  `;
  createIcons({ icons });
};

const renderCekTiket = (container: Element) => {
  container.innerHTML = `
    <div class="animate-fade-in max-w-2xl mx-auto space-y-8">
      <div class="text-center space-y-2">
        <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <i data-lucide="ticket" class="w-8 h-8"></i>
        </div>
        <h2 class="text-3xl font-bold text-blue-950">Cek Status Tiket</h2>
        <p class="text-slate-500">Masukkan Nomor Tiket Anda untuk melihat status pengajuan</p>
      </div>
      
      <div class="glass-card p-8 space-y-6">
        <div class="space-y-4">
          <input type="text" id="ticket-input" class="input-field text-center text-2xl font-bold tracking-widest uppercase" placeholder="CONTOH: KGB-19870101...">
          <button id="btn-cek-tiket" class="btn-primary">Cari Pengajuan</button>
        </div>
      </div>

      <div id="cek-result" class="hidden animate-fade-in">
        <!-- Result will be here -->
      </div>
    </div>
  `;

  $('#btn-cek-tiket')?.addEventListener('click', async () => {
    const ticket = (($('#ticket-input') as HTMLInputElement).value || '').trim().toUpperCase();
    if (!ticket) return Swal.fire('Error', 'Masukkan Nomor Tiket Anda', 'error');

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
              <i data-lucide="circle-alert" class="w-10 h-10"></i>
            </div>
            <h3 class="text-xl font-bold">Data Tidak Ditemukan</h3>
            <p class="text-slate-500">Nomor tiket ${ticket} tidak ditemukan atau salah ketik.</p>
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
                <p class="text-slate-500">NIP: ${resNik} • Kategori: <span class="font-bold text-blue-600">${kategori}</span></p>
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
      createIcons({ icons });
    } catch (e) {
      resultDiv.innerHTML = '<p class="text-center text-red-500">Gagal mengambil data. Periksa koneksi atau URL API.</p>';
    }
  });
  createIcons({ icons });
};

const renderCekNip = (container: Element) => {
  container.innerHTML = `
    <div class="animate-fade-in max-w-2xl mx-auto space-y-8">
      <div class="text-center space-y-2">
        <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <i data-lucide="search" class="w-8 h-8"></i>
        </div>
        <h2 class="text-3xl font-bold text-blue-950">Cek Data NIP</h2>
        <p class="text-slate-500">Masukkan NIP Anda untuk melihat jadwal TMT dan melakukan pengajuan</p>
      </div>
      
      <div class="glass-card p-8 space-y-6">
        <div class="space-y-4">
          <input type="text" id="nip-input" class="input-field text-center text-2xl font-bold tracking-widest" placeholder="MASUKKAN 18 DIGIT NIP">
          <button id="btn-cek-nip" class="btn-primary">Cek Data Pegawai</button>
        </div>
      </div>

      <div id="nip-result" class="hidden animate-fade-in">
        <!-- Result will be here -->
      </div>
    </div>
  `;

  $('#btn-cek-nip')?.addEventListener('click', async () => {
    const nip = (($('#nip-input') as HTMLInputElement).value || '').trim();
    if (!nip) return Swal.fire('Error', 'Masukkan NIP Anda', 'error');

    const resultDiv = $('#nip-result');
    if (!resultDiv) return;

    resultDiv.innerHTML = '<div class="flex justify-center py-12"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>';
    resultDiv.classList.remove('hidden');

    try {
      const res = await fetch(`${GAS_URL}?action=checkNIP&nip=${nip}`);
      const data = await res.json();

      if (!data.success) {
        resultDiv.innerHTML = `
          <div class="glass-card p-12 text-center space-y-4">
            <div class="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <i data-lucide="user-x" class="w-10 h-10"></i>
            </div>
            <h3 class="text-xl font-bold">Data Tidak Terdaftar</h3>
            <p class="text-slate-500">NIP ${nip} belum terdaftar di database pegawai atau NIP tidak cocok.</p>
          </div>
        `;
      } else {
        const p = data.data;
        
        // Calculate diff days
        const getDiffDays = (dateStr: string) => {
          if (!dateStr) return null;
          const target = new Date(dateStr);
          const now = new Date();
          const diffTime = target.getTime() - now.getTime();
          return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        };

        const kgbDiff = getDiffDays(p.tmtKgbNext);
        const kpDiff = getDiffDays(p.tmtKpNext);

        const canAjukanKgb = kgbDiff !== null && kgbDiff <= 90; // 3 months
        const canAjukanKp = kpDiff !== null && kpDiff <= 180; // 6 months

        resultDiv.innerHTML = `
          <div class="space-y-6">
            <div class="glass-card p-8 space-y-6">
              <div class="flex items-center gap-6 border-b border-white/40 pb-6">
                <div class="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center text-3xl font-bold shadow-lg shadow-blue-200">
                  ${p.nama.charAt(0)}
                </div>
                <div>
                  <h3 class="text-2xl font-bold text-blue-950">${p.nama}</h3>
                  <p class="text-slate-500">NIP: ${p.nik}</p>
                  <p class="text-xs font-bold text-blue-600 uppercase tracking-widest mt-1">${p.jabatan} • ${p.unitKerja}</p>
                </div>
              </div>

              <div class="grid md:grid-cols-2 gap-6">
                <!-- KGB Card -->
                <div class="p-6 rounded-3xl border border-slate-100 bg-slate-50/50 space-y-4">
                  <div class="flex justify-between items-start">
                    <div class="w-10 h-10 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center">
                      <i data-lucide="trending-up" class="w-5 h-5"></i>
                    </div>
                    <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400">KGB Berikutnya</span>
                  </div>
                  <div>
                    <p class="text-lg font-bold text-slate-800">${p.tmtKgbNext ? formatDate(p.tmtKgbNext).split(' pukul')[0] : '-'}</p>
                    <p class="text-xs ${kgbDiff !== null && kgbDiff < 0 ? 'text-red-500' : kgbDiff !== null && kgbDiff <= 90 ? 'text-amber-500' : 'text-slate-400'} font-medium">
                      ${kgbDiff === null ? 'Data tidak tersedia' : kgbDiff < 0 ? `Terlewat ${Math.abs(kgbDiff)} hari` : `Sisa ${kgbDiff} hari lagi`}
                    </p>
                  </div>
                  ${canAjukanKgb ? `
                    <button onclick="window.showAjukanForm('${p.nik}', '${p.nama}', 'KGB')" class="w-full py-3 bg-pink-600 text-white rounded-2xl font-bold text-sm hover:bg-pink-700 transition-all shadow-lg shadow-pink-100">Ajukan KGB</button>
                  ` : `
                    <div class="py-3 px-4 bg-slate-100 text-slate-400 rounded-2xl text-center text-xs font-medium">
                      Belum masa pengajuan (Min. 3 bulan)
                    </div>
                  `}
                </div>

                <!-- KP Card -->
                <div class="p-6 rounded-3xl border border-slate-100 bg-slate-50/50 space-y-4">
                  <div class="flex justify-between items-start">
                    <div class="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                      <i data-lucide="award" class="w-5 h-5"></i>
                    </div>
                    <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400">KP Berikutnya</span>
                  </div>
                  <div>
                    <p class="text-lg font-bold text-slate-800">${p.tmtKpNext ? formatDate(p.tmtKpNext).split(' pukul')[0] : '-'}</p>
                    <p class="text-xs ${kpDiff !== null && kpDiff < 0 ? 'text-red-500' : kpDiff !== null && kpDiff <= 180 ? 'text-amber-500' : 'text-slate-400'} font-medium">
                      ${kpDiff === null ? 'Data tidak tersedia' : kpDiff < 0 ? `Terlewat ${Math.abs(kpDiff)} hari` : `Sisa ${kpDiff} hari lagi`}
                    </p>
                  </div>
                  ${canAjukanKp ? `
                    <button onclick="window.showAjukanForm('${p.nik}', '${p.nama}', 'KP')" class="w-full py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">Ajukan KP</button>
                  ` : `
                    <div class="py-3 px-4 bg-slate-100 text-slate-400 rounded-2xl text-center text-xs font-medium">
                      Belum masa pengajuan (Min. 6 bulan)
                    </div>
                  `}
                </div>
              </div>
            </div>

            <div id="ajukan-form-container" class="hidden animate-slide-up">
              <!-- Form will be injected here -->
            </div>
          </div>
        `;
      }
      createIcons({ icons });
    } catch (e) {
      resultDiv.innerHTML = '<p class="text-center text-red-500">Gagal mengambil data. Periksa koneksi atau URL API.</p>';
    }
  });
  createIcons({ icons });
};

// Global function to show form
(window as any).showAjukanForm = (nik: string, nama: string, kategori: string) => {
  const container = $('#ajukan-form-container');
  if (!container) return;
  
  container.classList.remove('hidden');
  renderAjukan(container, nik, nama, kategori);
  
  // Scroll to form
  container.scrollIntoView({ behavior: 'smooth' });
};

const renderAjukan = (container: Element, nik = '', nama = '', kategori = '') => {
  container.innerHTML = `
    <div class="glass-card p-8 space-y-6 border-2 border-blue-100">
      <div class="flex items-center gap-3 mb-2">
        <div class="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center">
          <i data-lucide="file-plus" class="w-5 h-5"></i>
        </div>
        <h3 class="text-xl font-bold text-blue-950">Form Pengajuan ${kategori}</h3>
      </div>

      <form id="form-ajukan" class="space-y-6">
        <input type="hidden" name="nik" value="${nik}">
        <input type="hidden" name="nama" value="${nama}">
        <input type="hidden" name="kategori" value="${kategori}">

        <div class="grid md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-sm font-bold text-slate-600 ml-1">NIP</label>
            <input type="text" disabled value="${nik}" class="input-field bg-slate-50 text-slate-400 cursor-not-allowed">
          </div>
          <div class="space-y-2">
            <label class="text-sm font-bold text-slate-600 ml-1">Nama Lengkap</label>
            <input type="text" disabled value="${nama}" class="input-field bg-slate-50 text-slate-400 cursor-not-allowed">
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-bold text-slate-600 ml-1">Upload Berkas Persyaratan (PDF)</label>
          <p class="text-[10px] text-slate-400 mb-2 italic">*Gabungkan semua dokumen (SK Pangkat, SKP, dll) dalam satu file PDF</p>
          <div class="relative group">
            <input type="file" id="file-input" accept=".pdf" required class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10">
            <div class="input-field flex items-center justify-center gap-3 border-dashed border-2 border-blue-200 bg-blue-50/30 group-hover:bg-blue-50 transition-all py-8">
              <i data-lucide="upload-cloud" class="w-6 h-6 text-blue-500"></i>
              <span id="file-label" class="text-slate-500">Pilih file PDF (Maks 5MB)</span>
            </div>
          </div>
        </div>

        <div class="pt-4">
          <button type="submit" class="btn-primary w-full py-4 text-lg">Kirim Pengajuan Sekarang</button>
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
          let successHtml = `Simpan nomor tiket Anda:<br/><b class="text-2xl text-blue-600">${data.ticket}</b>`;
          
          if (data.isNewPegawai) {
            successHtml += `<br/><br/><div class="p-3 bg-amber-50 text-amber-700 text-xs rounded-xl border border-amber-100"><b>Info:</b> NIP Anda belum terdaftar sebelumnya. Data Anda telah ditambahkan otomatis ke database pegawai.</div>`;
          }

          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            html: successHtml,
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
  createIcons({ icons });
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
  createIcons({ icons });
};

const renderAdmin = (container: Element) => {
  container.innerHTML = `
    <div class="flex h-screen bg-slate-50 overflow-hidden flex-col md:flex-row">
      <!-- Sidebar (Desktop) -->
      <aside class="hidden md:flex w-72 bg-white border-r border-slate-200 flex-col p-6 gap-8 z-50">
        <div class="flex items-center gap-3 px-2">
          <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">M</div>
          <span class="font-bold text-xl tracking-tight text-blue-900">MOKA <span class="text-blue-600">KGB KP</span></span>
        </div>
        
        <nav class="flex-1 space-y-2 flex flex-col">
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
          <p class="text-[10px] text-slate-400 text-center uppercase tracking-widest font-bold">v1.0.0 Stable</p>
        </div>
      </aside>

      <!-- Bottom Navigation (Mobile) -->
      <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center p-2 z-50 shadow-2xl">
        <button data-admin-tab="dashboard" class="flex flex-col items-center gap-1 p-2 ${adminTab === 'dashboard' ? 'text-blue-600' : 'text-slate-400'}">
          <i data-lucide="layout-dashboard" class="w-5 h-5"></i>
          <span class="text-[10px] font-bold">Dash</span>
        </button>
        <button data-admin-tab="pegawai" class="flex flex-col items-center gap-1 p-2 ${adminTab === 'pegawai' ? 'text-blue-600' : 'text-slate-400'}">
          <i data-lucide="users" class="w-5 h-5"></i>
          <span class="text-[10px] font-bold">Pegawai</span>
        </button>
        <button data-admin-tab="kp" class="flex flex-col items-center gap-1 p-2 ${adminTab === 'kp' ? 'text-blue-600' : 'text-slate-400'}">
          <i data-lucide="file-text" class="w-5 h-5"></i>
          <span class="text-[10px] font-bold">KP</span>
        </button>
        <button data-admin-tab="kgb" class="flex flex-col items-center gap-1 p-2 ${adminTab === 'kgb' ? 'text-blue-600' : 'text-slate-400'}">
          <i data-lucide="file-text" class="w-5 h-5"></i>
          <span class="text-[10px] font-bold">KGB</span>
        </button>
      </nav>

      <!-- Main Content Area -->
      <main class="flex-1 flex flex-col overflow-hidden pb-16 md:pb-0">
        <!-- Header -->
        <header class="bg-white border-b border-slate-200 px-4 md:px-8 py-4 sticky top-0 z-40 flex justify-between items-center shrink-0">
          <div class="flex items-center gap-3 md:hidden">
             <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">M</div>
          </div>
          <div class="hidden sm:block">
            <h1 id="admin-page-title" class="text-lg md:text-xl font-bold text-slate-800">Dashboard</h1>
            <p class="text-[10px] md:text-xs text-slate-400">Sistem Monitoring Kepegawaian</p>
          </div>
          <div class="flex items-center gap-3 md:gap-6">
            <div class="hidden lg:flex items-center bg-slate-100 rounded-full px-4 py-2 gap-2 w-64">
              <i data-lucide="search" class="w-4 h-4 text-slate-400"></i>
              <input type="text" placeholder="Cari pegawai..." class="bg-transparent border-none outline-none text-sm w-full">
            </div>
            <div class="flex items-center gap-2 md:gap-4 relative">
              <button class="relative p-2 text-slate-400 hover:text-blue-600 transition-colors">
                <i data-lucide="clock" class="w-5 h-5"></i>
                <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div class="h-8 w-px bg-slate-200"></div>
              <div id="profile-trigger" class="flex items-center gap-2 md:gap-3 cursor-pointer hover:bg-slate-50 p-1 md:p-2 rounded-2xl transition-all">
                <div class="text-right hidden md:block">
                  <p class="text-xs font-bold text-slate-800">Admin SIMPEG</p>
                  <p class="text-[10px] text-slate-400">Administrator</p>
                </div>
                <div class="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm md:text-base">
                  AS
                </div>
              </div>

              <!-- Profile Dropdown -->
              <div id="profile-dropdown" class="${showProfileMenu ? 'flex' : 'hidden'} absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 flex-col overflow-hidden animate-fade-in">
                <div class="p-4 border-b border-slate-50 bg-slate-50/50">
                  <p class="text-xs font-bold text-slate-800">Admin SIMPEG</p>
                  <p class="text-[10px] text-slate-400">admin@simpeg.go.id</p>
                </div>
                <button class="p-4 text-left text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-3">
                  <i data-lucide="user" class="w-4 h-4"></i> Profil Saya
                </button>
                <button id="btn-logout" class="p-4 text-left text-xs font-bold text-red-500 hover:bg-red-50 flex items-center gap-3">
                  <i data-lucide="log-out" class="w-4 h-4"></i> Keluar
                </button>
              </div>
            </div>
          </div>
        </header>

        <div id="admin-content" class="flex-1 overflow-y-auto p-4 md:p-8">
          <div class="flex justify-center py-12"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
        </div>
      </main>
    </div>
  `;

  $('#profile-trigger')?.addEventListener('click', (e) => {
    e.stopPropagation();
    showProfileMenu = !showProfileMenu;
    const dropdown = $('#profile-dropdown');
    if (dropdown) {
      dropdown.classList.toggle('hidden', !showProfileMenu);
      dropdown.classList.toggle('flex', showProfileMenu);
    }
  });

  document.addEventListener('click', () => {
    showProfileMenu = false;
    const dropdown = $('#profile-dropdown');
    if (dropdown) {
      dropdown.classList.add('hidden');
      dropdown.classList.remove('flex');
    }
  });

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
      $$('[data-admin-tab]').forEach(b => {
        b.classList.remove('active');
        b.classList.remove('text-blue-600');
        b.classList.add('text-slate-400');
      });
      
      const currentBtn = e.currentTarget as HTMLElement;
      currentBtn.classList.add('active');
      if (currentBtn.classList.contains('flex-col')) {
         currentBtn.classList.remove('text-slate-400');
         currentBtn.classList.add('text-blue-600');
      }
      
      // Update Page Title
      const titleMap: any = { 'dashboard': 'Dashboard', 'pegawai': 'Data Pegawai', 'kp': 'Monitoring KP', 'kgb': 'Monitoring KGB' };
      const titleEl = $('#admin-page-title');
      if (titleEl) titleEl.textContent = titleMap[tab] || 'Dashboard';

      renderAdminContent();
    });
  });

  createIcons({ icons });
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

  createIcons({ icons });
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
            <i data-lucide="circle-check-big" class="w-6 h-6"></i>
          </div>
          <div>
            <p class="text-slate-400 text-xs font-medium">Pegawai Aktif</p>
            <div class="flex items-baseline gap-2">
              <h4 class="text-3xl font-bold text-slate-800">${adminData.pegawai.filter((p: any) => p.status !== 'Tidak Aktif').length}</h4>
              <span class="text-[10px] text-slate-400 font-medium">${Math.round((adminData.pegawai.filter((p: any) => p.status !== 'Tidak Aktif').length / adminData.pegawai.length) * 100) || 0}% dari total</span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Chart Section -->
        <div class="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-8">
          <div class="flex justify-between items-center">
            <h3 class="font-bold text-slate-800">Distribusi Pegawai per Bidang</h3>
            <div class="bg-slate-50 text-[10px] font-bold text-slate-500 rounded-lg px-3 py-2">
              Tahun ${new Date().getFullYear()}
            </div>
          </div>
          <div class="h-64 flex items-end justify-around gap-4 pt-4">
            ${(() => {
              const distribution: Record<string, number> = {};
              
              adminData.pegawai.forEach((p: any) => {
                if (p.status === 'Tidak Aktif') return;
                const unit = p.unitKerja || p.unit_kerja || p.unitkerja || 'Lainnya';
                distribution[unit] = (distribution[unit] || 0) + 1;
              });

              const units = Object.keys(distribution);
              if (units.length === 0) return `<p class="text-slate-400 text-xs italic">Tidak ada data pegawai aktif</p>`;

              const maxCount = Math.max(...Object.values(distribution));
              const colors = ['bg-blue-500', 'bg-indigo-500', 'bg-pink-500', 'bg-red-500', 'bg-amber-500', 'bg-emerald-500'];

              return units.map((unit, i) => {
                const count = distribution[unit];
                const height = (count / maxCount) * 100;
                return `
                  <div class="flex-1 flex flex-col items-center gap-3 group relative h-full justify-end">
                    <div class="absolute -top-8 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      ${count} Pegawai
                    </div>
                    <div class="w-full ${colors[i % colors.length]} rounded-t-lg transition-all duration-500" style="height: ${height}%"></div>
                    <span class="text-[10px] text-slate-400 font-bold truncate w-full text-center" title="${unit}">${unit}</span>
                  </div>
                `;
              }).join('');
            })()}
          </div>
        </div>

        <!-- Notifications Section -->
        <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <h3 class="font-bold text-slate-800">Pemberitahuan Terkini</h3>
          <div class="space-y-6">
            ${(() => {
              const allActivities = [
                ...adminData.kgb.map((item: any) => ({ ...item, type: 'KGB' })),
                ...adminData.kp.map((item: any) => ({ ...item, type: 'KP' }))
              ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .slice(0, 5);

              if (allActivities.length === 0) return `<p class="text-slate-400 text-xs italic">Belum ada aktivitas</p>`;

              return allActivities.map(activity => {
                let icon = 'clock';
                let color = 'amber';
                let message = '';

                if (activity.status === 'Diajukan') {
                  icon = 'file-plus';
                  color = 'blue';
                  message = `Pengajuan ${activity.type} baru dari <b>${activity.nama}</b> sedang menunggu verifikasi.`;
                } else if (activity.status === 'Diverifikasi' || activity.status === 'Diproses') {
                  icon = 'loader';
                  color = 'indigo';
                  message = `Pengajuan ${activity.type} <b>${activity.nama}</b> sedang dalam tahap ${activity.status.toLowerCase()}.`;
                } else if (activity.status === 'Selesai') {
                  icon = 'circle-check-big';
                  color = 'green';
                  message = `Pengajuan ${activity.type} <b>${activity.nama}</b> telah selesai diproses.`;
                } else if (activity.status === 'Ditolak') {
                  icon = 'circle-x';
                  color = 'red';
                  message = `Pengajuan ${activity.type} <b>${activity.nama}</b> ditolak.`;
                }

                const timeDiff = new Date().getTime() - new Date(activity.timestamp).getTime();
                const minutes = Math.floor(timeDiff / 60000);
                const hours = Math.floor(minutes / 60);
                const days = Math.floor(hours / 24);

                let timeStr = 'Baru saja';
                if (days > 0) timeStr = `${days} hari yang lalu`;
                else if (hours > 0) timeStr = `${hours} jam yang lalu`;
                else if (minutes > 0) timeStr = `${minutes} menit yang lalu`;

                return `
                  <div class="flex gap-4">
                    <div class="w-10 h-10 bg-${color}-50 rounded-xl flex items-center justify-center text-${color}-500 shrink-0">
                      <i data-lucide="${icon}" class="w-5 h-5"></i>
                    </div>
                    <div class="space-y-1">
                      <p class="text-sm font-bold text-slate-800">${activity.type} - ${activity.status}</p>
                      <p class="text-xs text-slate-500 leading-relaxed">${message}</p>
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-1">${timeStr}</p>
                    </div>
                  </div>
                `;
              }).join('');
            })()}
          </div>
          <button onclick="window.showAllActivities()" class="w-full py-3 text-blue-600 text-xs font-bold hover:bg-blue-50 rounded-xl transition-colors mt-4">Lihat Semua Aktivitas</button>
        </div>
      </div>
    </div>
  `;
};

const renderAdminPegawai = (container: HTMLElement) => {
  const units = Array.from(new Set(adminData.pegawai.map((p: any) => p.unitKerja || p.unit_kerja || p.unitkerja || 'Lainnya'))).sort();
  
  container.innerHTML = `
    <div class="animate-fade-in space-y-6">
      <!-- Filters & Actions -->
      <div class="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="flex flex-1 w-full md:w-auto gap-4">
          <div class="flex-1 flex items-center bg-slate-50 rounded-2xl px-4 py-3 gap-3 border border-slate-100">
            <i data-lucide="search" class="w-4 h-4 text-slate-400"></i>
            <input type="text" id="pegawai-search" placeholder="Cari NIP atau Nama..." class="bg-transparent border-none outline-none text-sm w-full">
          </div>
          <div class="flex items-center bg-slate-50 rounded-2xl px-4 py-3 gap-3 border border-slate-100 min-w-[120px]">
            <i data-lucide="filter" class="w-4 h-4 text-slate-400"></i>
            <select id="pegawai-filter-unit" class="bg-transparent border-none outline-none text-sm w-full font-medium text-slate-600">
              <option value="">Semua Bidang</option>
              ${units.map(u => `<option value="${u}">${u}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="flex gap-3 w-full md:w-auto">
          <button onclick="window.exportPegawai()" class="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
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
                <th class="p-6 font-bold">Jabatan</th>
                <th class="p-6 font-bold">Unit Kerja</th>
                <th class="p-6 font-bold">Status</th>
                <th class="p-6 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody id="pegawai-table-body" class="text-sm">
              ${renderPegawaiRows(adminData.pegawai)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  const searchInput = $('#pegawai-search') as HTMLInputElement;
  const unitFilter = $('#pegawai-filter-unit') as HTMLSelectElement;
  const tbody = $('#pegawai-table-body');

  const filterPegawai = () => {
    const query = searchInput.value.toLowerCase();
    const unit = unitFilter.value;
    
    const filtered = adminData.pegawai.filter((p: any) => {
      const matchSearch = p.nama.toLowerCase().includes(query) || p.nik.toString().toLowerCase().includes(query);
      const matchUnit = !unit || (p.unitKerja || p.unit_kerja || p.unitkerja || 'Lainnya') === unit;
      return matchSearch && matchUnit;
    });
    
    if (tbody) {
      tbody.innerHTML = renderPegawaiRows(filtered);
      createIcons({ icons });
    }
  };

  searchInput?.addEventListener('input', filterPegawai);
  unitFilter?.addEventListener('change', filterPegawai);

  createIcons({ icons });
};

const renderPegawaiRows = (pegawai: any[]) => {
  if (pegawai.length === 0) return `<tr><td colspan="5" class="p-12 text-center text-slate-400 italic">Tidak ada pegawai ditemukan</td></tr>`;
  
  return pegawai.map((p: any) => {
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
      </td>
      <td class="p-6 text-slate-500 text-xs">${p.unitKerja || p.unit_kerja || p.unitkerja || '-'}</td>
      <td class="p-6">
        <span class="status-badge ${p.status === 'Tidak Aktif' ? 'status-inactive bg-red-50 text-red-500' : 'status-active bg-green-50 text-green-500'}">${p.status || 'Aktif'}</span>
      </td>
      <td class="p-6 text-right">
        <div class="flex justify-end gap-2">
          <button onclick="window.editPegawai('${p.nik}')" class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><i data-lucide="pencil" class="w-4 h-4"></i></button>
          <button onclick="window.deletePegawai('${p.nik}')" class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
        </div>
      </td>
    </tr>
  `}).join('');
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
                  
                  const diffTime = new Date(targetDate).getTime() - new Date().getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  const daysText = diffDays < 0 ? `Lewat ${Math.abs(diffDays)} Hari` : `Sisa ${diffDays} Hari`;
                  
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
                          ${daysText}
                        </span>
                      </div>
                    </td>
                    <td class="p-6 text-right">
                      <div class="flex justify-end gap-2">
                        ${activeRequest ? `
                          <button onclick="window.updateStatus('${activeRequest.ticket}')" class="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Update Status">
                            <i data-lucide="refresh-cw" class="w-4 h-4"></i>
                          </button>
                        ` : `
                          <button onclick="window.autoCreateRequest('${p.nik}', '${type}')" class="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all" title="Buat Pengajuan Otomatis">
                            <i data-lucide="circle-plus" class="w-4 h-4"></i>
                          </button>
                        `}
                        <button onclick="window.shareToWA('${p.nik}', '${type}')" class="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-all" title="Share ke WhatsApp">
                          <i data-lucide="message-circle" class="w-4 h-4"></i>
                        </button>
                        <button onclick="window.editPegawai('${p.nik}')" class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Cek Data">
                          <i data-lucide="eye" class="w-4 h-4"></i>
                        </button>
                      </div>
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
  createIcons({ icons });
};

// --- GLOBAL ACTIONS ---
(window as any).autoCreateRequest = async (nik: string, type: 'kp' | 'kgb') => {
  const p = adminData.pegawai.find((item: any) => item.nik.toString() === nik.toString());
  if (!p) return;

  const result = await Swal.fire({
    title: 'Buat Pengajuan Otomatis?',
    text: `Sistem akan membuat draf pengajuan ${type.toUpperCase()} untuk ${p.nama}. Pegawai dapat melacak statusnya menggunakan NIP.`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Ya, Buat!',
    cancelButtonText: 'Batal'
  });

  if (result.isConfirmed) {
    Swal.fire({ title: 'Memproses...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    try {
      const res = await fetch(GAS_URL, {
        method: 'POST',
        body: JSON.stringify({
          action: 'submitRequest',
          nik: p.nik,
          nama: p.nama,
          kategori: type.toUpperCase(),
          fileData: '', // Ensure fileData is sent to avoid GAS errors if using old script
          fileName: '',
          token: localStorage.getItem('moka_token')
        })
      });
      const data = await res.json();
      if (data.success) {
        await Swal.fire('Berhasil', `Pengajuan ${type.toUpperCase()} berhasil dibuat.`, 'success');
        loadAdminData();
      } else {
        Swal.fire('Gagal', data.message || 'Terjadi kesalahan', 'error');
      }
    } catch (err) {
      Swal.fire('Error', 'Gagal menghubungi server', 'error');
    }
  }
};

(window as any).shareToWA = (nik: string, type: 'kp' | 'kgb') => {
  const p = adminData.pegawai.find((item: any) => item.nik.toString() === nik.toString());
  if (!p) return;

  const targetDate = type === 'kp' ? p.tmtKpNext : p.tmtKgbNext;
  const diffTime = Math.abs(new Date().getTime() - new Date(targetDate).getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isOverdue = new Date(targetDate) < new Date();

  const typeName = type === 'kp' ? 'Kenaikan Pangkat' : 'Kenaikan Gaji Berkala';
  let message = '';
  
  if (isOverdue) {
    message = `Halo ${p.nama}, Anda telah melewati TMT ${typeName} selama ${diffDays} hari. Mohon segera melakukan pengajuan di web atau japri admin untuk proses lebih lanjut. Terima kasih.`;
  } else {
    message = `Halo ${p.nama}, TMT ${typeName} Anda akan jatuh tempo dalam ${diffDays} hari lagi (${formatDate(targetDate).split(' pukul')[0]}). Mohon segera persiapkan berkas dan lakukan pengajuan di web. Terima kasih.`;
  }

  const encodedMsg = encodeURIComponent(message);
  // Asumsi nomor WA belum ada di data pegawai, maka arahkan ke chat tanpa nomor atau minta input
  Swal.fire({
    title: 'Kirim Pengingat WA',
    input: 'text',
    inputLabel: 'Nomor WhatsApp Pegawai (Gunakan format 628xxx)',
    inputValue: '628',
    showCancelButton: true,
    confirmButtonText: 'Kirim Sekarang',
    preConfirm: (phone) => {
      if (!phone || phone.length < 10) {
        Swal.showValidationMessage('Masukkan nomor WA yang valid');
        return false;
      }
      return phone;
    }
  }).then((result) => {
    if (result.isConfirmed) {
      window.open(`https://wa.me/${result.value}?text=${encodedMsg}`, '_blank');
    }
  });
};

(window as any).showAllActivities = () => {
  const allActivities = [
    ...adminData.kgb.map((item: any) => ({ ...item, type: 'KGB' })),
    ...adminData.kp.map((item: any) => ({ ...item, type: 'KP' }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  .slice(0, 10);

  Swal.fire({
    title: 'Semua Aktivitas Terkini',
    width: '600px',
    html: `
      <div class="text-left space-y-4 max-h-[400px] overflow-y-auto p-2 no-scrollbar">
        ${allActivities.map(activity => {
          let colorClass = 'bg-blue-50 text-blue-600';
          if (activity.status === 'Selesai') colorClass = 'bg-green-50 text-green-600';
          if (activity.status === 'Ditolak') colorClass = 'bg-red-50 text-red-600';
          if (activity.status === 'Diproses') colorClass = 'bg-amber-50 text-amber-600';

          return `
            <div class="p-4 rounded-2xl border border-slate-100 bg-slate-50/30 space-y-2">
              <div class="flex justify-between items-start">
                <span class="px-2 py-1 rounded-md text-[10px] font-bold uppercase ${colorClass}">${activity.type} - ${activity.status}</span>
                <span class="text-[10px] text-slate-400 font-bold">${formatDate(activity.timestamp)}</span>
              </div>
              <p class="text-sm font-bold text-slate-800">${activity.nama}</p>
              <p class="text-[10px] text-slate-500 font-mono">${activity.ticket}</p>
            </div>
          `;
        }).join('')}
      </div>
    `,
    showConfirmButton: false,
    showCloseButton: true,
    customClass: {
      container: 'rounded-3xl'
    }
  });
};

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
          <label class="text-xs font-bold text-slate-400">NIP</label>
          <input id="swal-nik" class="input-field mt-1" placeholder="NIP" value="${p?.nik || ''}" ${nik ? 'disabled' : ''}>
        </div>
        <div>
          <label class="text-xs font-bold text-slate-400">Nama Lengkap</label>
          <input id="swal-nama" class="input-field mt-1" placeholder="Nama Lengkap" value="${p?.nama || ''}">
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-xs font-bold text-slate-400">Jabatan</label>
            <input id="swal-jabatan" class="input-field mt-1" placeholder="Jabatan" value="${p?.jabatan || ''}">
          </div>
          <div>
            <label class="text-xs font-bold text-slate-400">Unit Kerja</label>
            <input id="swal-unit" class="input-field mt-1" placeholder="Unit Kerja" value="${p?.unitKerja || p?.unit_kerja || p?.unitkerja || ''}">
          </div>
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
        <div>
          <label class="text-xs font-bold text-slate-400">Status Pegawai</label>
          <select id="swal-status" class="input-field mt-1">
            <option value="Aktif" ${p?.status === 'Aktif' || !p?.status ? 'selected' : ''}>Aktif</option>
            <option value="Tidak Aktif" ${p?.status === 'Tidak Aktif' ? 'selected' : ''}>Tidak Aktif</option>
          </select>
        </div>
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    preConfirm: () => {
      const nikVal = (document.getElementById('swal-nik') as HTMLInputElement).value;
      const namaVal = (document.getElementById('swal-nama') as HTMLInputElement).value;
      if (!nikVal || !namaVal) {
        Swal.showValidationMessage('NIP dan Nama wajib diisi');
        return false;
      }
      return {
        nik: nikVal,
        nama: namaVal,
        jabatan: (document.getElementById('swal-jabatan') as HTMLInputElement).value,
        unitKerja: (document.getElementById('swal-unit') as HTMLInputElement).value,
        tmtKgbNext: (document.getElementById('swal-kgb') as HTMLInputElement).value,
        tmtKpNext: (document.getElementById('swal-kp') as HTMLInputElement).value,
        status: (document.getElementById('swal-status') as HTMLSelectElement).value
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

(window as any).exportPegawai = () => {
  if (!adminData || !adminData.pegawai) return;
  
  const headers = ['NIP', 'Nama', 'Jabatan', 'Unit Kerja', 'TMT KGB', 'TMT KP'];
  const rows = adminData.pegawai.map((p: any) => [
    p.nik,
    p.nama,
    p.jabatan,
    p.unitKerja || p.unit_kerja || p.unitkerja || '',
    p.tmtKgbNext ? new Date(p.tmtKgbNext).toLocaleDateString('id-ID') : '',
    p.tmtKpNext ? new Date(p.tmtKpNext).toLocaleDateString('id-ID') : ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((r: any) => r.map((cell: any) => {
      const val = cell === null || cell === undefined ? '' : String(cell);
      return `"${val.replace(/"/g, '""')}"`;
    }).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `data_pegawai_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
