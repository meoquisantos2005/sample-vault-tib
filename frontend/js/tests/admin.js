document.addEventListener("DOMContentLoaded", async () => {

    const list = document.getElementById("userList");

    const token = localStorage.getItem("test_token");
    const role = localStorage.getItem("role");

    // 🔴 seguridad básica frontend
    if (role !== "admin") {
        alert("No tenés permisos para entrar aquí");
        window.location.href = "/html/login.html";
        return;
    }

    // ✔ cargar usuarios
    async function loadUsers() {

        try {
            const res = await fetch("/api/admin/users", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const users = await res.json();

            list.innerHTML = "";

            users.forEach(user => {

                const li = document.createElement("li");
                li.className = "w3-padding w3-border-bottom";

                li.innerHTML = `
                    👤 <b>${user.username}</b> 
                    - <span>${user.role}</span>

                    <button data-id="${user.id}" 
                            class="deleteBtn w3-button w3-red w3-small w3-right">
                        Eliminar
                    </button>
                `;

                list.appendChild(li);
            });

            // eventos delete
            document.querySelectorAll(".deleteBtn").forEach(btn => {

                btn.addEventListener("click", async () => {

                    const id = btn.dataset.id;

                    const confirmDelete = confirm("¿Eliminar este usuario?");
                    if (!confirmDelete) return;

                    await fetch(`/api/admin/users/${id}`, {
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });

                    loadUsers();
                });
            });

        } catch (err) {
            console.error(err);
            alert("Error cargando usuarios");
        }
    }

    loadUsers();

});