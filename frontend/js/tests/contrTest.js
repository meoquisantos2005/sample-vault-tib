testUtils.createTestButton(
    "Test Registro - Contraseña corta",
    async (btn) => {

        const response = await fetch(
            '/api/auth/register',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: 'usuario_test',
                    password: '123'
                })
            }
        );

        const data = await response.json();

        testUtils.log(data);

        if (
            response.status === 400 &&
            data.message ===
                "La contraseña es demasiado corta."
        )
        {
            testUtils.setSuccess(btn);
        }
        else
        {
            testUtils.setFail(btn);
        }
    }
);