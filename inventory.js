/**
 * MODULE: INVENTORY (ADVANCED FEATURES)
 * Menampilkan 15 Kolom: NO, TGL, SJ, PART, PRODUK, SUPP, LOT, EXP, REV, VOL, QTY K, QTY L, LOKASI, STAT, KET
 */

let currentInventoryData = [];

function renderInventoryTable(data) {
    currentInventoryData = data;
    const section = document.getElementById('inventory-section');
    
    section.innerHTML = `
        <div class="mb-4 flex flex-col md:flex-row gap-3 items-end bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div class="flex-1 w-full">
                <label class="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Cari Transaksi</label>
                <div class="relative">
                    <input type="text" id="invSearch" oninput="applyFilters()" placeholder="Cari Part, SJ, atau Produk..." 
                        class="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none">
                    <i data-lucide="search" class="w-4 h-4 absolute left-3 top-2.5 text-slate-400"></i>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-2 w-full md:w-auto">
                <div>
                    <label class="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Dari</label>
                    <input type="date" id="dateStart" onchange="applyFilters()" class="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none">
                </div>
                <div>
                    <label class="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Sampai</label>
                    <input type="date" id="dateEnd" onchange="applyFilters()" class="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none">
                </div>
            </div>
            <div class="flex gap-2 w-full md:w-auto">
                <button onclick="exportToExcel()" class="flex-1 md:flex-none px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 flex items-center justify-center gap-2">
                    <i data-lucide="file-spreadsheet" class="w-4 h-4"></i> EXPORT
                </button>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="hidden md:block overflow-x-auto custom-scrollbar">
                <table class="w-full text-left border-collapse" style="font-size: 9px; min-width: 1500px;">
                    <thead class="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                        <tr>
                            <th class="p-2 border-r text-center sticky left-0 bg-slate-100">NO</th>
                            <th class="p-2 border-r">TANGGAL</th>
                            <th class="p-2 border-r">SURAT JALAN</th>
                            <th class="p-2 border-r">PART NUMBER</th>
                            <th class="p-2 border-r">PRODUK</th>
                            <th class="p-2 border-r">SUPPLIER</th>
                            <th class="p-2 border-r">LOT</th>
                            <th class="p-2 border-r text-red-600">EXP</th>
                            <th class="p-2 border-r text-orange-600">REV. EXP</th>
                            <th class="p-2 border-r text-center">VOL(L)</th>
                            <th class="p-2 border-r text-center">QTY(K)</th>
                            <th class="p-2 border-r text-center">QTY(L)</th>
                            <th class="p-2 border-r">LOKASI</th>
                            <th class="p-2 border-r text-center">STATUS</th>
                            <th class="p-2 border-r">KETERANGAN</th>
                            <th class="p-2 text-center sticky right-0 bg-slate-100">AKSI</th>
                        </tr>
                    </thead>
                    <tbody id="inventoryBody" class="text-slate-600 divide-y divide-slate-100"></tbody>
                </table>
            </div>

            <div id="inventoryCards" class="md:hidden divide-y divide-slate-100 bg-slate-50"></div>
        </div>
    `;

    renderRows(data);
    if(typeof lucide !== 'undefined') lucide.createIcons();
}

