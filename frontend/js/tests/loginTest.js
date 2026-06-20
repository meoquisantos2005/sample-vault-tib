document.addEventListener("DOMContentLoaded", () => {

    const loginBtn = document.getElementById("loginBtn");

    if (!loginBtn) return;

    loginBtn.addEventListener("click", async () => {

        const username = document.getElementById("usernameInput").value;
        const password = document.getElementById("passwordInput").value;

        const consoleDiv = document.getElementById("api-console");

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            // 🔴 ERROR LOGIN
            if (!response.ok) {

                consoleDiv.innerText = "❌ Usuario o contraseña incorrecta";

                return;
            }

            // 🟢 LOGIN OK
            localStorage.setItem("test_token", data.token);

            // habilitar subir sample
            document.getElementById("mimeTestBtn").disabled = false;

            consoleDiv.innerText = "✔ Login correcto";
            
        } catch (err) {

            consoleDiv.innerText = "Error de conexión";

        }
    });
});