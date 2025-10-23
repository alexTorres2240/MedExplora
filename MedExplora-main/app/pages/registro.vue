<template>
  <div class="inicio-container">
    <div class="overlay">
      <div class="register-card">
        <img src="/imagenes/logos/logoMedEx.png" alt="Logo MedExplora" class="logoMedEx" />
        <img src="/imagenes/logos/logoUABC.png" alt="Logo UABC" class="logoUABC" />
        <form @submit.prevent="login">
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
            placeholder="Contraseña"
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

const correo = ref('')
const contrasena = ref('')
const confContrasena = ref('')
const mensajeReg = ref('')
const errorReg = ref(false)

function login() {
  const dominioInst = '@uabc.edu.mx'

  if (!correo.value.endsWith(dominioInst)) {
    mensajeReg.value = 'Solo se permite el registro con correo institucional UABC.'
    errorReg.value = true;
    return
  } else if (contrasena.value !== confContrasena.value) {
    mensajeReg.value = 'Las contraseñas no coinciden.'
    errorReg.value = true;
    return
  } else {
    mensajeReg.value = 'Registro éxitoso.'
    errorReg.value = false;
    return
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