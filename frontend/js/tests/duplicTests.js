testUtils.createTestButton(
    "Test Registro - Prevención de Duplicados",
    async (btn) => {

        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'pepe',
                password: '12345'
            })
        });

        const data = await response.json();

        testUtils.log(data);

        if (response.status === 409) {
            testUtils.setSuccess(btn);
        }
    }
);