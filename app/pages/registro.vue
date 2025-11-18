<template>
  <div class="inicio-container">
    <div class="overlay-card">
      <div class="register-card">
        <img src="/imagenes/logos/logoMedEx.png" alt="Logo MedExplora" class="logoMedEx" />
        <img src="/imagenes/logos/logoUABC.png" alt="Logo UABC" class="logoUABC" />

        <form @submit.prevent="register">
          <input
            type="text"
            v-model="nombre"
            placeholder="Nombre"
            required
          />

          <input
            type="text"
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

          <!-- Password -->
          <div class="input-con-eye">
            <input
              :type="mostrarContrasena ? 'text' : 'password'"
              v-model="contrasena"
              placeholder="Contraseña"
              required
            />
            <img
              class="eye-icon"
              :src="mostrarContrasena ? '/imagenes/multimedia/OjoAbierto.png' : '/imagenes/multimedia/OjoCerrado.png'"
              @click="mostrarContrasena = !mostrarContrasena"
              alt="Mostrar/Ocultar"
            />
          </div>

          <!-- Confirm password -->
          <div class="input-con-eye">
            <input
              :type="mostrarContrasenaConfirmada ? 'text' : 'password'"
              v-model="confContrasena"
              placeholder="Confirmar contraseña"
              required
            />
            <img
              class="eye-icon"
              :src="mostrarContrasenaConfirmada ? '/imagenes/multimedia/OjoAbierto.png' : '/imagenes/multimedia/OjoCerrado.png'"
              @click="mostrarContrasenaConfirmada = !mostrarContrasenaConfirmada"
              alt="Mostrar/Ocultar"
            />
          </div>

          <button type="submit">Regístrarme</button>
        </form>

        <p v-if="mensajeReg" :class="{'mensaje': true, 'error': errorReg, 'exito': !errorReg}">
          {{ mensajeReg }}
          <span v-if="!errorReg">
            <br />
            <NuxtLink to="/" class="link-login">Ir a inicio de sesión</NuxtLink>
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { validateInstitutionalEmail, validatePasswordStrength } from '~/utils/security'

// Necesario para pruebas con Vitest donde $fetch no existe
const $fetch = globalThis.$fetch || ((url, opts) => fetch(url, opts).then(r => r.json()))

// Estados
const mostrarContrasena = ref(false)
const mostrarContrasenaConfirmada = ref(false)
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

  // 1) Validación institucional
  const domainCheck = await validateInstitutionalEmail(email)
  if (!domainCheck.ok) {
    mensajeReg.value = 'Correo no permitido: ' + (domainCheck.reason || 'dominio inválido')
    errorReg.value = true
    return
  }

  // 2) Contraseñas deben coincidir
  if (contrasena.value !== confContrasena.value) {
    mensajeReg.value = 'Las contraseñas no coinciden.'
    errorReg.value = true
    return
  }

  // 3) Fuerza de la contraseña
  const pwdCheck = validatePasswordStrength(contrasena.value)
  if (!pwdCheck.ok) {
    mensajeReg.value = 'Contraseña débil: ' + pwdCheck.errors.join(', ')
    errorReg.value = true
    return
  }

  // === PETICIÓN API ===
  try {
    const response = await $fetch('/api/users/register', {
      method: 'POST',
      body: {
        name: nombre.value,
        apellido: apellido.value,
        email,
        password: contrasena.value
      }
    })

    mensajeReg.value = response.message || '¡Usuario registrado con éxito!'
    errorReg.value = false

    // Limpiar formulario
    nombre.value = ''
    apellido.value = ''
    correo.value = ''
    contrasena.value = ''
    confContrasena.value = ''

  } catch (error) {
    console.error('Error en registro:', error)

    if (error?.response?._data?.message) {
      mensajeReg.value = error.response._data.message
    } else {
      mensajeReg.value = 'Error en el registro. Intente más tarde.'
    }

    errorReg.value = true
  }
}
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
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.logoUABC {
  width: 100px;
  margin-bottom: 15px;
}

.logoMedEx {
  width: 200px;
  margin-bottom: 15px;
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

.input-con-eye {
  position: relative;
  width: 106%;
  margin-bottom: 5px;
}

.input-con-eye input {
  width: 100%;
  height: 40px;
  padding: 10px 40px 10px 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
}

.eye-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-80%);
  cursor: pointer;
  width: 30px;
  height: 20px;
}
</style>
