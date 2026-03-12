/**
 * DASHBOARD MAIN CONTROLLER
 * Menangani logika utama, sinkronisasi data, dan autentikasi
 */

// 1. DATABASE MASTER (Data Acuan Cat & Chemical)
// Variabel ini yang akan dibaca oleh master.js
let catChemicalMaster = [
    {
        no: 1,
        entryDate: "12 Mar 2026",
        partNumber: "P001-388-2",
        namaProduk: "Retan PG 60 U/C Macho Bright Blue (electrostatic)",
        supplier: "PT Kansai Paint Indonesia",
        satuan: 20
    },
    {
        no: 2,
        entryDate: "12 Mar 2026",
        partNumber: "CHEM-001",
        namaProduk: "Thinner High Gloss",
        supplier: "PT. Kimia Sejahtera",
        satuan: 200
    }
];

// 2. DATABASE TRANSAKSI (Histori In/Out)
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

// 3. FUNGSI INISIALISASI (Dijalankan saat halaman load)
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    refreshAllModules();
    
    // Inisialisasi ikon Lucide untuk elemen statis
    if (typeof lucide !== 'undefined') lucide.createIcons();
});

// 4. REFRESH SEMUA MODUL
function refreshAllModules() {
    const data = inventoryData;
    
    // Update Ringkasan Dashboard (Total SKU, Low Stock, dll)
    if (typeof updateDashboardStats === 'function') {
        updateDashboardStats(data);
    }
    
    // Update List Aktivitas Terakhir
    if (typeof renderRecentActivity === 'function') {
        renderRecentActivity(data);
    }
}

// 5. LOGIKA NAVIGASI & ROUTING
function showSection(id) {
    // Sembunyikan semua section
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    
    // Tampilkan target section
    const target = document.getElementById(id + '-section');
    if(target) target.classList.remove('hidden');

    // Update UI Sidebar Aktif
    updateSidebarUI(id);
    
    // Update Header Text
    const titles = {
        'dashboard': 'Ringkasan Gudang',
        'inventory': 'Histori Transaksi',
        'stock': 'Saldo Stok Material',
        'master': 'Database Cat & Chemical', // Tambahan untuk master.js
        'update': 'Form In / Out'
    };
    
    document.getElementById('sectionTitle').innerText = titles[id] || 'Inventory System';
    document.getElementById('breadcrumb').innerText = id.toUpperCase();

    // TRIGGER RENDER MODUL (Hanya saat dibuka agar ringan)
    if (id === 'master' && typeof renderManageMaster === 'function') {
        renderManageMaster(catChemicalMaster);
    }
    if (id === 'inventory' && typeof renderInventoryTable === 'function') {
        renderInventoryTable(inventoryData);
    }
    if (id === 'stock' && typeof renderStockSummary === 'function') {
        renderStockSummary(inventoryData);
    }

    // Tutup sidebar di mobile
    if (window.innerWidth < 768) {
        document.getElementById('sidebar').classList.add('-translate-x-full');
    }
}

// 6. HELPER: UPDATE UI SIDEBAR
function updateSidebarUI(activeId) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('bg-blue-600', 'text-white', 'shadow-sm', 'active-link');
        btn.classList.add('text-slate-400');
    });
    
    // Efek highlight pada tombol yang baru diklik
    if (event && event.currentTarget) {
        const btn = event.currentTarget;
        btn.classList.add('bg-blue-600', 'text-white', 'active-link');
        btn.classList.remove('text-slate-400');
    }
}

// 7. SISTEM AUTENTIKASI
function checkAuth() {
    // Simulasi: Jika belum ada role, set sebagai admin untuk testing
    if (!localStorage.getItem('role')) {
        localStorage.setItem('role', 'admin'); 
    }

    const role = localStorage.getItem('role');
    const roleDisplay = document.getElementById('userRoleDisplay');
    const adminMenu = document.getElementById('adminMenu');
    
    if (roleDisplay) {
        roleDisplay.innerText = role === 'admin' ? 'Administrator' : 'Staff Gudang';
    }
    
    // Tampilkan menu Admin Control jika role adalah admin
    if (role === 'admin' && adminMenu) {
        adminMenu.classList.remove('hidden');
    } else if (adminMenu) {
        adminMenu.classList.add('hidden');
    }
}

// 8. LOGIC SIMPAN DATA (Placeholder untuk Google Apps Script)
function saveToSpreadsheet(payload) {
    console.log("Mengirim data ke Spreadsheet:", payload);
    
    // Tampilkan Loading
    Swal.fire({
        title: 'Memproses...',
        text: 'Menyimpan data ke database online',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    // Simulasi Berhasil (Nantinya diganti dengan fetch/google.script.run)
    setTimeout(() => {
        if (payload.action === 'add') {
            catChemicalMaster.push({
                no: payload.no,
                entryDate: payload.entryDate,
                partNumber: payload.partNumber,
                namaProduk: payload.namaProduk,
                supplier: payload.supplier,
                satuan: payload.satuan
            });
        }
        
        Swal.fire('Berhasil!', 'Data telah diperbarui.', 'success');
        renderManageMaster(catChemicalMaster); // Refresh tampilan
    }, 1500);
}

// 9. LOGOUT
function logout() {
    Swal.fire({
        title: 'Keluar Sistem?',
        text: "Anda harus login kembali untuk mengakses data.",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Ya, Keluar'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('role');
            location.reload(); // Refresh halaman untuk kembali ke state awal
        }
    });
}
