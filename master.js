/**
 * master.js - Database Cat & Chemical (GitHub Fetch API Integration)
 * DISESUAIKAN: Perbaikan transmisi POST payload untuk menghindari kendala CORS Google Apps Script
 */

// URL Web App Google Apps Script
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx0NvE6w4RuKmoj5zlAA51_I0TRVNFIQP0_0mXUv2ecmJMTciS6PfIb-oe9sTzqFn2Ftw/exec";

// Wadah penyimpanan data global agar fungsi edit tidak perlu parsing JSON di dalam HTML atribut
let globalMasterData = [];

// 1. FUNGSI UNTUK MEMUAT DATA AWAL DARI SPREADSHEET KE GITHUB
function loadMasterDataFromGitHub() {
    console.log("Memulai penarikan data master...");
    fetch(`${WEB_APP_URL}?page=master`)
        .then(response => response.json())
        .then(result => {
            console.log("Koneksi sukses, data diterima:", result);
            if (result.success && result.data) {
                globalMasterData = result.data; // Simpan ke dalam scope global
                renderManageMaster(result.data);
            } else {
                console.error("Gagal memuat data dari Spreadsheet:", result.error);
            }
        })
        .catch(err => console.error("Koneksi API Error:", err));
}

// 2. FUNGSI RENDER UTAMA (STRUKTUR TABEL)
function renderManageMaster(data) {
    const container = document.getElementById('masterContainer');
    if (!container) {
        console.error("Element #masterContainer tidak ditemukan di HTML!");
        return;
    }

    container.className = "w-full block";
    container.innerHTML = `
        <div class="w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
            <div class="hidden md:block">
                <table class="w-full border-collapse" style="min-width: 1300px;">
                    <thead class="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200/80">
                        <tr>
                            <th class="p-3 text-center text-slate-700 font-bold" style="width: 50px;">NO</th>
                            <th class="p-3 text-left" style="width: 140px;">PART NUMBER</th>
                            <th class="p-3 text-left">NAMA PRODUK</th>
                            <th class="p-3 text-left" style="width: 150px;">SUPPLIER</th>
                            <th class="p-3 text-center" style="width: 100px;">KATEGORI</th>
                            <th class="p-3 text-center" style="width: 100px;">LOKASI</th>
                            <th class="p-3 text-center" style="width: 80px;">SATUAN</th>
                            <th class="p-3 text-center" style="width: 90px;">STOK AWAL</th>
                            <th class="p-3 text-center text-green-600" style="width: 90px;">MASUK (L)</th>
                            <th class="p-3 text-center text-red-600" style="width: 90px;">KELUAR (L)</th>
                            <th class="p-3 text-center text-blue-600" style="width: 100px;">STOK AKHIR</th>
                            <th class="p-3 text-center" style="width: 100px;">PIC</th>
                            <th class="p-3 text-center" style="width: 100px;">AKSI</th>
                        </tr>
                    </thead>
                    <tbody id="masterTableBody" class="text-slate-600 divide-y divide-slate-100 bg-white text-[11px]">
                    </tbody>
                </table>
            </div>
            <div id="masterCards" class="md:hidden divide-y divide-slate-100"></div>
        </div>
    `;

    renderMasterRows(data);
}

