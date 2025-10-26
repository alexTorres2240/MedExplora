<template>
  <div class="inicio-container">
    <div class="overlay">
      <div class="register-card">
        <img src="/imagenes/logos/logoMedEx.png" alt="Logo MedExplora" class="logoMedEx" />
        <img src="/imagenes/logos/logoUABC.png" alt="Logo UABC" class="logoUABC" />
        <form @submit.prevent="register">
          <input
            type="nombre"
            v-model="nombre"
            placeholder="Nombre"
            required
          />
          <input
            type="apellido"
            v-model="apellido"
            placeholder="Apellido"
            required
          />
          <input
            type="email"
            v-model="correo"
            placeholder="Correo electrónico"
            required
          />
          <input
            type="password"
            v-model="contrasena"
            placeholder="Contraseña"
            required
          />
          <input
            type="password"
            v-model="confContrasena"
            placeholder="Confirmar contraseña"
            required
          />
          <button type="submit">Regístrarme</button>
        </form>
        <p v-if="mensajeReg" :class="{'mensaje': true, 'error': errorReg, 'exito': !errorReg}">
          {{ mensajeReg }}
          <span v-if="!errorReg">
            <br/>
            <NuxtLink to="/" class="link-login">Ir a inicio de sesión</NuxtLink>
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { validateInstitutionalEmail, validatePasswordStrength, hashPassword } from '~/utils/security';

const nombre = ref('')
const apellido = ref('')
const correo = ref('')
const contrasena = ref('')
const confContrasena = ref('')
const mensajeReg = ref('')
const errorReg = ref(false)


async function register() {
  mensajeReg.value = ''
  errorReg.value = false

  const email = (correo.value || '').trim().toLowerCase()

  // --- VALIDACIONES (Estas las tenías bien) ---
  // 1) Domain check
  const domainCheck = await validateInstitutionalEmail(email)
  if (!domainCheck.ok) {
    mensajeReg.value = 'Correo no permitido: ' + (domainCheck.reason || 'dominio inválido')
    errorReg.value = true
    return
  }

  // 2) Password match
  if (contrasena.value !== confContrasena.value) {
    mensajeReg.value = 'Las contraseñas no coinciden.'
    errorReg.value = true
    return
  }
  // 3) Password strength
  const pwdCheck = validatePasswordStrength(contrasena.value)
  if (!pwdCheck.ok) {
    mensajeReg.value = 'Contraseña débil: ' + pwdCheck.errors.join(', ')
    errorReg.value = true
    return
  }

  // --- LLAMADA A LA API (Simplificada) ---
  try {
    // Ya no necesitamos el check previo, el endpoint de registro lo maneja.

    // Intentar registrar usando $fetch (maneja errores mejor)
    const response = await $fetch('/api/users/register', {
      method: 'POST',
      // $fetch se encarga del JSON.stringify y headers correctos
      body: {
        name: nombre.value,       // Campo 'name' como espera el backend
        apellido: apellido.value, // Campo 'apellido'
        email: email,             // Email limpio
        password: contrasena.value  // Contraseña en texto plano
      }
    })

    // Si $fetch funciona (respuesta 2xx), el registro fue exitoso
    mensajeReg.value = response.message || '¡Usuario registrado con éxito!'; // Usar mensaje del backend
    errorReg.value = false;

    // Limpiar formulario
    nombre.value = '';
    apellido.value = '';
    correo.value = '';
    contrasena.value = '';
    confContrasena.value = '';

    // Opcional: Redirigir a login después de un momento
    // setTimeout(() => {
    //   navigateTo('/'); // Ajusta la ruta si tu login no está en '/'
    // }, 2000);

  } catch (error) {
    // $fetch lanza error si la respuesta no es 2xx
    console.error('Error en registro:', error);

    // Intentar obtener el mensaje de error específico del backend
    if (error.response && error.response._data && error.response._data.message) {
      mensajeReg.value = error.response._data.message;
    } else if (error.message.includes('fetch')) {
      // Error de red o servidor no disponible
      mensajeReg.value = 'No se pudo conectar con el servidor. Intente más tarde.';
    } else {
      // Otro tipo de error
      mensajeReg.value = 'Error en el registro: ' + (error.message || 'desconocido');
    }
    errorReg.value = true;
  }
} // <--- Asegúrate que esta llave cierra la función register

</script>

<style scoped>
.inicio-container {
  background-image: url('/imagenes/fondos/fondo1.jpg');
  background-size: cover;
  background-position: center;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

}

.overlay-card {
  background-color: rgba(0, 0, 0, 0.6);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.register-card {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 40px;
  text-align: center;
  width: 340px;
  box-shadow: 06px 20px rgba(0, 0, 0, 0.3);
}


.logoUABC {
  width: 100px;
  margin-bottom: 15px;
  align-items: center;
}

.logoMedEx {
  width: 200px;
  margin-bottom: 15px;
  align-items: center;
}

input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #DD971A;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease-in-out;
}

button:hover {
  background-color: #DD971A;
}

.mensaje {
  margin-top: 15px;
  font-weight: bold;
  font-size: 14px;
}

.mensaje.error {
  color: #e74c3c;
}

.mensaje.exito {
  color: #27ae60;
}

</style>