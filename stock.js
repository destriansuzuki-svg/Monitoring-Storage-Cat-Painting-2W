/**
 * stock.js - Modul Stock Material (Full Width, Custom Filters & Spreadsheet Integrated)
 * Target Sheet: Stock_Material
 */

// Menyimpan data secara global di memori browser agar pencarian & filter berjalan super cepat tanpa reload
window.rawStockData = []; 

function renderStockSummary(data) {
    const section = document.getElementById('stock-section');
    if (!section) return;

    // Paksa section menggunakan lebar penuh layout tanpa terhimpit
    section.className = "w-full block space-y-4 animate-in fade-in duration-200";

    // Simpan data ke variabel global jika ada data masuk dari database
    if (data && data.length > 0) {
        window.rawStockData = data;
    }

    // 1. STRUKTUR UTAMA: Control Bar (Search, Filter, Export, Tambah) & Container Tabel
    section.innerHTML = `
        <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col xl:flex-row gap-3 justify-between items-stretch xl:items-center">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 flex-grow max-w-5xl">
                <div class="relative">
                    <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"></i>
                    <input type="text" id="searchStock" onkeyup="filterStockRows()" placeholder="Cari Part No / Nama..." class="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-3 text-xs focus:ring-2 focus:ring-blue-500 outline-none font-medium">
                </div>
                <div>
                    <select id="filterTanggal" onchange="filterStockRows()" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-600">
                        <option value="">-- Pilih Tanggal --</option>
                        ${Array.from({length: 31}, (_, i) => `<option value="${String(i+1).padStart(2, '0')}">${i+1}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <select id="filterBulan" onchange="filterStockRows()" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-600">
                        <option value="">-- Pilih Bulan --</option>
                        <option value="01">Januari</option><option value="02">Februari</option>
                        <option value="03">Maret</option><option value="04">April</option>
                        <option value="05">Mei</option><option value="06">Juni</option>
                        <option value="07">Juli</option><option value="08">Agustus</option>
                        <option value="09">September</option><option value="10">Oktobe</option>
                        <option value="11">November</option><option value="12">Desember</option>
                    </select>
                </div>
                <div>
                    <select id="filterTahun" onchange="filterStockRows()" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-600">
                        <option value="">-- Pilih Tahun --</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                    </select>
                </div>
            </div>

            <div class="flex items-center gap-2 self-end xl:self-auto">
                <button onclick="exportStockToExcel()" class="bg-emerald-600 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-700 transition-all shadow-sm">
                    <i data-lucide="file-output" class="w-4 h-4"></i> Export Excel
                </button>
                <button onclick="openModalAddStock()" class="bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-blue-700 transition-all shadow-sm">
                    <i data-lucide="plus-circle" class="w-4 h-4"></i> Tambah Item
                </button>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="hidden lg:block overflow-x-auto">
                <table class="w-full text-left border-collapse" style="min-width: 1300px;">
                    <thead class="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200/80">
                        <tr>
                            <th class="p-3 text-center text-slate-700 font-bold" style="width: 50px;">NO</th>
                            <th class="p-3" style="width: 140px;">PART NUMBER</th>
                            <th class="p-3" style="width: 200px;">NAMA PRODUK</th>
                            <th class="p-3" style="width: 140px;">SUPPLIER</th>
                            <th class="p-3" style="width: 110px;">KATEGORI</th>
                            <th class="p-3 text-center" style="width: 100px;">LOKASI</th>
                            <th class="p-3 text-center" style="width: 100px;">SATUAN (L)</th>
                            <th class="p-3 text-center" style="width: 100px;">STOCK AWAL</th>
                            <th class="p-3 text-center text-emerald-600" style="width: 120px;">TOTAL MASUK (L)</th>
                            <th class="p-3 text-center text-red-500" style="width: 120px;">TOTAL KELUAR (L)</th>
                            <th class="p-3 text-center text-blue-600 font-black bg-slate-50/50" style="width: 120px;">STOCK AKHIR</th>
                            <th class="p-3" style="width: 100px;">PIC</th>
                            <th class="p-3 text-center" style="width: 90px;">AKSI</th>
                        </tr>
                    </thead>
                    <tbody id="stockTableBody" class="text-slate-600 divide-y divide-slate-100 bg-white text-[11px]">
                        </tbody>
                </table>
            </div>

            <div id="stockMobileCards" class="lg:hidden divide-y divide-slate-100 bg-slate-50"></div>
        </div>
    `;

    // Panggil fungsi pemrosesan baris data setelah struktur siap
    displayStockRows(window.rawStockData);
}

// 2. FUNGSI MERENDER ISI BARIS DATA SECARA DINAMIS
function displayStockRows(items) {
    const tbody = document.getElementById('stockTableBody');
    const cards = document.getElementById('stockMobileCards');
    if (!tbody || !cards) return;

    if (!items || items.length === 0) {
        const noData = `<tr><td colspan="13" class="p-10 text-center text-slate-400 italic">Data kosong atau tidak cocok dengan filter.</td></tr>`;
        tbody.innerHTML = noData;
        cards.innerHTML = `<div class="p-8 text-center text-slate-400 italic text-xs bg-white">Tidak ada data stok ditemukan.</div>`;
        return;
    }

    let tableHtml = '';
    let cardsHtml = '';

    items.forEach((item, index) => {
        // Ambil nilai numerik untuk kalkulasi otomatis
        const awal = parseFloat(item.stockAwal) || 0;
        const masuk = parseFloat(item.totalMasuk) || 0;
        const keluar = parseFloat(item.totalKeluar) || 0;
        const akhir = awal + masuk - keluar;

        // Render baris versi Desktop (Urutan Kolom Sesuai File Gambar Anda)
        tableHtml += `
            <tr class="hover:bg-slate-50/70 transition-all">
                <td class="p-3 text-center font-bold text-slate-400 bg-slate-50/30">${index + 1}</td>
                <td class="p-3 font-bold text-slate-900 font-mono">${item.partNumber || '-'}</td>
                <td class="p-3 font-medium text-slate-800">${item.namaProduk || '-'}</td>
                <td class="p-3 text-slate-500">${item.supplier || '-'}</td>
                <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700">${item.kategori || 'Material'}</span></td>
                <td class="p-3 text-center font-bold text-slate-500 uppercase">${item.lokasi || '-'}</td>
                <td class="p-3 text-center font-semibold">${item.satuan || '0'} L</td>
                <td class="p-3 text-center font-medium">${awal}</td>
                <td class="p-3 text-center text-emerald-600 font-semibold bg-emerald-50/20">+${masuk}</td>
                <td class="p-3 text-center text-red-500 font-semibold bg-red-50/20">-${keluar}</td>
                <td class="p-3 text-center font-black text-slate-900 bg-slate-100/60">${akhir}</td>
                <td class="p-3 text-slate-600 font-medium">${item.pic || '-'}</td>
                <td class="p-3 text-center">
                    <div class="flex items-center justify-center gap-1">
                        <button onclick="openModalEditStock(${index})" class="text-blue-500 hover:bg-blue-50 p-1.5 rounded-lg transition-all" title="Edit Data">
                            <i data-lucide="pencil" class="w-3.5 h-3.5"></i>
                        </button>
                        <button onclick="handleDeleteStock('${item.partNumber}')" class="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-all" title="Hapus Data">
                            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;

        // Render versi Mobile Card
        cardsHtml += `
            <div class="p-4 bg-white mb-2 border-b border-slate-200 shadow-sm space-y-2">
                <div class="flex justify-between items-start">
                    <div>
                        <span class="text-[9px] font-mono font-bold text-blue-600">${item.partNumber}</span>
                        <h4 class="text-xs font-bold text-slate-800 leading-tight">${item.namaProduk}</h4>
                    </div>
                    <span class="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 font-bold rounded uppercase">${item.lokasi}</span>
                </div>
                <div class="grid grid-cols-3 gap-1 text-[10px] bg-slate-50 p-2 rounded border border-slate-100">
                    <div><span class="block text-[8px] text-slate-400 font-bold">STOK AWAL</span> ${awal}</div>
                    <div><span class="block text-[8px] text-emerald-600 font-bold">MASUK</span> +${masuk}</div>
                    <div><span class="block text-[8px] text-red-500 font-bold">KELUAR</span> -${keluar}</div>
                </div>
                <div class="flex justify-between items-center text-[11px] pt-1 border-t border-slate-100">
                    <div><span class="text-slate-400 font-bold text-[9px]">AKHIR:</span> <span class="font-black text-slate-900">${akhir} L</span></div>
                    <div class="flex gap-2">
                        <button onclick="openModalEditStock(${index})" class="text-blue-600 font-bold text-xs">Edit</button>
                        <button onclick="handleDeleteStock('${item.partNumber}')" class="text-red-600 font-bold text-xs">Hapus</button>
                    </div>
                </div>
            </div>
        `;
    });

    tbody.innerHTML = tableHtml;
    cards.innerHTML = cardsHtml;
    if (window.lucide) lucide.createIcons();
}

