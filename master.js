/**
 * master.js - Logic Database Cat & Chemical
 * Tampilan: Tabel Fixed (Desktop) & Cards (Mobile)
 * Sesuai format: NO, ENTRY DATE, PART NUMBER, NAMA PRODUK, SUPPLIER, SATUAN
 */

let currentMasterData = [];

// 1. Fungsi Utama: Render Data
function renderManageMaster(data) {
    currentMasterData = data;
    const container = document.getElementById('masterContainer');
    if (!container) return;

    // Template Dasar: Layout Tabel Desktop & Container Card Mobile
    container.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="hidden md:block">
                <table class="w-full text-left border-collapse table-fixed" style="font-size: 11px; width: 100%;">
                    <thead class="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                        <tr>
                            <th class="p-3 border-r text-center" style="width: 5%;">NO</th>
                            <th class="p-3 border-r" style="width: 15%;">ENTRY DATE</th>
                            <th class="p-3 border-r" style="width: 15%;">PART NUMBER</th>
                            <th class="p-3 border-r" style="width: 30%;">NAMA PRODUK</th>
                            <th class="p-3 border-r" style="width: 15%;">SUPPLIER</th>
                            <th class="p-3 border-r text-center" style="width: 10%;">SATUAN (L)</th>
                            <th class="p-3 text-center" style="width: 10%;">AKSI</th>
                        </tr>
                    </thead>
                    <tbody id="masterTableBody" class="text-slate-600 divide-y divide-slate-100 bg-white"></tbody>
                </table>
            </div>

            <div id="masterCards" class="md:hidden divide-y divide-slate-100 bg-slate-50"></div>
        </div>
    `;

    renderMasterRows(data);
}

// 2. Fungsi Render Baris & Kartu
function renderMasterRows(data) {
    const tbody = document.getElementById('masterTableBody');
    const cardContainer = document.getElementById('masterCards');
    
    if (!data || data.length === 0) {
        const emptyHtml = `
            <div class="p-20 text-center text-slate-400 italic">
                <i data-lucide="database" class="w-10 h-10 mx-auto mb-2 opacity-20"></i>
                <p>Data Master tidak ditemukan.</p>
            </div>`;
        if(tbody) tbody.innerHTML = `<tr><td colspan="7">${emptyHtml}</td></tr>`;
        if(cardContainer) cardContainer.innerHTML = emptyHtml;
        lucide.createIcons();
        return;
    }

    // --- RENDER DESKTOP TABLE ---
    tbody.innerHTML = data.map((item, index) => `
        <tr class="hover:bg-blue-50/30 transition-colors">
            <td class="p-3 border-r text-center font-bold">${index + 1}</td>
            <td class="p-3 border-r text-slate-500">${item.entryDate || '-'}</td>
            <td class="p-3 border-r font-bold text-blue-600 font-mono">${item.partNumber || '-'}</td>
            <td class="p-3 border-r truncate font-medium text-slate-800" title="${item.namaProduk}">${item.namaProduk || '-'}</td>
            <td class="p-3 border-r truncate">${item.supplier || '-'}</td>
            <td class="p-3 border-r text-center font-black">${item.satuan || '0'} L</td>
            <td class="p-3 text-center">
                <div class="flex justify-center gap-2">
                    <button onclick="handleEditMaster('${item.partNumber}')" class="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                        <i data-lucide="edit-3" class="w-4 h-4"></i>
                    </button>
                    <button onclick="handleDeleteMaster('${item.partNumber}')" class="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    // --- RENDER MOBILE CARDS ---
    cardContainer.innerHTML = data.map((item, index) => `
        <div class="p-4 bg-white relative">
            <div class="flex justify-between items-start mb-2">
                <div>
                    <span class="text-[10px] font-black text-slate-300 uppercase">#${index + 1}</span>
                    <h3 class="text-xs font-bold text-blue-600 mt-1">${item.partNumber || '-'}</h3>
                </div>
                <div class="flex gap-2">
                    <button onclick="handleEditMaster('${item.partNumber}')" class="p-2 bg-amber-50 text-amber-600 rounded-lg"><i data-lucide="edit-3" class="w-4 h-4"></i></button>
                    <button onclick="handleDeleteMaster('${item.partNumber}')" class="p-2 bg-red-50 text-red-600 rounded-lg"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                </div>
            </div>
            <p class="text-[11px] font-bold text-slate-700 mb-3">${item.namaProduk || '-'}</p>
            <div class="grid grid-cols-2 gap-4 border-t pt-3">
                <div class="flex flex-col">
                    <span class="text-[8px] text-slate-400 font-black uppercase">Supplier</span>
                    <span class="text-[10px] font-medium truncate">${item.supplier || '-'}</span>
                </div>
                <div class="flex flex-col text-right">
                    <span class="text-[8px] text-slate-400 font-black uppercase">Satuan</span>
                    <span class="text-[10px] font-black text-slate-800">${item.satuan || '0'} LITER</span>
                </div>
            </div>
            <div class="mt-2 text-[8px] text-slate-300 font-medium">Entry: ${item.entryDate || '-'}</div>
        </div>
    `).join('');

    lucide.createIcons();
}

