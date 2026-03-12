/**
 * MODULE: INVENTORY (FULL DATABASE VIEW)
 * Menampilkan semua 15 kolom sesuai urutan Spreadsheet.
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
            <div class="flex gap-2 w-full md:w-auto">
                <button onclick="exportToExcel()" class="flex-1 md:flex-none px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 flex items-center justify-center gap-2">
                    <i data-lucide="file-spreadsheet" class="w-4 h-4"></i> EXPORT EXCEL
                </button>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="overflow-x-auto custom-scrollbar">
                <table class="w-full text-left border-collapse" style="font-size: 10px; min-width: 1600px;">
                    <thead class="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                        <tr>
                            <th class="p-3 border-r text-center sticky left-0 bg-slate-100 z-10">NO</th>
                            <th class="p-3 border-r whitespace-nowrap">TANGGAL</th>
                            <th class="p-3 border-r whitespace-nowrap">NO SURAT JALAN</th>
                            <th class="p-3 border-r whitespace-nowrap">PART NUMBER</th>
                            <th class="p-3 border-r min-w-[200px]">NAMA PRODUK</th>
                            <th class="p-3 border-r">SUPPLIER</th>
                            <th class="p-3 border-r">NO. LOT</th>
                            <th class="p-3 border-r text-red-600">EXPIRED</th>
                            <th class="p-3 border-r text-orange-600">REV. EXPIRED</th>
                            <th class="p-3 border-r text-center">VOLUME (L)</th>
                            <th class="p-3 border-r text-center">QTY (KALENG)</th>
                            <th class="p-3 border-r text-center">QTY (LITER)</th>
                            <th class="p-3 border-r">LOKASI</th>
                            <th class="p-3 border-r text-center">STATUS</th>
                            <th class="p-3 border-r min-w-[150px]">KETERANGAN</th>
                            <th class="p-3 text-center sticky right-0 bg-slate-100 z-10">AKSI</th>
                        </tr>
                    </thead>
                    <tbody id="inventoryBody" class="text-slate-600 divide-y divide-slate-100"></tbody>
                </table>
            </div>
        </div>
    `;

    renderRows(data);
    if(typeof lucide !== 'undefined') lucide.createIcons();
}

function renderRows(data) {
    const tbody = document.getElementById('inventoryBody');
    if (!tbody) return;

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="16" class="p-10 text-center text-slate-400 italic">Data tidak ditemukan.</td></tr>`;
        return;
    }

    tbody.innerHTML = data.map((item, index) => {
        const statusClass = item.status === 'IN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
        
        return `
        <tr class="hover:bg-blue-50/30 transition-colors group">
            <td class="p-3 border-r text-center sticky left-0 bg-white group-hover:bg-blue-50 z-10 font-medium">${index + 1}</td>
            <td class="p-3 border-r whitespace-nowrap">${item.tanggal || item.tgl || '-'}</td>
            <td class="p-3 border-r font-mono text-[9px]">${item.noSuratJalan || item.sj || '-'}</td>
            <td class="p-3 border-r font-bold text-blue-600">${item.partNumber || item.partNo || '-'}</td>
            <td class="p-3 border-r text-[10px] font-medium text-slate-800">${item.namaProduk || item.produk || '-'}</td>
            <td class="p-3 border-r text-[9px]">${item.supplier || '-'}</td>
            <td class="p-3 border-r font-mono bg-slate-50/50">${item.noLot || item.lot || '-'}</td>
            <td class="p-3 border-r text-red-600 font-bold">${item.expired || item.exp || '-'}</td>
            <td class="p-3 border-r text-orange-600 font-bold">${item.revExpired || item.revExp || '-'}</td>
            <td class="p-3 border-r text-center font-bold">${item.volumeLiter || item.volLiter || '0'}</td>
            <td class="p-3 border-r text-center font-bold">${item.qtyKaleng || '0'}</td>
            <td class="p-3 border-r text-center font-black text-slate-900 bg-blue-50/20">${item.qtyLiter || '0'}</td>
            <td class="p-3 border-r text-[9px] font-bold uppercase">${item.lokasi || '-'}</td>
            <td class="p-3 border-r text-center">
                <span class="px-2 py-0.5 rounded-full text-[8px] font-black ${statusClass}">${item.status || '-'}</span>
            </td>
            <td class="p-3 border-r text-[9px] italic text-slate-500">${item.keterangan || item.ket || '-'}</td>
            <td class="p-3 text-center sticky right-0 bg-white group-hover:bg-blue-50 z-10">
                <div class="flex justify-center gap-1">
                    <button onclick="handleEditTransaction('${item.noSuratJalan || item.sj}', '${item.partNumber || item.partNo}')" class="p-1.5 bg-amber-50 text-amber-600 rounded hover:bg-amber-100 transition-colors">
                        <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                    </button>
                    <button onclick="handleDeleteTransaction('${item.noSuratJalan || item.sj}', '${item.partNumber || item.partNo}')" class="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors">
                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    </button>
                </div>
            </td>
        </tr>`;
    }).join('');
}
