<template>
  <div class="inicio-container">
    <div class="overlay">
      <div class="login-card">
        <img src="/imagenes/logos/logoMedEx.png" alt="Logo MedExplora" class="logoMedEx" />
        <img src="/imagenes/logos/logoUABC.png" alt="Logo UABC" class="logoUABC" />
        <form @submit.prevent="login">
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
          <button type="submit">Ingresar</button>
        </form>
        <p v-if="mensaje" class="mensaje" :class="{ error: errorLogin }">{{ mensaje }}</p>
        <p class="registrarse">
          No tengo una cuenta:
          <NuxtLink to="/registro">Regístrarme</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { verifyPassword } from '~/utils/security'

const correo = ref('')
const contrasena = ref('')
const mensaje = ref('')
const errorLogin = ref(false)
const router = useRouter()

async function login() {
  mensaje.value = ''
  errorLogin.value = false
  const email = (correo.value || '').trim().toLowerCase()
  
  // Validar dominio institucional UABC
  const dominioInst = '@uabc.edu.mx'
  if (!email.endsWith(dominioInst)) {
    mensaje.value = 'Solo se permite el acceso con correo institucional UABC.'
    errorLogin.value = true
    return
  }

  try {
    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: contrasena.value })
    })

    if (res.ok) {
      const body = await res.json().catch(() => ({}))
      // guardar token/email si el servidor lo devuelve
      if (body.token) localStorage.setItem('authToken', body.token)
      localStorage.setItem('userEmail', email)

      mensaje.value = 'Ingreso exitoso'
      errorLogin.value = false

      // redirigir a la página principal del cuerpo
      await router.push('/HumanModel')
      return
    }

    const body = await res.json().catch(() => ({}))
    mensaje.value = body?.statusMessage || body?.message || 'Correo o contraseña incorrectos'
    errorLogin.value = true
    return
  } catch (e) {
    // Fallback demo: verificar en localStorage si el servidor no responde
    const store = JSON.parse(localStorage.getItem('demo_users') || '{}')
    const user = store[email]
    if (!user) {
      mensaje.value = 'Usuario no registrado.'
      errorLogin.value = true
      return
    }
    const ok = await verifyPassword(contrasena.value, user.passwordHash)
    if (!ok) {
      mensaje.value = 'Correo o contraseña incorrectos.'
      errorLogin.value = true
      return
    }

    localStorage.setItem('userEmail', email)
    mensaje.value = 'Ingreso exitoso (modo demo local).'
    errorLogin.value = false
    await router.push('/HumanModel')
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

.overlay {
  background-color: rgba(0, 0, 0, 0.6);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-card {
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

h1 {
  font-size: 24px;
  margin-bottom: 25px;
  color: #222;
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
  background-color: #c8850f;
}

.mensaje {
  margin-top: 10px;
  font-size: 14px;
  color: #28a745;
}

.mensaje.error {
  color: #dc3545;
}

.registrarse {
  margin-top: 15px;
  font-size: 14px;
}

.registrarse a {
  color: #3b82f6;
  text-decoration: none;
}

.registrarse a:hover {
  text-decoration: underline;
}
</style>