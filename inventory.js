/**
 * MODULE: INVENTORY (ADVANCED FEATURES)
 */

// Global Filter State
let currentInventoryData = [];

function renderInventoryTable(data) {
    currentInventoryData = data; // Simpan untuk referensi export/filter
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
            <div class="hidden md:block overflow-x-auto">
                <table class="w-full text-left border-collapse" style="font-size: 10px;">
                    <thead class="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                        <tr>
                            <th class="p-2 border-r">NO</th>
                            <th class="p-2 border-r">TANGGAL</th>
                            <th class="p-2 border-r">SURAT JALAN</th>
                            <th class="p-2 border-r">PART NUMBER</th>
                            <th class="p-2 border-r">PRODUK</th>
                            <th class="p-2 border-r">LOT</th>
                            <th class="p-2 border-r text-red-600">EXP</th>
                            <th class="p-2 border-r text-center">QTY(L)</th>
                            <th class="p-2 border-r text-center">STATUS</th>
                            <th class="p-2 text-center">AKSI</th>
                        </tr>
                    </thead>
                    <tbody id="inventoryBody" class="text-slate-600 divide-y divide-slate-100"></tbody>
                </table>
            </div>
            <div id="inventoryCards" class="md:hidden divide-y divide-slate-100"></div>
        </div>
    `;

    renderRows(data);
    if(typeof lucide !== 'undefined') lucide.createIcons();
}

// Fungsi Internal Render Row
function renderRows(data) {
    const tbody = document.getElementById('inventoryBody');
    const cardContainer = document.getElementById('inventoryCards');
    
    if (data.length === 0) {
        const msg = `<tr><td colspan="10" class="p-10 text-center text-slate-400 italic text-xs">Data tidak ditemukan.</td></tr>`;
        tbody.innerHTML = msg;
        cardContainer.innerHTML = `<p class="p-10 text-center text-slate-400 text-xs">Data tidak ditemukan.</p>`;
        return;
    }

    tbody.innerHTML = data.map((item, index) => `
        <tr class="hover:bg-slate-50 transition-colors">
            <td class="p-2 border-r text-center">${index + 1}</td>
            <td class="p-2 border-r whitespace-nowrap">${item.tgl}</td>
            <td class="p-2 border-r font-mono text-[9px]">${item.sj}</td>
            <td class="p-2 border-r font-bold">${item.partNo}</td>
            <td class="p-2 border-r text-[9px] max-w-[150px] truncate">${item.produk}</td>
            <td class="p-2 border-r font-mono">${item.lot}</td>
            <td class="p-2 border-r text-red-600 font-bold">${item.exp}</td>
            <td class="p-2 border-r text-center font-black">${item.qtyLiter}</td>
            <td class="p-2 border-r text-center">
                <span class="px-1.5 py-0.5 rounded text-[8px] font-black ${item.status === 'IN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">${item.status}</span>
            </td>
            <td class="p-2 text-center">
                <div class="flex justify-center gap-1">
                    <button onclick="handleEditTransaction('${item.sj}', '${item.partNo}')" class="p-1 bg-amber-50 text-amber-600 rounded hover:bg-amber-100">
                        <i data-lucide="edit-3" class="w-3 h-3"></i>
                    </button>
                    <button onclick="handleDeleteTransaction('${item.sj}', '${item.partNo}')" class="p-1 bg-red-50 text-red-600 rounded hover:bg-red-100">
                        <i data-lucide="trash-2" class="w-3 h-3"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    // Mobile card logic sama (disingkat untuk efisiensi koding)
}

/**
 * LOGIKA FILTER & SEARCH
 */
function applyFilters() {
    const search = document.getElementById('invSearch').value.toLowerCase();
    const start = document.getElementById('dateStart').value;
    const end = document.getElementById('dateEnd').value;

    const filtered = inventoryData.filter(item => {
        const matchSearch = item.produk.toLowerCase().includes(search) || 
                            item.sj.toLowerCase().includes(search) || 
                            item.partNo.toLowerCase().includes(search);
        
        // Logika tanggal sederhana (asumsi format tgl data: YYYY-MM-DD atau konversi manual)
        const itemDate = new Date(item.tgl);
        const matchStart = start ? itemDate >= new Date(start) : true;
        const matchEnd = end ? itemDate <= new Date(end) : true;

        return matchSearch && matchStart && matchEnd;
    });

    renderRows(filtered);
    if(typeof lucide !== 'undefined') lucide.createIcons();
}

/**
 * LOGIKA EDIT FULL FIELD
 */
function handleEditTransaction(noSJ, partNo) {
    const d = inventoryData.find(i => i.sj === noSJ && i.partNo === partNo);
    if(!d) return;

    Swal.fire({
        title: 'Edit Transaksi Lengkap',
        width: '600px',
        html: `
            <div class="grid grid-cols-2 gap-4 text-left text-xs p-2">
                <div class="col-span-2 bg-slate-50 p-2 rounded border font-mono">ID: ${noSJ} | ${partNo}</div>
                <div>
                    <label class="font-bold">Tanggal</label>
                    <input id="e-tgl" type="date" class="swal2-input !m-0 !w-full !text-xs" value="${d.tgl}">
                </div>
                <div>
                    <label class="font-bold">No. Surat Jalan</label>
                    <input id="e-sj" class="swal2-input !m-0 !w-full !text-xs" value="${d.sj}">
                </div>
                <div>
                    <label class="font-bold">No. Lot</label>
                    <input id="e-lot" class="swal2-input !m-0 !w-full !text-xs" value="${d.lot}">
                </div>
                <div>
                    <label class="font-bold">Expired Date</label>
                    <input id="e-exp" type="date" class="swal2-input !m-0 !w-full !text-xs" value="${d.exp}">
                </div>
                <div>
                    <label class="font-bold">Qty (Kaleng)</label>
                    <input id="e-qtyK" type="number" class="swal2-input !m-0 !w-full !text-xs" value="${d.qtyKaleng}">
                </div>
                <div>
                    <label class="font-bold">Lokasi</label>
                    <input id="e-lokasi" class="swal2-input !m-0 !w-full !text-xs" value="${d.lokasi}">
                </div>
            </div>
        `,
        confirmButtonText: 'Simpan Perubahan',
        showCancelButton: true,
        preConfirm: () => {
            return {
                action: 'edit_transaction',
                oldSJ: noSJ,
                oldPart: partNo,
                tgl: document.getElementById('e-tgl').value,
                sj: document.getElementById('e-sj').value,
                lot: document.getElementById('e-lot').value,
                exp: document.getElementById('e-exp').value,
                qtyKaleng: document.getElementById('e-qtyK').value,
                lokasi: document.getElementById('e-lokasi').value
            }
        }
    }).then(res => {
        if(res.isConfirmed) saveToSpreadsheet(res.value);
    });
}

/**
 * FUNGSI EXPORT EXCEL (Simple CSV Version)
 */
function exportToExcel() {
    let csv = "No,Tanggal,Surat Jalan,Part Number,Produk,Supplier,Lot,Exp,Qty Liter,Status\n";
    currentInventoryData.forEach((item, index) => {
        csv += `${index + 1},${item.tgl},${item.sj},${item.partNo},"${item.produk}",${item.supplier},${item.lot},${item.exp},${item.qtyLiter},${item.status}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Laporan_Inventory_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
