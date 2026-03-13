/**
 * MODULE: INVENTORY (ADVANCED FEATURES - FULL COMPACT)
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
            <div class="hidden md:block overflow-hidden">
                <table class="w-full text-left border-collapse table-fixed" style="font-size: 8.5px;">
                    <thead class="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                        <tr>
                            <th class="p-2 border-r text-center w-[30px]">NO</th>
                            <th class="p-2 border-r w-[70px]">TANGGAL</th>
                            <th class="p-2 border-r w-[100px]">SJ</th>
                            <th class="p-2 border-r w-[100px]">PART NO</th>
                            <th class="p-2 border-r w-[150px]">PRODUK</th>
                            <th class="p-2 border-r w-[80px]">SUPP</th>
                            <th class="p-2 border-r w-[80px]">LOT</th>
                            <th class="p-2 border-r text-red-600 w-[60px]">EXP</th>
                            <th class="p-2 border-r text-orange-600 w-[60px]">REV</th>
                            <th class="p-2 border-r text-center w-[40px]">VOL</th>
                            <th class="p-2 border-r text-center w-[35px]">K</th>
                            <th class="p-2 border-r text-center w-[50px]">QTY L</th>
                            <th class="p-2 border-r w-[70px]">LOKASI</th>
                            <th class="p-2 border-r text-center w-[40px]">STAT</th>
                            <th class="p-2 border-r">KET</th>
                            <th class="p-2 text-center w-[60px]">AKSI</th>
                        </tr>
                    </thead>
                    <tbody id="inventoryBody" class="text-slate-600 divide-y divide-slate-100 bg-white"></tbody>
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

    // --- RENDER TABLE DESKTOP ---
    tbody.innerHTML = data.map((item, index) => `
        <tr class="hover:bg-slate-50 transition-colors bg-white">
            <td class="p-2 border-r text-center font-bold">${index + 1}</td>
            <td class="p-2 border-r truncate text-[8px]">${item.tgl || item.tanggal || '-'}</td>
            <td class="p-2 border-r font-mono truncate" title="${item.sj}">${item.sj || item.noSuratJalan || '-'}</td>
            <td class="p-2 border-r font-bold text-blue-600 truncate" title="${item.partNo}">${item.partNo || item.partNumber || '-'}</td>
            <td class="p-2 border-r truncate" title="${item.produk}">${item.produk || item.namaProduk || '-'}</td>
            <td class="p-2 border-r truncate text-[8px]">${item.supplier || '-'}</td>
            <td class="p-2 border-r font-mono truncate">${item.lot || '-'}</td>
            <td class="p-2 border-r text-red-600 font-bold">${item.exp || '-'}</td>
            <td class="p-2 border-r text-orange-600 font-bold">${item.revExp || item.revExpired || '-'}</td>
            <td class="p-2 border-r text-center">${item.volLiter || item.volumeLiter || '0'}</td>
            <td class="p-2 border-r text-center">${item.qtyKaleng || '0'}</td>
            <td class="p-2 border-r text-center font-black">${item.qtyLiter || '0'}</td>
            <td class="p-2 border-r font-bold uppercase text-[8px] truncate">${item.lokasi || '-'}</td>
            <td class="p-2 border-r text-center font-black text-[7px] ${item.status === 'IN' ? 'text-green-600' : 'text-red-600'}">${item.status}</td>
            <td class="p-2 border-r italic text-slate-400 truncate" title="${item.keterangan}">${item.keterangan || item.ket || '-'}</td>
            <td class="p-2 text-center">
                <div class="flex justify-center gap-1">
                    <button onclick="handleEditTransaction('${item.sj || item.noSuratJalan}', '${item.partNo || item.partNumber}')" class="text-amber-600 hover:text-amber-800"><i data-lucide="edit-3" class="w-3.5 h-3.5"></i></button>
                    <button onclick="handleDeleteTransaction('${item.sj || item.noSuratJalan}', '${item.partNo || item.partNumber}')" class="text-red-600 hover:text-red-800"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
                </div>
            </td>
        </tr>
    `).join('');

    // --- RENDER MOBILE CARDS ---
    cardContainer.innerHTML = data.map((item, index) => {
        const statusColor = item.status === 'IN' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
        return `
        <div class="p-4 bg-white border-b border-slate-100 relative">
            <div class="flex justify-between items-start mb-2">
                <div>
                    <span class="text-[9px] font-bold text-slate-400 uppercase">#${index + 1} | ${item.tgl || item.tanggal}</span>
                    <h3 class="text-xs font-bold text-blue-600 leading-none mt-1">${item.partNo || item.partNumber}</h3>
                </div>
                <span class="px-2 py-0.5 rounded text-[9px] font-black ${statusColor}">${item.status}</span>
            </div>
            <p class="text-[10px] text-slate-600 font-medium mb-3 truncate w-full">${item.produk || item.namaProduk}</p>
            <div class="grid grid-cols-2 gap-y-2 gap-x-4">
                <div class="flex flex-col"><span class="text-[8px] text-slate-400 uppercase font-bold text-[7px]">No. SJ / Lot</span><span class="text-[10px] font-mono truncate">${item.sj || '-'} / ${item.lot || '-'}</span></div>
                <div class="flex flex-col"><span class="text-[8px] text-slate-400 uppercase font-bold text-[7px]">Lokasi</span><span class="text-[10px] font-bold">${item.lokasi || '-'}</span></div>
                <div class="flex flex-col"><span class="text-[8px] text-red-400 uppercase font-bold text-[7px]">Exp Date</span><span class="text-[10px] font-bold text-red-600">${item.exp || '-'}</span></div>
                <div class="flex flex-col"><span class="text-[8px] text-slate-400 uppercase font-bold text-[7px]">Qty (L)</span><span class="text-[10px] font-black">${item.qtyLiter || '0'} L</span></div>
            </div>
            <div class="mt-4 flex justify-end gap-2 pt-3 border-t border-slate-50">
                <button onclick="handleEditTransaction('${item.sj || item.noSuratJalan}', '${item.partNo || item.partNumber}')" class="px-3 py-1.5 bg-amber-50 text-amber-600 rounded text-[10px] font-bold uppercase tracking-wider">Edit</button>
                <button onclick="handleDeleteTransaction('${item.sj || item.noSuratJalan}', '${item.partNo || item.partNumber}')" class="px-3 py-1.5 bg-red-50 text-red-600 rounded text-[10px] font-bold uppercase tracking-wider">Hapus</button>
            </div>
        </div>`;
    }).join('');

    if(typeof lucide !== 'undefined') lucide.createIcons();
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
