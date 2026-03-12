/**
 * MODULE: DATA INVENTORY
 * Menampilkan histori transaksi detail (IN/OUT)
 */

function renderInventoryTable(data) {
    const section = document.getElementById('inventory-section');
    
    // Template struktur tabel agar rapi di desktop & scrollable di mobile
    section.innerHTML = `
        <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h3 class="font-black text-slate-800 text-xl tracking-tight">Log Transaksi Material</h3>
            <div class="relative w-full md:w-64">
                <input type="text" id="searchInv" placeholder="Cari Part No / Produk..." 
                    class="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                <i data-lucide="search" class="w-4 h-4 absolute left-3 top-2.5 text-slate-400"></i>
            </div>
        </div>
        <div class="overflow-x-auto bg-white rounded-2xl border border-slate-100 shadow-sm">
            <table class="w-full text-left text-xs border-collapse">
                <thead class="bg-slate-900 text-slate-200 uppercase tracking-tighter">
                    <tr>
                        <th class="p-4 border-b border-slate-800">Tgl</th>
                        <th class="p-4 border-b border-slate-800">No. Surat Jalan</th>
                        <th class="p-4 border-b border-slate-800">Part Number</th>
                        <th class="p-4 border-b border-slate-800">Nama Produk</th>
                        <th class="p-4 border-b border-slate-800">No. Lot</th>
                        <th class="p-4 border-b border-slate-800 text-red-400">Expired</th>
                        <th class="p-4 border-b border-slate-800 text-center">Qty (L)</th>
                        <th class="p-4 border-b border-slate-800">Lokasi</th>
                        <th class="p-4 border-b border-slate-800">Status</th>
                    </tr>
                </thead>
                <tbody id="invTableBody" class="divide-y divide-slate-50">
                    </tbody>
            </table>
        </div>
    `;

    const tbody = document.getElementById('invTableBody');
    renderRows(data, tbody);

    // Re-inisialisasi icon search
    lucide.createIcons();

    // Logika Search
    document.getElementById('searchInv').addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase();
        const filtered = data.filter(item => 
            item.partNo.toLowerCase().includes(val) || 
            item.produk.toLowerCase().includes(val)
        );
        renderRows(filtered, tbody);
    });
}

function renderRows(data, container) {
    container.innerHTML = data.map(item => `
        <tr class="hover:bg-blue-50/30 transition-colors group">
            <td class="p-4 text-slate-500 font-medium">${item.tgl}</td>
            <td class="p-4 font-mono text-slate-400">${item.sj}</td>
            <td class="p-4 font-bold text-blue-600">${item.partNo}</td>
            <td class="p-4 font-semibold text-slate-700 max-w-[200px] truncate" title="${item.produk}">${item.produk}</td>
            <td class="p-4 text-slate-600">${item.lot}</td>
            <td class="p-4 font-bold text-red-500">${item.exp}</td>
            <td class="p-4 text-center font-black text-slate-800">${item.qtyLiter}</td>
            <td class="p-4">
                <span class="bg-slate-100 text-slate-500 px-2 py-1 rounded text-[10px] font-bold uppercase">${item.lokasi}</span>
            </td>
            <td class="p-4">
                <span class="px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${item.status === 'IN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                    ${item.status}
                </span>
            </td>
        </tr>
    `).join('');
}
