document.getElementById('register-button').addEventListener('click', function(event) {
    event.preventDefault();

    document.getElementById('nombre-error').textContent = '';
    document.getElementById('apellido-error').textContent = '';
    document.getElementById('email-error').textContent = '';
    document.getElementById('rut-error').textContent = '';
    document.getElementById('password-error').textContent = '';
    document.getElementById('confirm-password-error').textContent = '';
    document.getElementById('region-error').textContent = '';
    document.getElementById('comuna-error').textContent = '';
    document.getElementById('terms-error').textContent = '';

    var nombre = document.getElementById('nombre').value.trim();
    var apellido = document.getElementById('apellido').value.trim();
    var email = document.getElementById('email').value.trim();
    var rut = document.getElementById('rut').value.trim();
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirm-password').value;
    var region = document.getElementById('region').value;
    var comuna = document.getElementById('comuna').value;
    var terms = document.getElementById('terms').checked;

    var isValid = true;

    if (nombre === '') {
        document.getElementById('nombre-error').textContent = 'El nombre es obligatorio';
        isValid = false;
    }

    if (apellido === '') {
        document.getElementById('apellido-error').textContent = 'El apellido es obligatorio';
        isValid = false;
    }

    if (!email){
        document.getElementById('email-error').textContent = 'El correo electrónico es obligatorio';
        isValid = false;
    } else if (!validateEmail(email)) {
        document.getElementById('email-error').textContent = 'El correo electrónico no es válido';
        isValid = false;
    }

    if (!rut){
        document.getElementById('rut-error').textContent = 'El RUT es obligatorio';
        isValid = false;
    } else if (!validateRUT(rut)) {
        document.getElementById('rut-error').textContent = 'El formato del RUT es incorrecto, por favor utilice el siguiente formato: 18123123-1';
        isValid = false;
    }

    if(!password){
        document.getElementById('password-error').textContent = 'La contraseña es obligatoria';
        isValid = false;
    } else if (password.length < 6) {
        document.getElementById('password-error').textContent = 'La contraseña debe tener al menos 6 caracteres';
        isValid = false;
    } else if (password && !confirmPassword) {
        document.getElementById('confirm-password-error').textContent = 'Debe confirmar la contraseña';
        isValid = false;
    } else if (password !== confirmPassword) {
        document.getElementById('confirm-password-error').textContent = 'Las contraseñas no coinciden';
        isValid = false;
    }

    if (region === '') {
        document.getElementById('region-error').textContent = 'Debes seleccionar una región';
        isValid = false;
    }

    if (comuna === '') {
        document.getElementById('comuna-error').textContent = 'Debes seleccionar una comuna';
        isValid = false;
    }

    if (!terms) {
        document.getElementById('terms-error').textContent = 'Debes aceptar los términos y condiciones';
        isValid = false;
    }

    if (isValid) {
        alert('Formulario válido');

    }
});

function validateEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateRUT(rut) {
    var rutRegex = /^\d{7,8}-[\dkK]$/;
    return rutRegex.test(rut);
}
