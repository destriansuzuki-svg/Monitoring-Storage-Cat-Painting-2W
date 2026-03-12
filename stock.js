/**
 * MODULE: STOCK BARANG (Rangkuman Saldo Akhir)
 * Menampilkan ringkasan stok sesuai format gambar user
 */

function renderStockSummary(data) {
    const section = document.getElementById('stock-section');
    
    // 1. Persiapkan Container Tabel (Font Kecil & Rapih)
    section.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse" style="font-size: 10px;">
                    <thead class="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                        <tr>
                            <th class="p-2 border-r">NO</th>
                            <th class="p-2 border-r">PART NUMBER</th>
                            <th class="p-2 border-r" style="min-w: 150px;">NAMA PRODUK</th>
                            <th class="p-2 border-r">SUPPLIER</th>
                            <th class="p-2 border-r text-center">SATUAN (Liter)</th>
                            <th class="p-2 border-r text-center">STOCK AWAL (L)</th>
                            <th class="p-2 border-r text-center">TOTAL MASUK (L)</th>
                            <th class="p-2 border-r text-center">TOTAL KELUAR (L)</th>
                            <th class="p-2 border-r text-center">STOCK AKHIR (L)</th>
                            <th class="p-2 text-center">STOCK (KALENG)</th>
                        </tr>
                    </thead>
                    <tbody id="stockBody" class="text-slate-600 divide-y divide-slate-100"></tbody>
                </table>
            </div>
        </div>
    `;

    const tbody = document.getElementById('stockBody');
    const summary = {};

    // 2. Logika Perhitungan Stok per Part Number
    data.forEach(item => {
        const pn = item.partNo;
        if (!summary[pn]) {
            summary[pn] = {
                partNo: pn,
                nama: item.produk,
                supplier: item.supplier,
                satuan: item.volLiter || 20, // Default 20 jika tidak ada
                stockAwal: item.stockAwal || 0, // Nilai stock awal (asumsi dari master data)
                totalMasuk: 0,
                totalKeluar: 0
            };
        }

        const qty = parseFloat(item.qtyLiter) || 0;
        if (item.status === 'IN') {
            summary[pn].totalMasuk += qty;
        } else if (item.status === 'OUT') {
            summary[pn].totalKeluar += qty;
        }
    });

    // 3. Render Data ke Tabel
    const stockEntries = Object.values(summary);
    
    if (stockEntries.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" class="p-10 text-center text-slate-400 italic">Data stok belum tersedia.</td></tr>`;
        return;
    }

    tbody.innerHTML = stockEntries.map((item, index) => {
        // Hitung Saldo Akhir
        const stockAkhir = item.stockAwal + item.totalMasuk - item.totalKeluar;
        const stockKaleng = stockAkhir / item.satuan;
        
        // Fitur "Read More" sederhana untuk Nama Produk jika terlalu panjang
        const limit = 30;
        const namaDisplay = item.nama.length > limit ? item.nama.substring(0, limit) + '...' : item.nama;

        return `
            <tr class="hover:bg-slate-50 transition-colors font-medium">
                <td class="p-2 border-r text-center text-slate-400">${index + 1}</td>
                <td class="p-2 border-r font-bold text-slate-800">${item.partNo}</td>
                <td class="p-2 border-r" title="${item.nama}">${namaDisplay}</td>
                <td class="p-2 border-r text-[9px] uppercase">${item.supplier}</td>
                <td class="p-2 border-r text-center">${item.satuan}</td>
                <td class="p-2 border-r text-center text-blue-600">${item.stockAwal}</td>
                <td class="p-2 border-r text-center text-green-600 font-bold">+ ${item.totalMasuk}</td>
                <td class="p-2 border-r text-center text-red-500 font-bold">- ${item.totalKeluar}</td>
                <td class="p-2 border-r text-center font-black text-slate-900 bg-slate-50/50">${stockAkhir}</td>
                <td class="p-2 text-center font-black bg-yellow-50 text-yellow-700">${Math.floor(stockKaleng)}</td>
            </tr>
        `;
    }).join('');
}
