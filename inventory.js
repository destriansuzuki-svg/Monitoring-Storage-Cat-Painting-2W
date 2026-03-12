/**
 * MODULE: INVENTORY (REVISI SIMPEL & PERSIS KOLOM GAMBAR)
 */

function renderInventoryTable(data) {
    const section = document.getElementById('inventory-section');
    
    section.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="overflow-x-auto">
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
                            <th class="p-2 border-r">EXPIRED</th>
                            <th class="p-2 border-r">REV. EXPIRED</th>
                            <th class="p-2 border-r text-center">VOLUME (LITER)</th>
                            <th class="p-2 border-r text-center">QTY (KALENG)</th>
                            <th class="p-2 border-r text-center">QTY (LITER)</th>
                            <th class="p-2 border-r text-center">LOKASI</th>
                            <th class="p-2 border-r text-center">STATUS</th>
                            <th class="p-2">KETERANGAN</th>
                        </tr>
                    </thead>
                    <tbody id="inventoryBody" class="text-slate-600 divide-y divide-slate-100"></tbody>
                </table>
            </div>
        </div>
    `;

    const tbody = document.getElementById('inventoryBody');
    
    tbody.innerHTML = data.map((item, index) => {
        // Logika Read More untuk Nama Produk
        const limit = 30;
        const namaSingkat = item.produk.length > limit ? item.produk.substring(0, limit) + '...' : item.produk;
        const showReadMore = item.produk.length > limit;

        return `
            <tr class="hover:bg-slate-50 transition-colors">
                <td class="p-2 border-r text-center">${index + 1}</td>
                <td class="p-2 border-r whitespace-nowrap">${item.tgl}</td>
                <td class="p-2 border-r font-mono text-[9px]">${item.sj}</td>
                <td class="p-2 border-r font-bold text-slate-800">${item.partNo}</td>
                <td class="p-2 border-r">
                    <span id="text-${index}">${namaSingkat}</span>
                    ${showReadMore ? `<button onclick="toggleReadMore(${index}, '${item.produk}')" class="text-blue-600 font-bold ml-1 hover:underline text-[9px]">Read More</button>` : ''}
                </td>
                <td class="p-2 border-r text-[9px]">${item.supplier}</td>
                <td class="p-2 border-r font-mono">${item.lot}</td>
                <td class="p-2 border-r text-red-600 font-semibold">${item.exp}</td>
                <td class="p-2 border-r text-orange-600 font-semibold">${item.revExp || '-'}</td>
                <td class="p-2 border-r text-center font-bold">${item.volLiter || item.qtyLiter}</td>
                <td class="p-2 border-r text-center">${item.qtyKaleng || 1}</td>
                <td class="p-2 border-r text-center font-black text-slate-900">${item.qtyLiter}</td>
                <td class="p-2 border-r text-[9px] font-bold text-slate-500 uppercase text-center">${item.lokasi}</td>
                <td class="p-2 border-r text-center">
                    <span class="px-1.5 py-0.5 rounded text-[8px] font-black ${item.status === 'IN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                        ${item.status}
                    </span>
                </td>
                <td class="p-2 italic text-slate-400 text-[9px]">${item.ket}</td>
            </tr>
        `;
    }).join('');
}

// Fungsi pembantu Read More
function toggleReadMore(index, fullText) {
    const el = document.getElementById(`text-${index}`);
    const btn = el.nextElementSibling;
    
    if (btn.innerText === "Read More") {
        el.innerText = fullText;
        btn.innerText = "Hide";
    } else {
        el.innerText = fullText.substring(0, 30) + '...';
        btn.innerText = "Read More";
    }
}
