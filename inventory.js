/**
 * MODULE: INVENTORY (ADVANCED FEATURES)
 * Menampilkan 15 Kolom sesuai struktur Database Spreadsheet
 */

// Global Filter State
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
            <div class="w-full md:w-40">
                <label class="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Dari Tanggal</label>
                <input type="date" id="dateStart" onchange="applyFilters()" class="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none">
            </div>
            <div class="w-full md:w-40">
                <label class="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Sampai Tanggal</label>
                <input type="date" id="dateEnd" onchange="applyFilters()" class="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none">
            </div>
            <div class="flex gap-2 w-full md:w-auto">
                <button onclick="exportToExcel()" class="flex-1 md:flex-none px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 flex items-center justify-center gap-2">
                    <i data-lucide="file-spreadsheet" class="w-4 h-4"></i> EXPORT
                </button>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse" style="font-size: 10px; min-width: 1200px;">
                    <thead class="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                        <tr>
                            <th class="p-2 border-r text-center sticky left-0 bg-slate-100">NO</th>
                            <th class="p-2 border-r">TANGGAL</th>
                            <th class="p-2 border-r">NO SURAT JALAN</th>
                            <th class="p-2 border-r">PART NUMBER</th>
                            <th class="p-2 border-r">NAMA PRODUK</th>
                            <th class="p-2 border-r">SUPPLIER</th>
                            <th class="p-2 border-r">NO. LOT</th>
                            <th class="p-2 border-r text-red-600">EXPIRED</th>
                            <th class="p-2 border-r text-orange-600">REV. EXPIRED</th>
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
        </div>
    `;

    renderRows(data);
    if(typeof lucide !== 'undefined') lucide.createIcons();
}

function renderRows(data) {
    const tbody = document.getElementById('inventoryBody');
    if (!tbody) return;
    
    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="16" class="p-10 text-center text-slate-400 italic text-xs">Data tidak ditemukan.</td></tr>`;
        return;
    }

    tbody.innerHTML = data.map((item, index) => {
        const statusClass = item.status === 'IN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
        
        return `
        <tr class="hover:bg-slate-50 transition-colors">
            <td class="p-2 border-r text-center sticky left-0 bg-white group-hover:bg-slate-50">${index + 1}</td>
            <td class="p-2 border-r whitespace-nowrap">${item.tanggal || item.tgl || '-'}</td>
            <td class="p-2 border-r font-mono text-[9px]">${item.noSuratJalan || item.sj || '-'}</td>
            <td class="p-2 border-r font-bold text-blue-600">${item.partNumber || item.partNo || '-'}</td>
            <td class="p-2 border-r text-[9px] max-w-[150px] truncate">${item.namaProduk || item.produk || '-'}</td>
            <td class="p-2 border-r text-[9px]">${item.supplier || '-'}</td>
            <td class="p-2 border-r font-mono">${item.noLot || item.lot || '-'}</td>
            <td class="p-2 border-r text-red-600 font-bold">${item.expired || item.exp || '-'}</td>
            <td class="p-2 border-r text-orange-600 font-bold">${item.revExpired || item.revExp || '-'}</td>
            <td class="p-2 border-r text-center">${item.volumeLiter || item.volLiter || '0'}</td>
            <td class="p-2 border-r text-center">${item.qtyKaleng || '0'}</td>
            <td class="p-2 border-r text-center font-black text-slate-800">${item.qtyLiter || '0'}</td>
            <td class="p-2 border-r text-[9px] font-bold uppercase">${item.lokasi || '-'}</td>
            <td class="p-2 border-r text-center">
                <span class="px-1.5 py-0.5 rounded text-[8px] font-black ${statusClass}">${item.status || '-'}</span>
            </td>
            <td class="p-2 border-r text-[9px] italic max-w-[100px] truncate">${item.keterangan || item.ket || '-'}</td>
            <td class="p-2 text-center sticky right-0 bg-white group-hover:bg-slate-50">
                <div class="flex justify-center gap-1">
                    <button onclick="handleEditTransaction('${item.noSuratJalan || item.sj}', '${item.partNumber || item.partNo}')" class="p-1.5 bg-amber-50 text-amber-600 rounded hover:bg-amber-100">
                        <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                    </button>
                    <button onclick="handleDeleteTransaction('${item.noSuratJalan || item.sj}', '${item.partNumber || item.partNo}')" class="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100">
                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    </button>
                </div>
            </td>
        </tr>`;
    }).join('');
}

function applyFilters() {
    const search = document.getElementById('invSearch').value.toLowerCase();
    const start = document.getElementById('dateStart').value;
    const end = document.getElementById('dateEnd').value;

    const filtered = inventoryData.filter(item => {
        const pNama = (item.namaProduk || item.produk || "").toLowerCase();
        const pSJ = (item.noSuratJalan || item.sj || "").toLowerCase();
        const pPart = (item.partNumber || item.partNo || "").toLowerCase();
        
        const matchSearch = pNama.includes(search) || pSJ.includes(search) || pPart.includes(search);
        
        const itemDateStr = item.tanggal || item.tgl;
        const itemDate = new Date(itemDateStr);
        const matchStart = start ? itemDate >= new Date(start) : true;
        const matchEnd = end ? itemDate <= new Date(end) : true;

        return matchSearch && matchStart && matchEnd;
    });

    renderRows(filtered);
    if(typeof lucide !== 'undefined') lucide.createIcons();
}

function exportToExcel() {
    // Header CSV sesuai urutan Database 15 kolom
    let csv = "NO,TANGGAL,NO SURAT JALAN,PART NUMBER,NAMA PRODUK,SUPPLIER,NO. LOT,EXPIRED,REV. EXPIRED,VOLUME (LITER),QTY (KALENG),QTY (LITER),LOKASI,STATUS,KETERANGAN\n";
    
    currentInventoryData.forEach((item, index) => {
        const row = [
            index + 1,
            item.tanggal || item.tgl || '',
            item.noSuratJalan || item.sj || '',
            item.partNumber || item.partNo || '',
            `"${item.namaProduk || item.produk || ''}"`,
            item.supplier || '',
            item.noLot || item.lot || '',
            item.expired || item.exp || '',
            item.revExpired || item.revExp || '',
            item.volumeLiter || item.volLiter || '0',
            item.qtyKaleng || '0',
            item.qtyLiter || '0',
            item.lokasi || '',
            item.status || '',
            `"${item.keterangan || item.ket || ''}"`
        ];
        csv += row.join(",") + "\n";
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Laporan_Inventory_Lengkap_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}
