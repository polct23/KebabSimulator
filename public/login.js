// login.js

async function handleLogin(username, password) {
    const url = '/dsaApp/players/login';
    const data = {
        userName: username,
        password: password
    };

    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    try {
        const response = await fetch(url, fetchOptions);
        const result = await response.json();

        if (response.ok) {
            if (result.message === "Login Successful") {
                console.log('Login successful');
                // Almacena el estado del usuario como autenticado en localStorage
                localStorage.setItem('userStatus', 'loggedIn');
                localStorage.setItem('username', username);
                localStorage.setItem('password', password);

                // Mostrar modal de éxito
                $('#successModal').modal('show');
                document.getElementById('successModalButton').addEventListener('click', function() {
                    window.location.href = '/menu.html'; // Redirige a la página menu.html
                });
            } else {
                // Si el mensaje no indica un inicio de sesión exitoso, lanza un error
                throw new Error(result.message || 'Unknown login error');
            }
        } else {
            // Si la respuesta no es exitosa, lanza un error con el mensaje de error recibido
            throw new Error(result.error || 'Failed to login');
        }
    } catch (error) {
        console.error('Login Error:', error);
        // Mostrar modal de error
        document.getElementById('errorModalMessage').textContent = "Error: " + error.message;
        $('#errorModal').modal('show');
    }
}
