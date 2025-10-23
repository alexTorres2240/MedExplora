<template>
  <div class="cuerpo-container">
    <button class="boton-rotar izquierda" @click="rotar">⟵ Rotar</button>
    <img src="/imagenes/cuerpo/cuerpoF.png" usemap="#mapa-cuerpo" class="cuerpo" id="cuerpo" />
    <map name="mapa-cuerpo">
      <area shape="poly" coords="179,1,166,10,159,26,159,37,153,41,153,50,165,59,165,82,182,57,193,57,210,82,210,59,222,50,222,41,216,37,216,26,208,10,195,1" @click.prevent="clickCabeza" alt="Cabeza" />
      <area shape="poly" coords="182,58,165,83,139,103,147,114,121,129,136,231,132,276,160,276,182,294,186,307,189,307,193,294,214,276,243,276,239,231,253,129,230,114,236,103,210,83,193,58" @click.prevent="clickTorso" alt="Torso" />
      <area shape="poly" coords="146,114,118,108,101,119,93,139,92,164,79,210,65,231,59,247,44,302,18,324,3,341,3,344,12,344,24,333,9,373,15,373,27,349,23,383,27,383,38,353,39,353,36,381,41,381,48,353,48,376,54,376,59,314,63,306,79,283,102,239,106,224,126,175,120,129" @click.prevent="clickBrazoDerecho" alt="Brazo Derecho" />
      <area shape="poly" coords="230,114,258,108,273,119,281,139,282,164,295,210,309,231,315,247,330,302,356,324,371,341,371,344,362,344,350,333,365,373,360,373,347,349,352,383,347,383,336,353,335,353,339,381,333,381,326,353,326,376,320,376,315,314,311,306,295,283,273,239,269,224,249,175,255,129" @click.prevent="clickBrazoIzquierdo" alt="Brazo Izquierdo" />
      <area shape="poly" coords="132,277,160,277,182,295,187,308,187,357,166,452,162,478,155,489,152,548,145,567,136,594,132,620,135,654,130,666,104,666,102,662,102,654,107,644,109,584,106,551,106,528,118,477,123,449,123,421,122,400,122,359" @click.prevent="clickPiernaDerecha" alt="Pierna Derecha" />
      <area shape="poly" coords="242,277,213,277,192,295,188,308,188,357,209,452,213,478,220,489,223,548,230,567,239,594,243,620,240,654,245,666,271,666,273,662,273,654,268,644,266,584,269,551,269,528,256,477,252,449,252,421,253,400,253,359" @click.prevent="clickPiernaIzquierda" alt="Pierna Izquierda" />
    </map>
    <button class="boton-rotar derecha" @click="rotar">Rotar ⟶</button>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

function clickArea(e) {
  const alt = e.target.alt;
  switch (alt) {
    case 'Cabeza': window.location.href = '/cabeza'; break;
    case 'Torso': window.location.href = '/torso'; break;
    case 'Brazo Derecho': window.location.href = '/brazoDerecho'; break;
    case 'Brazo Izquierdo': window.location.href = '/brazoizquierdo'; break;
    case 'Pierna Izquierda': window.location.href = '/piernaIzquierda'; break;
    case 'Pierna Derecha': window.location.href = '/piernaDerecha'; break;
  }
}

function rotar() {
  window.location.href = '/cuerpoTrasero';
}

onMounted(async () => {
  const { default: imageMapResize } = await import('image-map-resizer');
  imageMapResize();

  document.querySelectorAll('area').forEach(area => {
    area.removeEventListener('click', clickArea);
    area.addEventListener('click', clickArea);
  });
});
</script>

<style scoped>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

.cuerpo-container {
  background-image: url('/imagenes/fondos/fondo2.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
}

.cuerpo {
  width: 250px;
  height: auto;
  backdrop-filter: blur(2px);
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
  padding: 10px;
}

.boton-rotar {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  padding: 12px 20px;
  font-size: 1.1em;
  color: aliceblue;
  background-color: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  cursor: pointer;
  transition: 0.3s;
  backdrop-filter: blur(4px);
  box-shadow: 0 3px 10px rgba(255, 255, 255, 0.2);
}

.boton-rotar:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-50%) scale(1.05);
}

.boton-rotar.izquierda {
  left: 40px;
}

.boton-rotar.derecha {
  right: 40px;
}
</style>