function renderRows(data) {
    const tbody = document.getElementById('inventoryBody');
    const cardContainer = document.getElementById('inventoryCards');
    if (!tbody || !cardContainer) return;
    
    if (data.length === 0) {
        const noDataHtml = `<div class="p-10 text-center text-slate-400 italic text-xs">Data tidak ditemukan.</div>`;
        tbody.innerHTML = `<tr><td colspan="16">${noDataHtml}</td></tr>`;
        cardContainer.innerHTML = noDataHtml;
        return;
    }

    // 1. Render Desktop Table Body
    tbody.innerHTML = data.map((item, index) => `
        <tr class="hover:bg-slate-50 transition-colors bg-white">
            <td class="p-2 border-r text-center sticky left-0 bg-white font-bold">${index + 1}</td>
            <td class="p-2 border-r whitespace-nowrap">${item.tgl || item.tanggal || '-'}</td>
            <td class="p-2 border-r font-mono text-[8px]">${item.sj || item.noSuratJalan || '-'}</td>
            <td class="p-2 border-r font-bold text-blue-600">${item.partNo || item.partNumber || '-'}</td>
            <td class="p-2 border-r max-w-[150px] truncate" title="${item.produk}">${item.produk || item.namaProduk || '-'}</td>
            <td class="p-2 border-r">${item.supplier || '-'}</td>
            <td class="p-2 border-r font-mono">${item.lot || '-'}</td>
            <td class="p-2 border-r text-red-600 font-bold">${item.exp || '-'}</td>
            <td class="p-2 border-r text-orange-600 font-bold">${item.revExp || item.revExpired || '-'}</td>
            <td class="p-2 border-r text-center">${item.volLiter || item.volumeLiter || '0'}</td>
            <td class="p-2 border-r text-center">${item.qtyKaleng || '0'}</td>
            <td class="p-2 border-r text-center font-black">${item.qtyLiter || '0'}</td>
            <td class="p-2 border-r font-bold">${item.lokasi || '-'}</td>
            <td class="p-2 border-r text-center">
                <span class="px-1.5 py-0.5 rounded text-[8px] font-black ${item.status === 'IN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">${item.status}</span>
            </td>
            <td class="p-2 border-r italic text-slate-400">${item.keterangan || item.ket || '-'}</td>
            <td class="p-2 text-center sticky right-0 bg-white shadow-[-4px_0_10px_rgba(0,0,0,0.02)]">
                <div class="flex justify-center gap-1">
                    <button onclick="handleEditTransaction('${item.sj || item.noSuratJalan}', '${item.partNo || item.partNumber}')" class="p-1 bg-amber-50 text-amber-600 rounded hover:bg-amber-100">
                        <i data-lucide="edit-3" class="w-3 h-3"></i>
                    </button>
                    <button onclick="handleDeleteTransaction('${item.sj || item.noSuratJalan}', '${item.partNo || item.partNumber}')" class="p-1 bg-red-50 text-red-600 rounded hover:bg-red-100">
                        <i data-lucide="trash-2" class="w-3 h-3"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    // 2. Render Mobile Cards Body
    cardContainer.innerHTML = data.map((item, index) => {
        const statusColor = item.status === 'IN' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
        return `
        <div class="p-4 bg-white border-b border-slate-100 relative">
            <div class="flex justify-between items-start mb-2">
                <div>
                    <span class="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">#${index + 1} | ${item.tgl || item.tanggal}</span>
                    <h3 class="text-xs font-bold text-blue-600 leading-none mt-1">${item.partNo || item.partNumber}</h3>
                </div>
                <span class="px-2 py-0.5 rounded text-[9px] font-black ${statusColor}">${item.status}</span>
            </div>
            
            <p class="text-[10px] text-slate-600 font-medium mb-3 truncate w-full">${item.produk || item.namaProduk}</p>
            
            <div class="grid grid-cols-2 gap-y-2 gap-x-4">
                <div class="flex flex-col">
                    <span class="text-[8px] text-slate-400 uppercase font-bold">No. SJ / Lot</span>
                    <span class="text-[10px] font-mono text-slate-700 truncate">${item.sj || '-'} / ${item.lot || '-'}</span>
                </div>
                <div class="flex flex-col">
                    <span class="text-[8px] text-slate-400 uppercase font-bold">Lokasi</span>
                    <span class="text-[10px] font-bold text-slate-800">${item.lokasi || '-'}</span>
                </div>
                <div class="flex flex-col">
                    <span class="text-[8px] text-red-400 uppercase font-bold">Exp Date</span>
                    <span class="text-[10px] font-bold text-red-600">${item.exp || '-'}</span>
                </div>
                <div class="flex flex-col">
                    <span class="text-[8px] text-slate-400 uppercase font-bold">Quantity (L)</span>
                    <span class="text-[10px] font-black text-slate-900">${item.qtyLiter || '0'} L</span>
                </div>
            </div>

            <div class="mt-4 flex justify-end gap-2 pt-3 border-t border-slate-50">
                <button onclick="handleEditTransaction('${item.sj || item.noSuratJalan}', '${item.partNo || item.partNumber}')" 
                    class="flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                    <i data-lucide="edit-3" class="w-3 h-3"></i> Edit
                </button>
                <button onclick="handleDeleteTransaction('${item.sj || item.noSuratJalan}', '${item.partNo || item.partNumber}')" 
                    class="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                    <i data-lucide="trash-2" class="w-3 h-3"></i> Hapus
                </button>
            </div>
        </div>
        `;
    }).join('');

    if(typeof lucide !== 'undefined') lucide.createIcons();
}

// Logika applyFilters, handleEditTransaction, dan exportToExcel tetap sama seperti sebelumnya
// agar fungsi utama aplikasi tidak berubah.
