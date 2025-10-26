<template>
  <div class="pantalla-completa">
    <button class="close-btn" @click="emit('cerrar')">✖</button>
    <component :is="componenteParte" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Cabeza from './PartesCuerpo/Cabeza.vue'
import BrazoIzquierdo from './PartesCuerpo/BrazoIzquierdo.vue'
import BrazoDerecho from './PartesCuerpo/BrazoDerecho.vue'
import PiernaIzquierda from './PartesCuerpo/PiernaIzquierda.vue'
import PiernaDerecha from './PartesCuerpo/PiernaDerecha.vue'
import Torso from './PartesCuerpo/Torso.vue'
import Espalda from './PartesCuerpo/Espalda.vue'

const router = useRouter()
const emit = defineEmits(['cerrar'])

const props = defineProps({
  parte: String
})

const componentes = {
  cabeza: Cabeza,
  brazoi: BrazoIzquierdo,
  brazod: BrazoDerecho,
  piernai: PiernaIzquierda,
  piernad: PiernaDerecha,
  torso: Torso,
  espalda: Espalda
}

const componenteParte = computed(() => componentes[props.parte] || null)

const volver = () => {
  router.push('/HumanModel')
}

</script>

<style scoped>
.pantalla-completa{
  position: fixed; 
  inset: 0;
  background: #fff;
  padding: 30px;
  overflow-y: auto;
  z-index: 9999;
}

.close-btn{
  position: absolute; 
  top: 20px;
  right: 25;
  background: none; 
  border: none;
  font-size: 26px;
  cursor: pointer;
}

</style>

