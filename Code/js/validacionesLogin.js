document.getElementById('login-button').addEventListener('click', function(event) {
    event.preventDefault();

    document.getElementById('nombre-error').textContent = '';
    document.getElementById('contraseña-error').textContent = '';

    var email = document.getElementById('nombre').value.trim();
    var password = document.getElementById('apellido').value.trim();

    var isValid = true;

    if (!email){
        document.getElementById('nombre-error').textContent = 'El correo electrónico es obligatorio';
        isValid = false;
    } else if (!validateEmail(email)) {
        document.getElementById('nombre-error').textContent = 'Por favor, ingrese un correo electrónico válido.';
        isValid = false;
    }

    if (password === '') {
        document.getElementById('contraseña-error').textContent = 'La contraseña es obligatoria.';
        isValid = false;
    }

    if (isValid) {
        alert('Formulario válido.');
    }
});

function validateEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}