// 3. Pencarian (Filter)
document.getElementById('searchMaster')?.addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase();
    if (typeof catChemicalMaster !== 'undefined') {
        const filtered = catChemicalMaster.filter(item => 
            item.namaProduk.toLowerCase().includes(keyword) || 
            item.partNumber.toLowerCase().includes(keyword) ||
            item.supplier.toLowerCase().includes(keyword)
        );
        renderMasterRows(filtered);
    }
});

// 4. Integrasi ke Spreadsheet (Simpan/Tambah)
function openModalAdd() {
    const today = new Date().toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' });
    
    Swal.fire({
        title: 'Tambah Material Baru',
        html: `
            <div class="text-left space-y-4 p-2">
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Entry Date</label>
                        <input id="swal-date" class="w-full bg-slate-50 border rounded-lg p-2 text-xs font-bold" value="${today}" readonly>
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Part Number</label>
                        <input id="swal-part" class="w-full border rounded-lg p-2 text-xs font-bold uppercase" placeholder="Contoh: P001">
                    </div>
                </div>
                <div>
                    <label class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Nama Produk</label>
                    <input id="swal-nama" class="w-full border rounded-lg p-2 text-xs" placeholder="Nama lengkap material">
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Supplier</label>
                        <input id="swal-supplier" class="w-full border rounded-lg p-2 text-xs" placeholder="Nama Vendor">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Satuan (L)</label>
                        <input id="swal-satuan" type="number" class="w-full border rounded-lg p-2 text-xs font-black" value="20">
                    </div>
                </div>
            </div>
        `,
        confirmButtonText: 'Simpan ke Database',
        showCancelButton: true,
        preConfirm: () => {
            const result = {
                entryDate: document.getElementById('swal-date').value,
                partNumber: document.getElementById('swal-part').value.toUpperCase(),
                namaProduk: document.getElementById('swal-nama').value,
                supplier: document.getElementById('swal-supplier').value,
                satuan: document.getElementById('swal-satuan').value
            };
            if (!result.partNumber || !result.namaProduk) {
                Swal.showValidationMessage('Part Number & Nama Produk wajib diisi!');
            }
            return result;
        }
    }).then((res) => {
        if (res.isConfirmed && typeof saveToSpreadsheet === 'function') {
            saveToSpreadsheet({ 
                action: 'add_master', 
                ...res.value 
            });
        }
    });
}

// 5. Integrasi Edit & Delete
function handleEditMaster(partNo) {
    const data = catChemicalMaster.find(i => i.partNumber === partNo);
    if(!data) return;

    Swal.fire({
        title: 'Edit Data Master',
        html: ``,
        // ... (Logika mirip Add dengan action: 'edit_master')
    });
}

function handleDeleteMaster(partNo) {
    Swal.fire({
        title: 'Hapus Master?',
        text: `Data ${partNo} akan dihapus permanen.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Ya, Hapus'
    }).then((res) => {
        if (res.isConfirmed && typeof saveToSpreadsheet === 'function') {
            saveToSpreadsheet({ 
                action: 'delete_master', 
                partNumber: partNo 
            });
        }
    });
}
