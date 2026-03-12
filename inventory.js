/**
 * MODULE: INVENTORY (WITH ACTION BUTTONS)
 */

function renderInventoryTable(data) {
    const section = document.getElementById('inventory-section');
    
    section.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="hidden md:block overflow-x-auto">
                <table class="w-full text-left border-collapse" style="font-size: 10px;">
                    <thead class="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                        <tr>
                            <th class="p-2 border-r">NO</th>
                            <th class="p-2 border-r">TANGGAL</th>
                            <th class="p-2 border-r">NO SURAT JALAN</th>
                            <th class="p-2 border-r">PART NUMBER</th>
                            <th class="p-2 border-r" style="min-width: 150px;">NAMA PRODUK</th>
                            <th class="p-2 border-r">SUPPLIER</th>
                            <th class="p-2 border-r">NO. LOT</th>
                            <th class="p-2 border-r text-red-600">EXPIRED</th>
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

    const tbody = document.getElementById('inventoryBody');
    const cardContainer = document.getElementById('inventoryCards');
    
    if (data.length === 0) {
        const emptyMsg = `<p class="p-10 text-center text-slate-400 italic text-xs">Belum ada data transaksi.</p>`;
        tbody.innerHTML = `<tr><td colspan="11">${emptyMsg}</td></tr>`;
        cardContainer.innerHTML = emptyMsg;
        return;
    }

    tbody.innerHTML = data.map((item, index) => renderRow(item, index)).join('');
    cardContainer.innerHTML = data.map((item, index) => renderCard(item, index)).join('');
    
    // Inisialisasi ulang icon lucide jika ada
    if(typeof lucide !== 'undefined') lucide.createIcons();
}

// Helper 1: Desktop Row
function renderRow(item, index) {
    const limit = 30;
    const namaSingkat = item.produk.length > limit ? item.produk.substring(0, limit) + '...' : item.produk;
    
    return `
        <tr class="hover:bg-slate-50 transition-colors">
            <td class="p-2 border-r text-center">${index + 1}</td>
            <td class="p-2 border-r whitespace-nowrap">${item.tgl}</td>
            <td class="p-2 border-r font-mono text-[9px]">${item.sj}</td>
            <td class="p-2 border-r font-bold text-slate-800">${item.partNo}</td>
            <td class="p-2 border-r text-[9px]">
                <span id="text-d-${index}">${namaSingkat}</span>
            </td>
            <td class="p-2 border-r text-[9px]">${item.supplier}</td>
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
    `;
}

// Helper 2: Mobile Card
function renderCard(item, index) {
    return `
        <div class="p-4 space-y-3 relative bg-white border-l-4 ${item.status === 'IN' ? 'border-green-500' : 'border-red-500'}">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-[9px] font-bold text-slate-400 uppercase">${item.tgl} • SJ: ${item.sj}</p>
                    <h4 class="text-xs font-black text-slate-900 mt-0.5">${item.partNo}</h4>
                </div>
                <div class="flex gap-2">
                    <button onclick="handleEditTransaction('${item.sj}', '${item.partNo}')" class="p-1.5 bg-slate-100 text-slate-600 rounded-lg">
                        <i data-lucide="edit-3" class="w-3 h-3"></i>
                    </button>
                    <button onclick="handleDeleteTransaction('${item.sj}', '${item.partNo}')" class="p-1.5 bg-red-50 text-red-600 rounded-lg">
                        <i data-lucide="trash-2" class="w-3 h-3"></i>
                    </button>
                </div>
            </div>
            <p class="text-[10px] text-slate-600">${item.produk}</p>
            <div class="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded-lg text-[10px]">
                <p><b>LOT:</b> ${item.lot}</p>
                <p class="text-right"><b>QTY:</b> ${item.qtyLiter} L</p>
            </div>
        </div>
    `;
}

/**
 * LOGIKA ACTION (HAPUS & EDIT)
 */

async function handleDeleteTransaction(noSJ, partNo) {
    const result = await Swal.fire({
        title: 'Hapus Transaksi?',
        text: `Data SJ: ${noSJ} untuk Part: ${partNo} akan dihapus permanen.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Ya, Hapus'
    });

    if (result.isConfirmed) {
        // Mengirim request action hapus transaksi ke Spreadsheet
        saveToSpreadsheet({ 
            action: 'delete_transaction', 
            noSuratJalan: noSJ,
            partNumber: partNo 
        });
    }
}

function handleEditTransaction(noSJ, partNo) {
    // Cari data di local array
    const data = inventoryData.find(i => i.sj === noSJ && i.partNo === partNo);
    if(!data) return;

    Swal.fire({
        title: 'Edit Transaksi',
        html: `
            <div class="text-left space-y-2 text-xs">
                <label class="font-bold">Quantity (Kaleng)</label>
                <input id="edit-qtyK" type="number" class="swal2-input !m-0 !w-full" value="${data.qtyKaleng}">
                <label class="font-bold">Lokasi</label>
                <input id="edit-lokasi" class="swal2-input !m-0 !w-full" value="${data.lokasi}">
            </div>
        `,
        confirmButtonText: 'Update SJ',
        preConfirm: () => {
            return {
                action: 'edit_transaction',
                noSuratJalan: noSJ,
                partNumber: partNo,
                qtyKaleng: document.getElementById('edit-qtyK').value,
                lokasi: document.getElementById('edit-lokasi').value
            }
        }
    }).then(res => {
        if(res.isConfirmed) saveToSpreadsheet(res.value);
    });
}
