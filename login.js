document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMessage');

    // Kredensial Sederhana (Bisa diganti nanti)
    const adminData = { user: "admin123", pass: "admin123" };
    const userData = { user: "usergudang", pass: "user123" };

    if (user === adminData.user && pass === adminData.pass) {
        // Simpan Role ke LocalStorage
        localStorage.setItem('role', 'admin');
        window.location.href = 'dashboard.html';
    } 
    else if (user === userData.user && pass === userData.pass) {
        // Simpan Role ke LocalStorage
        localStorage.setItem('role', 'user');
        window.location.href = 'dashboard.html';
    } 
    else {
        errorMsg.classList.remove('hidden');
    }
});
