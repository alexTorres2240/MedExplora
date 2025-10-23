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

  // 1) validar dominio institucional usando la utilidad centralizada
  const domainCheck = await validateInstitutionalEmail(email)
  if (!domainCheck.ok) {
    mensajeReg.value = 'Correo no permitido: ' + (domainCheck.reason || 'dominio inválido')
    errorReg.value = true
    return
  }

  // 2) validar contraseñas
  if (contrasena.value !== confContrasena.value) {
    mensajeReg.value = 'Las contraseñas no coinciden.'
    errorReg.value = true
    return
  }
  const pwdCheck = validatePasswordStrength(contrasena.value)
  if (!pwdCheck.ok) {
    mensajeReg.value = 'Contraseña débil: ' + pwdCheck.errors.join(', ')
    errorReg.value = true
    return
  }

  // 3) comprobar existencia del usuario en backend (si existe), si backend no disponible usar fallback localStorage
  try {
    const checkRes = await fetch(`/api/users/check?email=${encodeURIComponent(email)}`)
    if (checkRes.ok) {
      const j = await checkRes.json()
      if (j.exists) {
        mensajeReg.value = 'Ya existe una cuenta con este correo. Use el inicio de sesión.'
        errorReg.value = true
        return
      }
    } else {
      // si el endpoint existe pero devuelve error, detener registro en producción
      // aquí continuamos con fallback demo
    }
  } catch (e) {
    // backend no disponible -> seguir con fallback demo localStorage
  }

  // 4) hashear la contraseña y enviar al backend / fallback localStorage
  try {
    const hashed = await hashPassword(contrasena.value)

    // intentar registrar en servidor
    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          passwordHash: hashed,
          nombre: nombre.value,
          apellido: apellido.value
        })
      })
      if (res.ok) {
        mensajeReg.value = 'Cuenta creada. Verifique su correo (si aplica).'
        errorReg.value = false
        correo.value = contrasena.value = confContrasena.value = nombre.value = apellido.value = ''
        return
      }
      // si el servidor responde con error, caemos a fallback
    } catch (e) {
      // servidor no disponible -> fallback
    }

    // fallback demo: guardar en localStorage (solo para desarrollo)
    const store = JSON.parse(localStorage.getItem('demo_users') || '{}')
    if (store[email]) {
      mensajeReg.value = 'Ya existe una cuenta con este correo (local).'
      errorReg.value = true
      return
    }
    store[email] = { passwordHash: hashed, nombre: nombre.value, apellido: apellido.value, createdAt: Date.now() }
    localStorage.setItem('demo_users', JSON.stringify(store))

    mensajeReg.value = 'Cuenta creada (modo demo local).'
    errorReg.value = false
    correo.value = contrasena.value = confContrasena.value = nombre.value = apellido.value = ''
  } catch (err) {
    mensajeReg.value = 'Error en el registro: ' + (err.message || 'desconocido')
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