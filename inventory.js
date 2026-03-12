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
            <div class="overflow-x-auto custom-scrollbar">
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

    tbody.innerHTML = data.map((item, index) => `
        <tr class="hover:bg-slate-50 transition-colors">
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
            <td class="p-2 text-center sticky right-0 bg-white">
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
}

function applyFilters() {
    const search = document.getElementById('invSearch').value.toLowerCase();
    const start = document.getElementById('dateStart').value;
    const end = document.getElementById('dateEnd').value;

    const filtered = inventoryData.filter(item => {
        const prod = (item.produk || item.namaProduk || "").toLowerCase();
        const sj = (item.sj || item.noSuratJalan || "").toLowerCase();
        const pNo = (item.partNo || item.partNumber || "").toLowerCase();
        
        const matchSearch = prod.includes(search) || sj.includes(search) || pNo.includes(search);
        
        const itemDate = new Date(item.tgl || item.tanggal);
        const matchStart = start ? itemDate >= new Date(start) : true;
        const matchEnd = end ? itemDate <= new Date(end) : true;

        return matchSearch && matchStart && matchEnd;
    });

    renderRows(filtered);
    if(typeof lucide !== 'undefined') lucide.createIcons();
}

function handleEditTransaction(noSJ, partNo) {
    const d = inventoryData.find(i => (i.sj === noSJ || i.noSuratJalan === noSJ) && (i.partNo === partNo || i.partNumber === partNo));
    if(!d) return;

    Swal.fire({
        title: 'Edit Transaksi Inventory',
        width: '800px',
        html: `
            <div class="grid grid-cols-3 gap-4 text-left text-xs p-2">
                <div class="col-span-3 bg-blue-50 p-2 rounded border border-blue-200 font-mono text-blue-700">
                    ID Transaksi: ${noSJ} | ${partNo}
                </div>
                <div>
                    <label class="font-bold">Tanggal</label>
                    <input id="e-tgl" type="date" class="swal2-input !m-0 !w-full !text-xs" value="${d.tgl || d.tanggal}">
                </div>
                <div>
                    <label class="font-bold">No. Surat Jalan</label>
                    <input id="e-sj" class="swal2-input !m-0 !w-full !text-xs" value="${d.sj || d.noSuratJalan}">
                </div>
                <div>
                    <label class="font-bold">Part Number</label>
                    <input id="e-part" class="swal2-input !m-0 !w-full !text-xs" value="${d.partNo || d.partNumber}">
                </div>
                <div class="col-span-2">
                    <label class="font-bold">Nama Produk</label>
                    <input id="e-produk" class="swal2-input !m-0 !w-full !text-xs" value="${d.produk || d.namaProduk}">
                </div>
                <div>
                    <label class="font-bold">Supplier</label>
                    <input id="e-supp" class="swal2-input !m-0 !w-full !text-xs" value="${d.supplier || ''}">
                </div>
                <div>
                    <label class="font-bold">No. Lot</label>
                    <input id="e-lot" class="swal2-input !m-0 !w-full !text-xs" value="${d.lot || ''}">
                </div>
                <div>
                    <label class="font-bold">Expired Date</label>
                    <input id="e-exp" type="date" class="swal2-input !m-0 !w-full !text-xs" value="${d.exp || ''}">
                </div>
                <div>
                    <label class="font-bold">Rev. Expired</label>
                    <input id="e-rev" type="date" class="swal2-input !m-0 !w-full !text-xs" value="${d.revExp || d.revExpired || ''}">
                </div>
                <div>
                    <label class="font-bold">Vol (L)</label>
                    <input id="e-vol" type="number" class="swal2-input !m-0 !w-full !text-xs" value="${d.volLiter || d.volumeLiter || 0}">
                </div>
                <div>
                    <label class="font-bold">Qty (Kaleng)</label>
                    <input id="e-qtyK" type="number" class="swal2-input !m-0 !w-full !text-xs" value="${d.qtyKaleng || 0}">
                </div>
                <div>
                    <label class="font-bold">Lokasi</label>
                    <input id="e-lokasi" class="swal2-input !m-0 !w-full !text-xs" value="${d.lokasi || ''}">
                </div>
                <div class="col-span-3">
                    <label class="font-bold">Keterangan</label>
                    <textarea id="e-ket" class="swal2-textarea !m-0 !w-full !text-xs">${d.keterangan || d.ket || ''}</textarea>
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
                data: {
                    tgl: document.getElementById('e-tgl').value,
                    sj: document.getElementById('e-sj').value,
                    partNo: document.getElementById('e-part').value,
                    produk: document.getElementById('e-produk').value,
                    supplier: document.getElementById('e-supp').value,
                    lot: document.getElementById('e-lot').value,
                    exp: document.getElementById('e-exp').value,
                    revExp: document.getElementById('e-rev').value,
                    volLiter: document.getElementById('e-vol').value,
                    qtyKaleng: document.getElementById('e-qtyK').value,
                    lokasi: document.getElementById('e-lokasi').value,
                    ket: document.getElementById('e-ket').value
                }
            }
        }
    }).then(res => {
        if(res.isConfirmed) saveToSpreadsheet(res.value);
    });
}

function exportToExcel() {
    let csv = "No,Tanggal,Surat Jalan,Part Number,Produk,Supplier,Lot,Exp,Rev Exp,Vol,Qty K,Qty L,Lokasi,Status,Ket\n";
    currentInventoryData.forEach((item, index) => {
        csv += `${index + 1},${item.tgl || item.tanggal},${item.sj || item.noSuratJalan},${item.partNo || item.partNumber},"${item.produk || item.namaProduk}",${item.supplier},${item.lot},${item.exp},${item.revExp || item.revExpired},${item.volLiter || item.volumeLiter},${item.qtyKaleng},${item.qtyLiter},${item.lokasi},${item.status},"${item.keterangan || item.ket}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Laporan_Inventory_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}