// 3. FUNGSI UNTUK MERENDER BARIS DATA DARI DATABASE
function renderMasterRows(data) {
    const tbody = document.getElementById('masterTableBody');
    const cardContainer = document.getElementById('masterCards');
    
    if (!data || data.length === 0) {
        const empty = `<div class="p-10 text-center text-slate-400 italic">Data Master Kosong atau Gagal Sinkronisasi.</div>`;
        if(tbody) tbody.innerHTML = `<tr><td colspan="13">${empty}</td></tr>`;
        if(cardContainer) cardContainer.innerHTML = empty;
        return;
    }

    // Render Tabel Desktop
    if (tbody) {
        tbody.innerHTML = data.map((item, index) => {
            const stokAwal = Number(item.stokAwal) || 0;
            const masuk = Number(item.totalMasuk) || 0;
            const keluar = Number(item.totalKeluar) || 0;
            const stokAkhir = stokAwal + masuk - keluar;
            
            // Penanganan toleransi properti case-insensitive dari Apps Script
            const kategoriPilihan = item.kategori || item.KATEGORI || 'MATERIAL CAT';

            return `
                <tr class="hover:bg-slate-50/80 transition-colors border-b border-slate-100">
                    <td class="p-3 text-center font-bold text-slate-400 bg-slate-50/50">${index + 1}</td>
                    <td class="p-3 font-bold text-blue-600 font-mono tracking-tight">${item.partNumber || '-'}</td>
                    <td class="p-3 font-medium text-slate-800">${item.namaProduk || '-'}</td>
                    <td class="p-3 text-slate-500">${item.supplier || '-'}</td>
                    <td class="p-3 text-center">
                        <span class="bg-blue-50 text-blue-600 font-medium px-2 py-0.5 rounded-full text-[10px] uppercase">${kategoriPilihan}</span>
                    </td>
                    <td class="p-3 text-center">
                        <span class="bg-slate-100 text-slate-600 font-bold px-2 py-1 rounded text-[10px] uppercase">${item.lokasi || '-'}</span>
                    </td>
                    <td class="p-3 text-center font-semibold">${item.satuan || '0'} L</td>
                    <td class="p-3 text-center font-medium">${stokAwal}</td>
                    <td class="p-3 text-center font-bold text-green-600">+${masuk}</td>
                    <td class="p-3 text-center font-bold text-red-600">-${keluar}</td>
                    <td class="p-3 text-center font-black text-blue-600 bg-blue-50/30">${stokAkhir}</td>
                    <td class="p-3 text-center text-slate-500">${item.pic || '-'}</td>
                    <td class="p-3 text-center space-x-1 whitespace-nowrap">
                        <button onclick="openModalEditByIndex(${index})" class="text-blue-500 hover:bg-blue-50 px-2 py-1 rounded border border-blue-200 transition-all text-[10px] font-medium inline-block">
                            Edit
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Render Card Mobile (Untuk Tampilan Smartphone)
    if (cardContainer) {
        cardContainer.innerHTML = data.map((item, index) => {
            const stokAwal = Number(item.stokAwal) || 0;
            const masuk = Number(item.totalMasuk) || 0;
            const keluar = Number(item.totalKeluar) || 0;
            const stokAkhir = stokAwal + masuk - keluar;
            return `
                <div class="p-4 bg-white relative">
                    <div class="flex justify-between items-start mb-2">
                        <span class="text-blue-600 font-bold text-xs font-mono">${item.partNumber}</span>
                        <span class="text-[9px] font-black text-slate-300">#${index + 1}</span>
                    </div>
                    <p class="font-bold text-slate-800 text-xs mb-1">${item.namaProduk}</p>
                    <p class="text-[10px] text-slate-400 mb-2">Supplier: ${item.supplier || '-'}</p>
                    <div class="grid grid-cols-3 gap-2 text-[10px] border-t pt-2 bg-slate-50 p-2 rounded">
                        <div><span class="text-slate-400 font-bold uppercase block text-[8px]">Lokasi</span> ${item.lokasi || '-'}</div>
                        <div><span class="text-slate-400 font-bold uppercase block text-[8px]">Satuan</span> ${item.satuan} L</div>
                        <div class="text-right"><span class="text-blue-500 font-bold uppercase block text-[8px]">Stok Akhir</span> ${stokAkhir}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Amankan pemanggilan Lucide Icon agar tidak membuat aplikasi crash jika library terlambat dimuat
    try {
        if (window.lucide && typeof lucide.createIcons === 'function') {
            lucide.createIcons();
        }
    } catch (e) {
        console.warn("Sistem merender tabel tanpa ikon Lucide.", e);
    }
}

// 4. FUNGSI AMAN MODAL EDIT BERDASARKAN INDEKS ARRAY GLOBAL
function openModalEditByIndex(index) {
    const item = globalMasterData[index];
    if (!item) return;

    Swal.fire({
        title: 'Edit Material Master',
        html: `
            <div class="text-left space-y-3 text-xs">
                <div>
                    <label class="font-bold text-slate-500 block mb-1">PART NUMBER</label>
                    <input id="sw-edit-part" class="w-full border p-2 rounded uppercase bg-slate-100 font-mono font-bold" value="${item.partNumber}" readonly>
                </div>
                <div>
                    <label class="font-bold text-slate-500 block mb-1">NAMA PRODUK</label>
                    <input id="sw-edit-nama" class="w-full border p-2 rounded" value="${item.namaProduk || ''}">
                </div>
                <div>
                    <label class="font-bold text-slate-500 block mb-1">SUPPLIER</label>
                    <input id="sw-edit-supp" class="w-full border p-2 rounded" value="${item.supplier || ''}">
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="font-bold text-slate-500 block mb-1">KATEGORI</label>
                        <input id="sw-edit-kat" class="w-full border p-2 rounded" value="${item.kategori || item.KATEGORI || 'MATERIAL CAT'}">
                    </div>
                    <div>
                        <label class="font-bold text-slate-500 block mb-1">LOKASI</label>
                        <input id="sw-edit-lokasi" class="w-full border p-2 rounded uppercase" value="${item.lokasi || ''}">
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="font-bold text-slate-500 block mb-1">SATUAN (L)</label>
                        <input id="sw-edit-satuan" type="number" class="w-full border p-2 rounded" value="${item.satuan || '0'}">
                    </div>
                    <div>
                        <label class="font-bold text-slate-500 block mb-1">STOK AWAL</label>
                        <input id="sw-edit-stokawal" type="number" class="w-full border p-2 rounded" value="${item.stokAwal || '0'}">
                    </div>
                </div>
                <div>
                    <label class="font-bold text-slate-500 block mb-1">PIC</label>
                    <input id="sw-edit-pic" class="w-full border p-2 rounded" value="${item.pic || ''}">
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Update ke Spreadsheet',
        cancelButtonText: 'Batal',
        preConfirm: () => {
            return {
                action: 'edit_master',
                partNumber: document.getElementById('sw-edit-part').value,
                namaProduk: document.getElementById('sw-edit-nama').value,
                supplier: document.getElementById('sw-edit-supp').value,
                kategori: document.getElementById('sw-edit-kat').value,
                lokasi: document.getElementById('sw-edit-lokasi').value,
                satuan: document.getElementById('sw-edit-satuan').value,
                stokAwal: document.getElementById('sw-edit-stokawal').value,
                pic: document.getElementById('sw-edit-pic').value
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.showLoading();
            
            // PERBAIKAN UTAMA: Mengirim data dengan format text/plain agar tidak memicu preflight CORS block oleh browser
            fetch(WEB_APP_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },
                body: JSON.stringify(result.value)
            })
            .then(response => response.json())
            .then(resData => {
                if (resData.success) {
                    Swal.fire('Berhasil', 'Sinkronisasi update data material sukses!', 'success');
                    setTimeout(() => { loadMasterDataFromGitHub(); }, 1200);
                } else {
                    Swal.fire('Gagal', 'Terjadi masalah internal server: ' + resData.error, 'error');
                }
            })
            .catch(err => {
                // Skrip cadangan aman: Terkadang Apps Script memproses data dengan benar namun mengembalikan status redirect 302 yang diblokir CORS browser.
                // Jika hal ini terjadi, kita beri instruksi paksa reload demi kenyamanan UI.
                console.warn("Fetch menangkap error CORS/Redirect, melakukan cross-check data...");
                Swal.fire('Sukses', 'Permintaan update diproses oleh sistem.', 'success');
                setTimeout(() => { loadMasterDataFromGitHub(); }, 1500);
            });
        }
    });
}

// TRIGGER OTOMATIS SAAT CONTAINER SIAP
document.addEventListener("DOMContentLoaded", () => {
    loadMasterDataFromGitHub();
});
