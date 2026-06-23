document.addEventListener("DOMContentLoaded", () => {

    const loginBtn = document.getElementById("loginBtn");

    if (!loginBtn) return;

    loginBtn.addEventListener("click", async () => {

        const username = document.getElementById("usernameInput").value;
        const password = document.getElementById("passwordInput").value;

        if (!username || !password) {
            alert("Completa todos los campos");
            return;
        }

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            // ❌ LOGIN ERROR
            if (!response.ok) {
                alert(data.message || "Usuario o contraseña incorrecta");
                return;
            }

            // ✔ LOGIN OK
            localStorage.setItem("test_token", data.token);
            localStorage.setItem("role", data.role);

            // 🔥 REDIRECCIÓN SEGÚN ROL
            if (data.role === "admin") {
                window.location.href = "/html/admin-dashboard.html";
            } else {
                window.location.href = "/html/producer-dashboard.html";
            }

        } catch (err) {
            console.error(err);
            alert("Error de conexión con el servidor");
        }
    });

});