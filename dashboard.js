// Cek apakah sudah login
const role = localStorage.getItem('role');

if (!role) {
    // Jika belum login, tendang balik ke login.html
    window.location.href = 'index.html';
}

// Atur tampilan berdasarkan Role
document.addEventListener('DOMContentLoaded', () => {
    const adminMenu = document.getElementById('adminMenu');
    const roleDisplay = document.getElementById('userRoleDisplay');
    const badge = document.getElementById('statusBadge');

    if (role === 'admin') {
        adminMenu.classList.remove('hidden'); // Tampilkan menu admin
        roleDisplay.innerText = "Logged as: Administrator";
        badge.innerText = "FULL ACCESS";
        badge.classList.add('bg-green-100', 'text-green-700');
    } else {
        roleDisplay.innerText = "Logged as: Staff Gudang";
        badge.innerText = "VIEW ONLY";
        badge.classList.add('bg-blue-100', 'text-blue-700');
    }
});

// Fungsi Logout
function logout() {
    localStorage.removeItem('role');
    window.location.href = 'index.html';
}
