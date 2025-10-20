<template>
  <div class="overlay" @click.self="$emit('cerrar')">
    <div class="modal">
      <button class="close-btn" @click="$emit('cerrar')">✖</button>
      <div class="modal-content">
        <component :is="componenteParte" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Cabeza from './PartesCuerpo/Cabeza.vue'
import BrazoIzquierdo from './PartesCuerpo/BrazoIzquierdo.vue'
import BrazoDerecho from './PartesCuerpo/BrazoDerecho.vue'
import PiernaIzquierda from './PartesCuerpo/PiernaIzquierda.vue'
import PiernaDerecha from './PartesCuerpo/PiernaDerecha.vue'

const props = defineProps({
  parte: String
})

const componentes = {
  cabeza: Cabeza,
  brazoi: BrazoIzquierdo,
  brazod: BrazoDerecho,
  piernai: PiernaIzquierda,
  piernad: PiernaDerecha
}

const componenteParte = computed(() => componentes[props.parte] || null)
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
}

.modal {
  position: relative;
  background: #fff;
  padding: 25px 30px;
  border-radius: 20px;
  width: 80%;
  max-width: 900px;
  max-height: 85%;
  overflow-y: auto;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  animation: aparecer 0.25s ease-out;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 18px;
  background: none;
  border: none;
  font-size: 22px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
}

.modal-content {
  margin-top: 25px;
  text-align: center;
}

@keyframes aparecer {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
</style>
