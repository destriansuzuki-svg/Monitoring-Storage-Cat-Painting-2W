/**
 * master.js - Database Cat & Chemical (Full Width & No Overlap)
 */

function renderManageMaster(data) {
    const container = document.getElementById('masterContainer');
    if (!container) return;

    // Paksa container dan tabel menggunakan lebar penuh (w-full)
    container.innerHTML = `
        <div class="w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
            <div class="hidden md:block">
                <table class="w-full border-collapse" style="min-width: 1000px;">
                    <thead class="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                        <tr>
                            <th class="p-3 text-center" style="width: 50px;">NO</th>
                            <th class="p-3 text-left" style="width: 120px;">ENTRY DATE</th>
                            <th class="p-3 text-left" style="width: 150px;">PART NUMBER</th>
                            <th class="p-3 text-left">NAMA PRODUK</th>
                            <th class="p-3 text-left" style="width: 150px;">SUPPLIER</th>
                            <th class="p-3 text-center" style="width: 100px;">SATUAN</th>
                            <th class="p-3 text-center" style="width: 120px;">LOKASI</th>
                            <th class="p-3 text-center" style="width: 80px;">AKSI</th>
                        </tr>
                    </thead>
                    <tbody id="masterTableBody" class="text-slate-600 divide-y divide-slate-100 bg-white text-[11px]">
                        </tbody>
                </table>
            </div>

            <div id="masterCards" class="md:hidden divide-y divide-slate-100"></div>
        </div>
    `;

    renderMasterRows(data);
}

function renderMasterRows(data) {
    const tbody = document.getElementById('masterTableBody');
    const cardContainer = document.getElementById('masterCards');
    
    if (!data || data.length === 0) {
        const empty = `<div class="p-10 text-center text-slate-400 italic">Data Master Kosong.</div>`;
        if(tbody) tbody.innerHTML = `<tr><td colspan="8">${empty}</td></tr>`;
        if(cardContainer) cardContainer.innerHTML = empty;
        return;
    }

    // Render Tabel Desktop
    tbody.innerHTML = data.map((item, index) => `
        <tr class="hover:bg-blue-50/50 transition-colors">
            <td class="p-3 text-center font-bold border-r">${index + 1}</td>
            <td class="p-3 border-r">${item.entryDate || '-'}</td>
            <td class="p-3 font-bold text-blue-600 font-mono border-r">${item.partNumber || '-'}</td>
            <td class="p-3 border-r font-medium">${item.namaProduk || '-'}</td>
            <td class="p-3 border-r">${item.supplier || '-'}</td>
            <td class="p-3 text-center border-r">${item.satuan || '0'} L</td>
            <td class="p-3 text-center font-bold text-slate-500 border-r uppercase">${item.lokasi || '-'}</td>
            <td class="p-3 text-center">
                <button onclick="handleDeleteMaster('${item.partNumber}')" class="text-red-500 hover:bg-red-50 p-1.5 rounded-lg">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </td>
        </tr>
    `).join('');

    // Render Card Mobile
    cardContainer.innerHTML = data.map((item, index) => `
        <div class="p-4 bg-white relative">
            <div class="flex justify-between items-start mb-2">
                <span class="text-blue-600 font-bold text-xs font-mono">${item.partNumber}</span>
                <span class="text-[9px] font-black text-slate-300">#${index + 1}</span>
            </div>
            <p class="font-bold text-slate-800 text-xs mb-3">${item.namaProduk}</p>
            <div class="grid grid-cols-2 gap-2 text-[10px] border-t pt-2">
                <div><span class="text-slate-400 font-bold uppercase block text-[8px]">Lokasi</span> ${item.lokasi || '-'}</div>
                <div class="text-right"><span class="text-slate-400 font-bold uppercase block text-[8px]">Satuan</span> ${item.satuan} L</div>
            </div>
        </div>
    `).join('');

    if(window.lucide) lucide.createIcons();
}
// 4. KONEKSI KE SPREADSHEET (APPS SCRIPT)
function openModalAdd() {
    Swal.fire({
        title: 'Tambah Material',
        html: `
            <div class="text-left space-y-3 text-xs">
                <input id="sw-part" class="w-full border p-2 rounded uppercase" placeholder="Part Number">
                <input id="sw-nama" class="w-full border p-2 rounded" placeholder="Nama Produk">
                <input id="sw-supp" class="w-full border p-2 rounded" placeholder="Supplier">
                <div class="grid grid-cols-2 gap-2">
                    <input id="sw-satuan" type="number" class="w-full border p-2 rounded" placeholder="Satuan (L)">
                    <input id="sw-lokasi" class="w-full border p-2 rounded uppercase" placeholder="Lokasi">
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Simpan ke Spreadsheet',
        preConfirm: () => {
            return {
                action: 'add_master',
                partNumber: document.getElementById('sw-part').value,
                namaProduk: document.getElementById('sw-nama').value,
                supplier: document.getElementById('sw-supp').value,
                satuan: document.getElementById('sw-satuan').value,
                lokasi: document.getElementById('sw-lokasi').value,
                entryDate: new Date().toLocaleDateString('id-ID')
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.showLoading();
            // Memanggil fungsi di Kode.gs
            google.script.run
                .withSuccessHandler(() => {
                    Swal.fire('Berhasil', 'Data tersimpan ke Spreadsheet', 'success');
                    // Refresh data
                    google.script.run.withSuccessHandler(renderManageMaster).getMasterData();
                })
                .processAction(result.value); 
        }
    });
}
