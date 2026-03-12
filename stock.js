/**
 * MODULE: STOCK BARANG
 * Menampilkan saldo akhir tiap material
 */

function renderStockSummary(data) {
    const container = document.getElementById('stock-section');
    const summary = {};

    // Proses perhitungan saldo per Part Number
    data.forEach(item => {
        if (!summary[item.partNo]) {
            summary[item.partNo] = {
                partNo: item.partNo,
                nama: item.produk,
                totalIn: 0,
                totalOut: 0,
                lotTerakhir: item.lot,
                expTerakhir: item.exp
            };
        }
        if (item.status === 'IN') summary[item.partNo].totalIn += item.qtyLiter;
        else summary[item.partNo].totalOut += item.qtyLiter;
    });

    // Generate Card Tampilan
    let html = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">`;
    
    Object.values(summary).forEach(item => {
        const sisa = item.totalIn - item.totalOut;
        const isLow = sisa < 50;

        html += `
            <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                    <div class="flex justify-between items-start mb-4">
                        <span class="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-1 rounded-lg uppercase tracking-widest">${item.partNo}</span>
                        ${isLow ? `<span class="animate-pulse bg-red-100 text-red-600 text-[9px] font-black px-2 py-1 rounded-lg italic">RE-ORDER</span>` : ''}
                    </div>
                    <h4 class="font-black text-slate-800 text-sm leading-tight mb-4">${item.nama}</h4>
                    
                    <div class="space-y-2 mb-6">
                        <div class="flex justify-between text-[11px]">
                            <span class="text-slate-400 font-medium">Total Masuk:</span>
                            <span class="text-green-600 font-bold">+ ${item.totalIn} L</span>
                        </div>
                        <div class="flex justify-between text-[11px]">
                            <span class="text-slate-400 font-medium">Total Keluar:</span>
                            <span class="text-red-500 font-bold">- ${item.totalOut} L</span>
                        </div>
                    </div>
                </div>

                <div class="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div>
                        <p class="text-[9px] text-slate-400 uppercase font-black">Sisa Saldo</p>
                        <p class="text-2xl font-black ${isLow ? 'text-red-600' : 'text-slate-900'}">${sisa} <span class="text-xs">Liter</span></p>
                    </div>
                    <div class="text-right">
                        <p class="text-[9px] text-slate-300 font-bold">Exp Terdekat:</p>
                        <p class="text-[10px] font-bold text-slate-500">${item.expTerakhir}</p>
                    </div>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    container.innerHTML = html;
}
