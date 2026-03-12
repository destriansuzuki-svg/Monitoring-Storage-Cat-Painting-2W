// 1. CEK AUTH
const role = localStorage.getItem('role');
if (!role) {
    window.location.href = 'index.html';
}

// 2. ATUR TAMPILAN BERDASARKAN ROLE
document.addEventListener('DOMContentLoaded', () => {
    const adminMenu = document.getElementById('adminMenu');
    const roleDisplay = document.getElementById('userRoleDisplay');
    const badge = document.getElementById('statusBadge');

    if (role === 'admin') {
        adminMenu.classList.remove('hidden');
        roleDisplay.innerText = "Administrator";
        badge.innerText = "FULL ACCESS";
        badge.classList.add('bg-green-100', 'text-green-700', 'border', 'border-green-200');
    } else {
        roleDisplay.innerText = "Staff Gudang";
        badge.innerText = "VIEW ONLY";
        badge.classList.add('bg-blue-100', 'text-blue-700', 'border', 'border-blue-200');
    }
});

// 3. FUNGSI LOGOUT
function logout() {
    if(confirm("Apakah anda yakin ingin logout?")) {
        localStorage.removeItem('role');
        window.location.href = 'index.html';
    }
}