// 3. LOGIKA ENGINE: Live Client-Side Filtering (Search, Tanggal, Bulan, Tahun)
function filterStockRows() {
    const query = document.getElementById('searchStock').value.toLowerCase();
    const tgl = document.getElementById('filterTanggal').value;
    const bln = document.getElementById('filterBulan').value;
    const thn = document.getElementById('filterTahun').value;

    const filtered = window.rawStockData.filter(item => {
        // Cek kecocokan teks pencarian
        const matchSearch = (item.partNumber || '').toLowerCase().includes(query) || 
                            (item.namaProduk || '').toLowerCase().includes(query);

        // Parsing tanggal entry/transaksi dari database (asumsi format 'YYYY-MM-DD' atau 'DD/MM/YYYY')
        let matchDate = true;
        if (item.entryDate) {
            const cleanDate = item.entryDate.replace(/\//g, '-'); // Normalisasi separator
            const parts = cleanDate.split('-'); 
            
            let d = '', m = '', y = '';
            if (parts[0].length === 4) { [y, m, d] = parts; } // YYYY-MM-DD
            else { [d, m, y] = parts; } // DD-MM-YYYY

            if (tgl && d !== tgl) matchDate = false;
            if (bln && m !== bln) matchDate = false;
            if (thn && y !== thn) matchDate = false;
        } else if (tgl || bln || thn) {
            matchDate = false; // Jika filter aktif tapi data tidak punya tanggal
        }

        return matchSearch && matchDate;
    });

    displayStockRows(filtered);
}

// 4. AKSES GOOGLE APPS SCRIPT: Tambah Item Baru ke Sheet 'Stock_Material'
function openModalAddStock() {
    Swal.fire({
        title: 'Tambah Material Gudang',
        text: 'Data akan tersimpan langsung ke sheet Stock_Material',
        html: `
            <div class="text-left space-y-2.5 text-xs">
                <label class="font-bold text-slate-500 block">PART ID & SPESIFIKASI</label>
                <input id="st-part" class="w-full border p-2 rounded uppercase font-bold" placeholder="Part Number (Contoh: P001-388)">
                <input id="st-nama" class="w-full border p-2 rounded" placeholder="Nama Produk Material">
                <input id="st-supp" class="w-full border p-2 rounded" placeholder="Nama Supplier">
                
                <div class="grid grid-cols-2 gap-2">
                    <input id="st-kat" class="w-full border p-2 rounded" placeholder="Kategori (Cat / Chemical)">
                    <input id="st-lokasi" class="w-full border p-2 rounded uppercase font-bold" placeholder="Lokasi Rak / Area">
                </div>

                <label class="font-bold text-slate-500 block pt-1">SALDO MATRIKS KUALITAS</label>
                <div class="grid grid-cols-2 gap-2">
                    <input id="st-satuan" type="number" class="w-full border p-2 rounded" placeholder="Kapasitas Satuan (L)">
                    <input id="st-awal" type="number" class="w-full border p-2 rounded" placeholder="Saldo Stock Awal">
                </div>
                <input id="st-pic" class="w-full border p-2 rounded uppercase" placeholder="PIC Penanggung Jawab">
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Kirim ke Spreadsheet',
        cancelButtonText: 'Batal',
        preConfirm: () => {
            return {
                sheetName: 'Stock_Material',
                action: 'add_stock',
                partNumber: document.getElementById('st-part').value.trim(),
                namaProduk: document.getElementById('st-nama').value.trim(),
                supplier: document.getElementById('st-supp').value.trim(),
                kategori: document.getElementById('st-kat').value.trim(),
                lokasi: document.getElementById('st-lokasi').value.trim(),
                satuan: document.getElementById('st-satuan').value,
                stockAwal: document.getElementById('st-awal').value || 0,
                pic: document.getElementById('st-pic').value.trim(),
                entryDate: new Date().toISOString().split('T')[0] // Format YYYY-MM-DD standard database
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            if (!result.value.partNumber || !result.value.namaProduk) {
                Swal.fire('Gagal', 'Part Number dan Nama Produk wajib diisi!', 'error');
                return;
            }
            Swal.showLoading();
            google.script.run
                .withSuccessHandler(() => {
                    Swal.fire('Sinkronisasi Sukses', 'Item material berhasil ditambahkan ke Spreadsheet.', 'success');
                    // Ambil ulang data terbaru untuk refresh screen
                    google.script.run.withSuccessHandler(renderStockSummary).getStockData();
                })
                .processAction(result.value); 
        }
    });
}

// 5. AKSES GOOGLE APPS SCRIPT: Edit Data Item Lama
function openModalEditStock(index) {
    const item = window.rawStockData[index];
    if (!item) return;

    Swal.fire({
        title: 'Edit Item Material',
        html: `
            <div class="text-left space-y-2.5 text-xs">
                <label class="font-bold text-slate-400 block">PART NUMBER (LOCK)</label>
                <input id="st-edit-part" class="w-full bg-slate-100 border p-2 rounded font-bold text-slate-500" value="${item.partNumber}" readonly>
                
                <label class="font-bold text-slate-500 block">DETAIL INFORMASI</label>
                <input id="st-edit-nama" class="w-full border p-2 rounded" value="${item.namaProduk || ''}" placeholder="Nama Produk">
                <input id="st-edit-supp" class="w-full border p-2 rounded" value="${item.supplier || ''}" placeholder="Supplier">
                
                <div class="grid grid-cols-2 gap-2">
                    <input id="st-edit-kat" class="w-full border p-2 rounded" value="${item.kategori || ''}" placeholder="Kategori">
                    <input id="st-edit-lokasi" class="w-full border p-2 rounded uppercase font-bold" value="${item.lokasi || ''}" placeholder="Lokasi">
                </div>
                
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="text-[10px] text-slate-400 font-bold block">SATUAN (L)</label>
                        <input id="st-edit-satuan" type="number" class="w-full border p-2 rounded" value="${item.satuan || ''}">
                    </div>
                    <div>
                        <label class="text-[10px] text-slate-400 font-bold block">STOCK AWAL</label>
                        <input id="st-edit-awal" type="number" class="w-full border p-2 rounded" value="${item.stockAwal || 0}">
                    </div>
                </div>
                <input id="st-edit-pic" class="w-full border p-2 rounded uppercase" value="${item.pic || ''}" placeholder="PIC">
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Update Spreadsheet',
        preConfirm: () => {
            return {
                sheetName: 'Stock_Material',
                action: 'edit_stock',
                partNumber: document.getElementById('st-edit-part').value,
                namaProduk: document.getElementById('st-edit-nama').value.trim(),
                supplier: document.getElementById('st-edit-supp').value.trim(),
                kategori: document.getElementById('st-edit-kat').value.trim(),
                lokasi: document.getElementById('st-edit-lokasi').value.trim(),
                satuan: document.getElementById('st-edit-satuan').value,
                stockAwal: document.getElementById('st-edit-awal').value,
                pic: document.getElementById('st-edit-pic').value.trim()
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.showLoading();
            google.script.run
                .withSuccessHandler(() => {
                    Swal.fire('Updated', 'Perubahan material berhasil di-push ke cloud.', 'success');
                    google.script.run.withSuccessHandler(renderStockSummary).getStockData();
                })
                .processAction(result.value);
        }
    });
}

// 6. AKSES GOOGLE APPS SCRIPT: Hapus Item dari Baris Cloud
function handleDeleteStock(partNumber) {
    Swal.fire({
        title: 'Hapus Material?',
        text: `Part Number [${partNumber}] akan dihapus permanen dari sistem spreadsheet Stock_Material!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Ya, Hapus Data',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.showLoading();
            google.script.run
                .withSuccessHandler(() => {
                    Swal.fire('Terhapus', 'Baris material dikeluarkan dari database.', 'success');
                    google.script.run.withSuccessHandler(renderStockSummary).getStockData();
                })
                .processAction({
                    sheetName: 'Stock_Material',
                    action: 'delete_stock',
                    partNumber: partNumber
                });
        }
    });
}

// 7. UTILITY: Engine Export To format Excel Standard Tanpa Library Pihak Ketiga
function exportStockToExcel() {
    if(window.rawStockData.length === 0) {
        Swal.fire('Perhatian', 'Tidak ada baris data material untuk di-export.', 'info');
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    // Header Kolom Sesuai Standard Urutan
    csvContent += "NO,PART NUMBER,NAMA PRODUK,SUPPLIER,KATEGORI,LOKASI,SATUAN (L),STOCK AWAL,TOTAL MASUK,TOTAL KELUAR,STOCK AKHIR,PIC\n";

    window.rawStockData.forEach((item, index) => {
        const awal = parseFloat(item.stockAwal) || 0;
        const masuk = parseFloat(item.totalMasuk) || 0;
        const keluar = parseFloat(item.totalKeluar) || 0;
        const akhir = awal + masuk - keluar;

        const row = [
            index + 1,
            `"${item.partNumber || ''}"`,
            `"${item.namaProduk || ''}"`,
            `"${item.supplier || ''}"`,
            `"${item.kategori || ''}"`,
            `"${item.lokasi || ''}"`,
            item.satuan || 0,
            awal,
            masuk,
            keluar,
            akhir,
            `"${item.pic || ''}"`
        ].join(",");
        csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Stock_Material_Report_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
