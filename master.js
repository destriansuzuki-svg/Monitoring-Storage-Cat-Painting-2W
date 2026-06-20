/**
 * master.js - Database Cat & Chemical (GitHub Fetch API Integration)
 */

// LAKUKAN: Ganti string di bawah ini dengan URL Web App (berakhiran /exec) yang Anda dapatkan setelah Deploy Google Apps Script!
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxbVY6lKaebSoF_FP4ip8Kd-Yt7fmFQSxFG1o5vHWH0dk7HqREwNiSokysj5qR1oW7E6Q/exec";

// 1. FUNGSI UNTUK MEMUAT DATA AWAL DARI SPREADSHEET KE GITHUB
function loadMasterDataFromGitHub() {
    // Menambahkan query param ?page=master agar ditangkap oleh doGet() di Apps Script
    fetch(`${WEB_APP_URL}?page=master`)
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                // Panggil fungsi render bawaan untuk menyusun struktur tabel
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
    if (!container) return;

    // Reset class grid bawaan HTML agar tidak mengompresi tabel
    container.className = "w-full block";

    // Menyesuaikan Header Tabel agar sesuai dengan lampiran sistem
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

// 3. FUNGSI UNTUK MERENDER BARIS DATA DARI DATABASE TERDISTRIBUSI
function renderMasterRows(data) {
    const tbody = document.getElementById('masterTableBody');
    const cardContainer = document.getElementById('masterCards');
    
    if (!data || data.length === 0) {
        const empty = `<div class="p-10 text-center text-slate-400 italic">Data Master Kosong.</div>`;
        if(tbody) tbody.innerHTML = `<tr><td colspan="13">${empty}</td></tr>`;
        if(cardContainer) cardContainer.innerHTML = empty;
        return;
    }

    // Render Tabel Desktop dengan data dinamis dari Master_Data & Stock_Material
    tbody.innerHTML = data.map((item, index) => {
        const stokAwal = Number(item.stokAwal) || 0;
        const masuk = Number(item.totalMasuk) || 0;
        const keluar = Number(item.totalKeluar) || 0;
        const stokAkhir = stokAwal + masuk - keluar;

        return `
            <tr class="hover:bg-slate-50/80 transition-colors border-b border-slate-100">
                <td class="p-3 text-center font-bold text-slate-400 bg-slate-50/50">${index + 1}</td>
                <td class="p-3 font-bold text-blue-600 font-mono tracking-tight">${item.partNumber || '-'}</td>
                <td class="p-3 font-medium text-slate-800">${item.namaProduk || '-'}</td>
                <td class="p-3 text-slate-500">${item.supplier || '-'}</td>
                <td class="p-3 text-center">
                    <span class="bg-blue-50 text-blue-600 font-medium px-2 py-0.5 rounded-full text-[10px]">${item.kategori || 'Material'}</span>
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
                    <button onclick="openModalEdit(${JSON.stringify(item).replace(/"/g, '&quot;')})" class="text-blue-500 hover:bg-blue-50 p-1.5 rounded-lg transition-all inline-block">
                        <i class="w-4 h-4" data-lucide="edit-2"></i>
                    </button>
                    <button onclick="handleDeleteMaster('${item.partNumber}')" class="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-all inline-block">
                        <i class="w-4 h-4" data-lucide="trash-2"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    // Render Card Mobile (Disesuaikan agar responsif di smartphone)
    cardContainer.innerHTML = data.map((item, index) => `
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
                <div class="text-right"><span class="text-blue-500 font-bold uppercase block text-[8px]">Stok Akhir</span> ${ (Number(item.stokAwal)||0) + (Number(item.totalMasuk)||0) - (Number(item.totalKeluar)||0) }</div>
            </div>
        </div>
    `).join('');

    if(window.lucide) lucide.createIcons();
}

// 4. FUNGSI MODAL EDIT DATA (SINKRONISASI VIA FETCH POST KE APPS SCRIPT)
function openModalEdit(item) {
    Swal.fire({
        title: 'Edit Material Master',
        html: `
            <div class="text-left space-y-3 text-xs">
                <div>
                    <label class="font-bold text-slate-500 block mb-1">PART NUMBER (ID Utama - Tidak Dapat Diubah)</label>
                    <input id="sw-edit-part" class="w-full border p-2 rounded uppercase bg-slate-100 font-mono font-bold" value="${item.partNumber}" readonly>
                </div>
                <div>
                    <label class="font-bold text-slate-500 block mb-1">NAMA PRODUK</label>
                    <input id="sw-edit-nama" class="w-full border p-2 rounded" value="${item.namaProduk || ''}" placeholder="Nama Produk">
                </div>
                <div>
                    <label class="font-bold text-slate-500 block mb-1">SUPPLIER</label>
                    <input id="sw-edit-supp" class="w-full border p-2 rounded" value="${item.supplier || ''}" placeholder="Supplier">
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="font-bold text-slate-500 block mb-1">KATEGORI</label>
                        <input id="sw-edit-kat" class="w-full border p-2 rounded" value="${item.kategori || 'Material'}" placeholder="Kategori">
                    </div>
                    <div>
                        <label class="font-bold text-slate-500 block mb-1">LOKASI</label>
                        <input id="sw-edit-lokasi" class="w-full border p-2 rounded uppercase" value="${item.lokasi || ''}" placeholder="Lokasi">
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="font-bold text-slate-500 block mb-1">SATUAN (L)</label>
                        <input id="sw-edit-satuan" type="number" class="w-full border p-2 rounded" value="${item.satuan || '0'}" placeholder="Satuan (L)">
                    </div>
                    <div>
                        <label class="font-bold text-slate-500 block mb-1">STOK AWAL</label>
                        <input id="sw-edit-stokawal" type="number" class="w-full border p-2 rounded" value="${item.stokAwal || '0'}" placeholder="Stok Awal">
                    </div>
                </div>
                <div>
                    <label class="font-bold text-slate-500 block mb-1">PIC</label>
                    <input id="sw-edit-pic" class="w-full border p-2 rounded" value="${item.pic || ''}" placeholder="Nama PIC">
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
            
            fetch(WEB_APP_URL, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(result.value)
            })
            .then(() => {
                Swal.fire('Berhasil', 'Sinkronisasi update data material sukses!', 'success');
                setTimeout(() => {
                    loadMasterDataFromGitHub();
                }, 1200);
            })
            .catch(err => {
                Swal.fire('Gagal', 'Terjadi masalah transmisi data: ' + err, 'error');
            });
        }
    });
}

// ==========================================
// TRIGER UTAMA (BAGIAN YANG SEBELUMNYA HILANG)
// ==========================================
// Jalankan fungsi load data otomatis ketika file master.js dimuat di browser
document.addEventListener("DOMContentLoaded", () => {
    loadMasterDataFromGitHub();
});
