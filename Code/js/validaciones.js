document.addEventListener('DOMContentLoaded', function() {
    const registerButton = document.getElementById('register-button');
    const nombreInput = document.getElementById('nombre');
    const apellidoInput = document.getElementById('apellido');
    const emailInput = document.getElementById('email');
    const rutInput = document.getElementById('rut');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const regionSelect = document.getElementById('region');
    const comunaSelect = document.getElementById('comuna');
    const termsCheckbox = document.getElementById('terms');

    // Obtener los elementos para mostrar los mensajes de error
    const nombreError = document.getElementById('nombre-error');
    const apellidoError = document.getElementById('apellido-error');
    const emailError = document.getElementById('email-error');
    const rutError = document.getElementById('rut-error');
    const passwordError = document.getElementById('password-error');
    const confirmPasswordError = document.getElementById('confirm-password-error');
    const regionError = document.getElementById('region-error');
    const comunaError = document.getElementById('comuna-error');
    const termsError = document.getElementById('terms-error');

    // Expresión regular para validar el formato del RUT
    const rutRegex = /^\d{1,8}-[0-9Kk]$/;

    // Función para validar el formato del RUT
    function validateRut(rut) {
        const cleanedRut = rut.replace(/\./g, '').trim();
        return rutRegex.test(cleanedRut);
    }

    // Función para validar las contraseñas
    function validatePasswords(password, confirmPassword) {
        return password === confirmPassword;
    }

    // Manejo del evento click del botón de registro
    registerButton.addEventListener('click', function(event) {
        event.preventDefault(); // Previene el envío del formulario si hay errores
        
        let isValid = true;

        // Validar campos obligatorios
        if (!nombreInput.value.trim()) {
            nombreError.textContent = 'El nombre es obligatorio';
            isValid = false;
        } else {
            nombreError.textContent = '';
        }

        if (!apellidoInput.value.trim()) {
            apellidoError.textContent = 'El apellido es obligatorio';
            isValid = false;
        } else {
            apellidoError.textContent = '';
        }

        if (!emailInput.value.trim()) {
            emailError.textContent = 'El correo electrónico es obligatorio';
            isValid = false;
        } else {
            emailError.textContent = '';
        }

        if (!rutInput.value.trim()) {
            rutError.textContent = 'El RUT es obligatorio';
            isValid = false;
        } else if (!validateRut(rutInput.value.trim())) {
            rutError.textContent = 'El formato del RUT es incorrecto, por favor utilice el siguiente formato: 18123123-1';
            isValid = false;
        } else {
            rutError.textContent = '';
        }

        if (!passwordInput.value.trim()) {
            passwordError.textContent = 'La contraseña es obligatoria';
            isValid = false;
        } else {
            passwordError.textContent = '';
        }

        if (!confirmPasswordInput.value.trim()) {
            confirmPasswordError.textContent = 'Debes confirmar la contraseña';
            isValid = false;
        } else if (!validatePasswords(passwordInput.value.trim(), confirmPasswordInput.value.trim())) {
            confirmPasswordError.textContent = 'Las contraseñas no coinciden';
            isValid = false;
        } else {
            confirmPasswordError.textContent = '';
        }

        if (regionSelect.value === '') {
            regionError.textContent = 'Debes seleccionar una región';
            isValid = false;
        } else {
            regionError.textContent = '';
        }

        if (comunaSelect.value === '') {
            comunaError.textContent = 'Debes seleccionar una comuna';
            isValid = false;
        } else {
            comunaError.textContent = '';
        }

        if (!termsCheckbox.checked) {
            termsError.textContent = 'Debes aceptar los términos y condiciones';
            isValid = false;
        } else {
            termsError.textContent = '';
        }

        if (isValid) {
            // Aquí puedes proceder con el envío del formulario si todas las validaciones son correctas
            alert('Formulario válido. Enviar datos...');
            // Puedes enviar el formulario usando JavaScript o descomentar la línea siguiente si usas el botón dentro de un formulario:
            // document.querySelector('form').submit();
        }
    });
});
