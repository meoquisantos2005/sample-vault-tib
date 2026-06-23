document.addEventListener("DOMContentLoaded", () => {

    const btn = document.getElementById("registerBtn");

    btn.addEventListener("click", async () => {

        const username = document.getElementById("usernameInput").value;
        const password = document.getElementById("passwordInput").value;

        if (!username || !password) {
            alert("Completa todos los campos");
            return;
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            console.log("REGISTER RESPONSE:", data);

            if (!res.ok) {
                alert(data.message || "Error al registrar");
                return;
            }

            alert("Usuario creado correctamente");

            // ✔ IR A LOGIN
            window.location.href = "./login.html";

        } catch (err) {
            console.error(err);
            alert("Error de servidor");
        }
    });

});