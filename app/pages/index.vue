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
        <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>
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


const correo = ref('')
const contrasena = ref('')
const mensaje= ref('')

const routerCuerpoF = useRouter()

function login() {
  const dominioInst = '@uabc.edu.mx'

  if (!correo.value.endsWith(dominioInst)) {
    mensaje.value = 'Solo se permite el acceso con correo institucional UABC.'
    return
  } else {
    mensaje.value = 'Inicio de sesión exitoso.'
    routerCuerpoF.push('/HumanModel')
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

.login-card {
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
  background-color: #DD971A;
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