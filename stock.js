/**
 * MODULE: STOCK BARANG (RESPONSIVE & AUTOMATIC CALCULATION)
 */

function renderStockSummary(data) {
    const section = document.getElementById('stock-section');
    
    // 1. Struktur Container dengan Dual View (Desktop & Mobile)
    section.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="hidden md:block overflow-x-auto">
                <table class="w-full text-left border-collapse" style="font-size: 10px;">
                    <thead class="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                        <tr>
                            <th class="p-2 border-r">NO</th>
                            <th class="p-2 border-r">PART NUMBER</th>
                            <th class="p-2 border-r" style="min-w: 150px;">NAMA PRODUK</th>
                            <th class="p-2 border-r text-center">SATUAN</th>
                            <th class="p-2 border-r text-center">AWAL (L)</th>
                            <th class="p-2 border-r text-center">MASUK (L)</th>
                            <th class="p-2 border-r text-center">KELUAR (L)</th>
                            <th class="p-2 border-r text-center">AKHIR (L)</th>
                            <th class="p-2 text-center">STOK (KLG)</th>
                        </tr>
                    </thead>
                    <tbody id="stockBody" class="text-slate-600 divide-y divide-slate-100"></tbody>
                </table>
            </div>

            <div id="stockCards" class="md:hidden divide-y divide-slate-100 bg-slate-50"></div>
        </div>
    `;

    const tbody = document.getElementById('stockBody');
    const cardContainer = document.getElementById('stockCards');
    const summary = {};

    // 2. Logika Perhitungan (Sama seperti sebelumnya)
    data.forEach(item => {
        const pn = item.partNo;
        if (!summary[pn]) {
            summary[pn] = {
                partNo: pn,
                nama: item.produk,
                supplier: item.supplier,
                satuan: item.volLiter || 20,
                stockAwal: item.stockAwal || 0,
                totalMasuk: 0,
                totalKeluar: 0
            };
        }
        const qty = parseFloat(item.qtyLiter) || 0;
        if (item.status === 'IN') summary[pn].totalMasuk += qty;
        else if (item.status === 'OUT') summary[pn].totalKeluar += qty;
    });

    const stockEntries = Object.values(summary);
    
    if (stockEntries.length === 0) {
        const emptyMsg = `<p class="p-10 text-center text-slate-400 italic text-xs">Data stok tidak tersedia.</p>`;
        tbody.innerHTML = emptyMsg;
        cardContainer.innerHTML = emptyMsg;
        return;
    }

    // 3. Render Desktop Rows
    tbody.innerHTML = stockEntries.map((item, index) => {
        const stockAkhir = item.stockAwal + item.totalMasuk - item.totalKeluar;
        const stockKaleng = Math.floor(stockAkhir / item.satuan);
        return `
            <tr class="hover:bg-slate-50 transition-colors font-medium">
                <td class="p-2 border-r text-center text-slate-400">${index + 1}</td>
                <td class="p-2 border-r font-bold text-slate-800">${item.partNo}</td>
                <td class="p-2 border-r text-[9px]">${item.nama}</td>
                <td class="p-2 border-r text-center">${item.satuan}L</td>
                <td class="p-2 border-r text-center">${item.stockAwal}</td>
                <td class="p-2 border-r text-center text-green-600">+${item.totalMasuk}</td>
                <td class="p-2 border-r text-center text-red-500">-${item.totalKeluar}</td>
                <td class="p-2 border-r text-center font-black text-slate-900 bg-slate-50/50">${stockAkhir}</td>
                <td class="p-2 text-center font-black bg-yellow-50 text-yellow-700">${stockKaleng}</td>
            </tr>
        `;
    }).join('');

    // 4. Render Mobile Cards
    cardContainer.innerHTML = stockEntries.map((item) => {
        const stockAkhir = item.stockAwal + item.totalMasuk - item.totalKeluar;
        const stockKaleng = Math.floor(stockAkhir / item.satuan);
        return `
            <div class="p-4 bg-white mb-2 shadow-sm">
                <div class="flex justify-between items-start mb-2">
                    <div class="max-w-[70%]">
                        <p class="text-[9px] font-bold text-blue-600 tracking-tight">${item.partNo}</p>
                        <h4 class="text-[11px] font-bold text-slate-800 leading-tight">${item.nama}</h4>
                    </div>
                    <div class="text-right">
                        <p class="text-[8px] text-slate-400 font-bold uppercase">Stok Akhir</p>
                        <p class="text-lg font-black text-slate-900 leading-none">${stockAkhir}<span class="text-[10px] ml-0.5">L</span></p>
                    </div>
                </div>
                
                <div class="grid grid-cols-4 gap-1 pt-3 border-t border-slate-50">
                    <div class="text-center">
                        <p class="text-[7px] text-slate-400 font-bold">AWAL</p>
                        <p class="text-[10px] font-bold">${item.stockAwal}</p>
                    </div>
                    <div class="text-center">
                        <p class="text-[7px] text-slate-400 font-bold text-green-600">MASUK</p>
                        <p class="text-[10px] font-bold text-green-600">+${item.totalMasuk}</p>
                    </div>
                    <div class="text-center">
                        <p class="text-[7px] text-slate-400 font-bold text-red-500">KELUAR</p>
                        <p class="text-[10px] font-bold text-red-500">-${item.totalKeluar}</p>
                    </div>
                    <div class="text-center bg-yellow-50 rounded">
                        <p class="text-[7px] text-yellow-600 font-bold">KALENG</p>
                        <p class="text-[10px] font-black text-yellow-700">${stockKaleng}</p>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}
