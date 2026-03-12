/**
 * DASHBOARD MAIN CONTROLLER
 * Menangani logika utama, sinkronisasi data, dan autentikasi
 */

// 1. DATABASE TRANSISI (Nantinya ditarik dari Google Sheets)
// Data ini disusun berdasarkan kolom pada gambar yang Anda kirim
const inventoryData = [
    {
        no: 1,
        tgl: "4 Feb 2026",
        sj: "26020510",
        partNo: "P001-388-2",
        produk: "Retan PG 60 U/C Macho Bright Blue (electrostatic)",
        supplier: "PT Kansai Paint Indonesia",
        lot: "5107065",
        exp: "4 May 2026",
        revExp: "4 Jun 2026",
        volLiter: 20,
        qtyKaleng: 1,
        qtyLiter: 20,
        lokasi: "Storage Metal",
        status: "IN",
        ket: "CAT"
    }
];

// 2. FUNGSI INISIALISASI (Dijalankan saat halaman load)
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    refreshAllModules();
});

// 3. REFRESH SEMUA MODUL
// Memastikan semua section mendapatkan data terbaru
function refreshAllModules() {
    const data = inventoryData;
    
    // Panggil fungsi dari file terpisah (dashboard-logic.js, inventory.js, stock.js)
    if (typeof updateDashboardStats === 'function') updateDashboardStats(data);
    if (typeof renderRecentActivity === 'function') renderRecentActivity(data);
    
    // Note: renderInventoryTable & renderStockSummary dipanggil 
    // saat menu di klik (showSection) untuk menghemat memori.
}

// 4. LOGIKA NAVIGASI & ROUTING (Update dari versi sebelumnya)
function showSection(id) {
    // Sembunyikan semua section
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    
    // Tampilkan target
    const target = document.getElementById(id + '-section');
    if(target) target.classList.remove('hidden');

    // Update UI Sidebar Aktif
    updateSidebarUI(id);
    
    // Update Header
    const titles = {
        'dashboard': 'Ringkasan Gudang',
        'inventory': 'Histori Transaksi',
        'stock': 'Saldo Stok Material',
        'update': 'Form In / Out'
    };
    document.getElementById('sectionTitle').innerText = titles[id] || 'Inventory System';
    document.getElementById('breadcrumb').innerText = id.toUpperCase();

    // TRIGGER MODUL SPESIFIK SAAT DIBUKA
    if (id === 'inventory') renderInventoryTable(inventoryData);
    if (id === 'stock') renderStockSummary(inventoryData);

    // Tutup sidebar di mobile
    if (window.innerWidth < 768) {
        document.getElementById('sidebar').classList.add('-translate-x-full');
    }
}

// 5. HELPER: UPDATE UI SIDEBAR
function updateSidebarUI(activeId) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active-link', 'bg-blue-600', 'text-white');
        btn.classList.add('text-slate-400');
    });
    // Menambahkan class aktif ke tombol yang diklik (diatur di HTML onclick)
    if(event && event.currentTarget) {
        event.currentTarget.classList.add('active-link');
    }
}

// 6. SISTEM AUTENTIKASI SEDERHANA
function checkAuth() {
    const role = localStorage.getItem('role') || 'staff'; // Default staff jika belum login
    const roleDisplay = document.getElementById('userRoleDisplay');
    const adminMenu = document.getElementById('adminMenu');
    
    roleDisplay.innerText = role === 'admin' ? 'Administrator' : 'Staff Gudang';
    
    if (role === 'admin') {
        adminMenu.classList.remove('hidden');
    }
}

// 7. LOGOUT
function logout() {
    if (confirm("Anda yakin ingin keluar?")) {
        localStorage.removeItem('role');
        window.location.href = "login.html"; // Pastikan file login ada
    }
}
