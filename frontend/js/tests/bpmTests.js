async function okLogin()
 {
    // 1. Login como productor (pepe) para obtener un token válido
     const response = await fetch('/api/auth/login', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ username: 'pepe', password: '12345' }) // Usamos pepe hardcodeado
     });
     const data = await response.json();
     // Guardamos el token para tests de samples
     localStorage.setItem('test_token', data.token);
 }

testUtils.createTestButton("Test BPM (validación 120)", async (btn) => {

    await okLogin();
    const token = localStorage.getItem('test_token');

    const formData = new FormData();
    formData.append('display_name', 'Test BPM Only');
    formData.append('category', 'Drums');
    formData.append('bpm', '120');

    const blob = new Blob(["Fake Audio"], { type: 'audio/wav' });
    formData.append('audioFile', blob, 'test.wav');

    const response = await fetch('/api/samples/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    });

    const data = await response.json();
    testUtils.log(data);

    if (response.ok) {
        testUtils.setSuccess(btn);
    } else {
        btn.className = "w3-button w3-block w3-section w3-round w3-red";
        showModal(data.message || "Error en BPM");
    }
});
function showModal(message) {
    document.getElementById('modalMessage').textContent = message;
    document.getElementById('errorModal').style.display = 'block';
}