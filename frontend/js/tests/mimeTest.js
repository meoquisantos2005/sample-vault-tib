document.addEventListener("DOMContentLoaded", () => {

    const btn = document.getElementById("mimeTestBtn");

    if (!btn) return;

    btn.addEventListener("click", async () => {

        try {

            const token = localStorage.getItem("test_token");

            if (!token) {
                showModal("Tenés que loguearte primero");
                return;
            }

            const fileInput = document.getElementById("audioInput");
            const file = fileInput.files[0];

            if (!file) {
                logToConsole({ message: "Tenés que seleccionar un archivo primero" });
                return;
            }

            const formData = new FormData();
            formData.append("display_name", "Test manual");
            formData.append("category", "Drums");
            formData.append("bpm", "120");
            formData.append("audioFile", file);

            const response = await fetch("/api/samples/upload", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            logToConsole(data);

            if (!response.ok) {
                showModal(data.message);
                return;
            }

        // ✅ SOLO SI TODO SALIÓ BIEN
        location.reload();

        } catch (err) {
            logToConsole({
                message: "Error inesperado",
                error: err.message
            });

            showModal("Error inesperado");
        }
    });
});

function showModal(message) {
    const modal = document.getElementById("errorModal");
    const text = document.getElementById("modalMessage");

    text.innerText = message;
    modal.style.display = "block";
}

function logToConsole(data) {
    const consoleDiv = document.getElementById("api-console");
    consoleDiv.innerText = JSON.stringify(data, null, 2);
}