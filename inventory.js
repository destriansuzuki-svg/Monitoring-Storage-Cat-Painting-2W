/**
 * MODULE: INVENTORY (RESPONSIVE TABLE TO CARD)
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
                            <th class="p-2 border-r" style="min-w: 150px;">NAMA PRODUK</th>
                            <th class="p-2 border-r">SUPPLIER</th>
                            <th class="p-2 border-r">NO. LOT</th>
                            <th class="p-2 border-r text-red-600">EXPIRED</th>
                            <th class="p-2 border-r text-orange-600">REV. EXP</th>
                            <th class="p-2 border-r text-center">VOL(L)</th>
                            <th class="p-2 border-r text-center">QTY(K)</th>
                            <th class="p-2 border-r text-center">QTY(L)</th>
                            <th class="p-2 border-r text-center">STATUS</th>
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
        tbody.innerHTML = emptyMsg;
        cardContainer.innerHTML = emptyMsg;
        return;
    }

    // RENDER DESKTOP ROWS
    tbody.innerHTML = data.map((item, index) => renderRow(item, index)).join('');

    // RENDER MOBILE CARDS
    cardContainer.innerHTML = data.map((item, index) => renderCard(item, index)).join('');
}

// Helper 1: Template Baris Tabel (Desktop)
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
                ${item.produk.length > limit ? `<button onclick="toggleReadMore(${index}, '${item.produk}', 'd')" class="text-blue-600 font-bold ml-1 text-[8px]">Read More</button>` : ''}
            </td>
            <td class="p-2 border-r text-[9px]">${item.supplier}</td>
            <td class="p-2 border-r font-mono">${item.lot}</td>
            <td class="p-2 border-r text-red-600 font-bold">${item.exp}</td>
            <td class="p-2 border-r text-orange-600 font-bold">${item.revExp || '-'}</td>
            <td class="p-2 border-r text-center">${item.volLiter}</td>
            <td class="p-2 border-r text-center">${item.qtyKaleng}</td>
            <td class="p-2 border-r text-center font-black">${item.qtyLiter}</td>
            <td class="p-2 text-center">
                <span class="px-1.5 py-0.5 rounded text-[8px] font-black ${item.status === 'IN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">${item.status}</span>
            </td>
        </tr>
    `;
}

// Helper 2: Template Kartu (Mobile)
function renderCard(item, index) {
    const limit = 50;
    const namaSingkat = item.produk.length > limit ? item.produk.substring(0, limit) + '...' : item.produk;
    return `
        <div class="p-4 space-y-3 relative bg-white">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">${item.tgl} • ${item.sj}</p>
                    <h4 class="text-xs font-black text-slate-900 mt-0.5">${item.partNo}</h4>
                </div>
                <span class="px-2 py-1 rounded text-[10px] font-black ${item.status === 'IN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">${item.status}</span>
            </div>
            
            <div class="text-[11px] text-slate-600 leading-snug">
                <span id="text-m-${index}">${namaSingkat}</span>
                ${item.produk.length > limit ? `<button onclick="toggleReadMore(${index}, '${item.produk}', 'm')" class="text-blue-600 font-bold text-[10px] ml-1">Read More</button>` : ''}
            </div>

            <div class="grid grid-cols-3 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100 text-center">
                <div><p class="text-[8px] text-slate-400 font-bold">EXP</p><p class="text-[10px] font-bold text-red-500">${item.exp}</p></div>
                <div><p class="text-[8px] text-slate-400 font-bold">QTY(K)</p><p class="text-[10px] font-bold text-slate-800">${item.qtyKaleng}</p></div>
                <div><p class="text-[8px] text-slate-400 font-bold">QTY(L)</p><p class="text-[10px] font-black text-blue-600">${item.qtyLiter}L</p></div>
            </div>
        </div>
    `;
}

// Fungsi Read More Adaptif
function toggleReadMore(index, fullText, type) {
    const el = document.getElementById(`text-${type}-${index}`);
    const btn = el.nextElementSibling;
    const limit = type === 'd' ? 30 : 50;
    
    if (btn.innerText === "Read More") {
        el.innerText = fullText;
        btn.innerText = "Hide";
    } else {
        el.innerText = fullText.substring(0, limit) + '...';
        btn.innerText = "Read More";
    }
}
