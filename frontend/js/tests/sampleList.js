document.addEventListener("DOMContentLoaded", async () => {

    const list = document.getElementById("sampleList");
    if (!list) return;

    const token = localStorage.getItem("test_token");

    try {

        const res = await fetch("/api/samples/my-samples", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const samples = await res.json();
        console.log(samples);

        list.innerHTML = "";

        samples.forEach(sample => {

            const li = document.createElement("li");

            li.className = "w3-padding w3-border-bottom";

            li.innerHTML = `
                <b>${sample.display_name}</b>
                <span class="w3-right w3-text-grey">${sample.category}</span>
                <br>
                <small>${sample.bpm} BPM</small>

                <div class="w3-margin-top">

                    <button
                        class="w3-button w3-red w3-small delete-btn"
                        data-id="${sample.id}">
                        Eliminar
                    </button>

                </div>
            `;

            list.appendChild(li);

            // ======================
            // ELIMINAR SAMPLE
            // ======================

            const deleteBtn = li.querySelector(".delete-btn");

            deleteBtn.addEventListener("click", async () => {

                const confirmar = confirm(`¿Eliminar "${sample.display_name}"?`);

                if (!confirmar) return;

                try {

                    const response = await fetch(`/api/samples/${sample.id}`, {
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });

                    const data = await response.json();

                    alert(data.message);

                    location.reload();

                } catch (err) {
                    console.error(err);
                    alert("Error eliminando sample");
                }

            });

        });

    } catch (err) {
        list.innerHTML = "Error cargando samples";
        console.error(err);
    }
});