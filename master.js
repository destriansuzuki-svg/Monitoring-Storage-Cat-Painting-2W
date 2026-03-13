/**
 * master.js - Logic Database Cat & Chemical
 * Menampilkan: NO, ENTRY DATE, PART NUMBER, NAMA PRODUK, SUPPLIER, SATUAN, LOKASI
 */

let currentMasterData = [];

function renderManageMaster(data) {
    currentMasterData = data;
    const container = document.getElementById('masterContainer');
    if (!container) return;

    // Struktur Tabel dengan Layout Fixed agar tidak tabrakan
    container.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="hidden md:block">
                <table class="w-full text-left border-collapse table-fixed" style="font-size: 11px;">
                    <thead class="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                        <tr>
                            <th class="p-3 border-r text-center" style="width: 40px;">NO</th>
                            <th class="p-3 border-r" style="width: 100px;">ENTRY DATE</th>
                            <th class="p-3 border-r" style="width: 120px;">PART NUMBER</th>
                            <th class="p-3 border-r">NAMA PRODUK</th>
                            <th class="p-3 border-r" style="width: 130px;">SUPPLIER</th>
                            <th class="p-3 border-r text-center" style="width: 80px;">SATUAN (L)</th>
                            <th class="p-3 border-r text-center" style="width: 100px;">LOKASI</th>
                            <th class="p-3 text-center" style="width: 80px;">AKSI</th>
                        </tr>
                    </thead>
                    <tbody id="masterTableBody" class="text-slate-600 divide-y divide-slate-100 bg-white">
                        </tbody>
                </table>
            </div>

            <div id="masterCards" class="md:hidden divide-y divide-slate-100 bg-slate-50"></div>
        </div>
    `;

    renderMasterRows(data);
}

function renderMasterRows(data) {
    const tbody = document.getElementById('masterTableBody');
    const cardContainer = document.getElementById('masterCards');
    
    // Jika data kosong, tampilkan baris kosong yang rapi
    if (!data || data.length === 0) {
        const emptyHtml = `
            <tr>
                <td colspan="8" class="p-10 text-center text-slate-400 italic">
                    <i data-lucide="info" class="w-8 h-8 mx-auto mb-2 opacity-20"></i>
                    <p>Database kosong. Silahkan "Tambah Material".</p>
                </td>
            </tr>`;
        tbody.innerHTML = emptyHtml;
        cardContainer.innerHTML = `<div class="p-10 text-center text-slate-400 italic">Database Kosong</div>`;
        lucide.createIcons();
        return;
    }

    // Render Data Master
    tbody.innerHTML = data.map((item, index) => `
        <tr class="hover:bg-slate-50 transition-colors">
            <td class="p-3 border-r text-center font-bold">${index + 1}</td>
            <td class="p-3 border-r">${item.entryDate || '-'}</td>
            <td class="p-3 border-r font-bold text-blue-600 font-mono">${item.partNumber || '-'}</td>
            <td class="p-3 border-r truncate font-medium" title="${item.namaProduk}">${item.namaProduk || '-'}</td>
            <td class="p-3 border-r truncate">${item.supplier || '-'}</td>
            <td class="p-3 border-r text-center font-black">${item.satuan || '0'} L</td>
            <td class="p-3 border-r text-center uppercase font-bold text-slate-500">${item.lokasi || '-'}</td>
            <td class="p-3 text-center">
                <div class="flex justify-center gap-1">
                    <button onclick="handleEditMaster('${item.partNumber}')" class="text-amber-600 p-1 hover:bg-amber-50 rounded"><i data-lucide="edit-3" class="w-3.5 h-3.5"></i></button>
                    <button onclick="handleDeleteMaster('${item.partNumber}')" class="text-red-600 p-1 hover:bg-red-50 rounded"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
                </div>
            </td>
        </tr>
    `).join('');

    lucide.createIcons();
}

// Fungsi Tambah Material yang mengirimkan data ke Spreadsheet
function openModalAdd() {
    const today = new Date().toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' });
    
    Swal.fire({
        title: 'Tambah Material Baru',
        html: `
            <div class="text-left space-y-3 p-2 text-xs">
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="font-bold text-slate-400 uppercase mb-1 block">Entry Date</label>
                        <input id="swal-date" class="w-full bg-slate-50 border rounded p-2" value="${today}" readonly>
                    </div>
                    <div>
                        <label class="font-bold text-slate-400 uppercase mb-1 block">Part Number</label>
                        <input id="swal-part" class="w-full border rounded p-2 uppercase font-bold" placeholder="P001-XXX">
                    </div>
                </div>
                <div>
                    <label class="font-bold text-slate-400 uppercase mb-1 block">Nama Produk</label>
                    <input id="swal-nama" class="w-full border rounded p-2" placeholder="Nama lengkap material">
                </div>
                <div class="grid grid-cols-3 gap-2">
                    <div class="col-span-1">
                        <label class="font-bold text-slate-400 uppercase mb-1 block">Satuan (L)</label>
                        <input id="swal-satuan" type="number" class="w-full border rounded p-2 font-bold" value="20">
                    </div>
                    <div class="col-span-2">
                        <label class="font-bold text-slate-400 uppercase mb-1 block">Lokasi Storage</label>
                        <input id="swal-lokasi" class="w-full border rounded p-2 uppercase" placeholder="Contoh: A-1">
                    </div>
                </div>
                <div>
                    <label class="font-bold text-slate-400 uppercase mb-1 block">Supplier</label>
                    <input id="swal-supplier" class="w-full border rounded p-2" placeholder="Vendor / PT">
                </div>
            </div>
        `,
        confirmButtonText: 'Koneksikan & Simpan',
        showCancelButton: true,
        preConfirm: () => {
            const data = {
                entryDate: document.getElementById('swal-date').value,
                partNumber: document.getElementById('swal-part').value.toUpperCase(),
                namaProduk: document.getElementById('swal-nama').value,
                supplier: document.getElementById('swal-supplier').value,
                satuan: document.getElementById('swal-satuan').value,
                lokasi: document.getElementById('swal-lokasi').value.toUpperCase()
            };
            if (!data.partNumber || !data.namaProduk) {
                Swal.showValidationMessage('Part Number & Nama Produk wajib diisi!');
            }
            return data;
        }
    }).then((res) => {
        if (res.isConfirmed && typeof saveToSpreadsheet === 'function') {
            // Mengirim data ke fungsi koneksi di dashboard.js
            saveToSpreadsheet({ action: 'add_master', ...res.value });
        }
    });
}
