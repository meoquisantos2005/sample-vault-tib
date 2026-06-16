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

 testUtils.createTestButton("Ej01 - Test Registro - Usuario Nuevo", async (btn) => {
    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: 'nuevo_productor_' + Date.now(), // Nombre único para evitar duplicados
            // username: 'nuevo_productor_' + crypto.randomUUID(), // Nombre único (UUID)
            password: 'password123'
        })
    });

    const data = await response.json();
    testUtils.log(data);

    // El servidor debe responder con 201 Created
    if (response.status === 201) {
        testUtils.setSuccess(btn);
    }
});


testUtils.createTestButton("Ej02 - Test Seguridad - Productor accediendo a Admin", async (btn) => {
    // 1. Asegurar y guardar una sesión válida
    await okLogin();
    const token = localStorage.getItem('test_token');

    // 2. Intentar acceder a la ruta de administración
    const response = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();
    testUtils.log(data);

    // El test es exitoso si el servidor efectivamente prohíbe el acceso (403 Forbidden)
    if (response.status === 403) {
        testUtils.setSuccess(btn);
    }
});

testUtils.createTestButton("Ej03 - Test Eliminar Sample Dinámico", async (btn) => {
    // 1. Asegurar y guardar una sesión válida
    await okLogin();
    const token = localStorage.getItem('test_token');

    // 2. Obtener lista de samples para encontrar un ID real
    const listResponse = await fetch('/api/samples/my-samples', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const samples = await listResponse.json();

    // Validar si el usuario tiene samples para borrar
    if (!samples || samples.length === 0) {
        testUtils.log({ message: "No hay samples disponibles para probar el borrado. Suba uno primero." }, true);
        return;
    }

    // Tomamos el ID del primer sample encontrado
    const targetId = samples[0].id;
    testUtils.log({ info: `Intentando borrar sample con ID dinámico: ${targetId}` });

    // 3. Realizar la petición DELETE al ID obtenido dinámicamente
    const response = await fetch(`/api/samples/${targetId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();
    testUtils.log(data);

    if (response.ok) {
        testUtils.setSuccess(btn);
    }
});

testUtils.createTestButton("Ej04 - Test Subir Sample - Error por Datos Faltantes", async (btn) => {
    // 1. Asegurar y guardar una sesión válida
    await okLogin();
    const token = localStorage.getItem('test_token');

    const formData = new FormData();
    // 2. Omitimos intencionalmente 'display_name' y 'category'
    formData.append('bpm', '128');

    const blob = new Blob(["Contenido de audio simulado"], { type: 'audio/wav' });
    formData.append('audioFile', blob, 'test_incompleto.wav');

    const response = await fetch('/api/samples/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    });

    const data = await response.json();
    testUtils.log(data);

    // El test es exitoso si el servidor detecta el error del cliente (400 Bad Request)
    if (response.status === 400) {
        testUtils.setSuccess(btn);
    }
});
