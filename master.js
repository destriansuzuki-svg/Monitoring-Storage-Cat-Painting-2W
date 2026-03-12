/**
 * master.js - Mengelola Database sesuai format tabel user
 * Kolom: Entry Date, Part Number, Nama Produk, Supplier, Satuan
 */

// 1. Fungsi Render List untuk Menu "Kelola Database"
function renderManageMaster(data) {
    const container = document.getElementById('masterContainer');
    if (!container) return;

    if (!data || data.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                <i data-lucide="database-zap" class="w-10 h-10 text-slate-300 mx-auto mb-3"></i>
                <p class="text-slate-400 text-xs font-medium">Data Cat & Chemical belum tersedia.</p>
            </div>`;
        return;
    }

    let html = '';
    data.forEach((item) => {
        html += `
            <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                <div class="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>

                <div class="flex justify-between items-start mb-3">
                    <div>
                        <p class="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Part Number</p>
                        <p class="text-[11px] font-bold text-blue-600">${item.partNumber}</p>
                    </div>
                    <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onclick="handleEdit('${item.partNumber}')" class="p-1.5 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100">
                            <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                        </button>
                        <button onclick="handleDelete('${item.partNumber}')" class="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                        </button>
                    </div>
                </div>

                <h4 class="text-xs font-bold text-slate-800 mb-4 h-9 overflow-hidden leading-snug">
                    ${item.namaProduk}
                </h4>
                
                <div class="grid grid-cols-2 gap-3 pt-3 border-t border-slate-50">
                    <div>
                        <p class="text-[8px] text-slate-400 uppercase font-bold tracking-widest">Supplier</p>
                        <p class="text-[10px] font-bold text-slate-700 truncate">${item.supplier || '-'}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-[8px] text-slate-400 uppercase font-bold tracking-widest">Satuan</p>
                        <p class="text-[10px] font-bold text-slate-700">${item.satuan} LITER</p>
                    </div>
                </div>

                <div class="mt-3 text-[8px] text-slate-300 font-medium">
                    Added: ${item.entryDate || '-'}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    lucide.createIcons();
}

// 2. Fungsi Pop-up Tambah Data (Sesuai Kolom Gambar)
function openModalAdd() {
    const today = new Date().toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' });
    
    Swal.fire({
        title: '<div class="text-left font-black text-slate-800 text-lg uppercase tracking-tight">Tambah Material</div>',
        html: `
            <div class="text-left space-y-4 p-2">
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Entry Date</label>
                        <input id="swal-date" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-bold text-slate-500" value="${today}" readonly>
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Part Number</label>
                        <input id="swal-part" class="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none font-bold" placeholder="P001-XXXX">
                    </div>
                </div>
                <div>
                    <label class="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Nama Produk</label>
                    <input id="swal-nama" class="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Masukkan nama lengkap produk">
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Supplier</label>
                        <input id="swal-supplier" class="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Vendor/PT">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Satuan (Liter)</label>
                        <input id="swal-satuan" type="number" class="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none font-bold" value="20">
                    </div>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Simpan ke Spreadsheet',
        confirmButtonColor: '#2563eb',
        cancelButtonText: 'Batal',
        reverseButtons: true,
        preConfirm: () => {
            const data = {
                entryDate: document.getElementById('swal-date').value,
                partNumber: document.getElementById('swal-part').value,
                namaProduk: document.getElementById('swal-nama').value,
                supplier: document.getElementById('swal-supplier').value,
                satuan: document.getElementById('swal-satuan').value
            };
            if (!data.partNumber || !data.namaProduk) {
                Swal.showValidationMessage('Part Number & Nama Produk wajib diisi!');
            }
            return data;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            saveToSpreadsheet({ action: 'add', ...result.value });
        }
    });
}
