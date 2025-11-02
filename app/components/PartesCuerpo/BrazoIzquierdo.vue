<template>
<div class="cuerpo-container">
  <div class="seccion izquierda">
    <h2>Información</h2>
    <div class="contenido-scroll">
      <div v-for="(section, index) in secciones" :key="index">
        <h3>{{ section.title }}</h3>
        <p>{{ section.content }}</p>
      </div>
    </div>
  </div>

  <div class="contenido-central">
    <h1 class="titulo">Brazo Izquierdo</h1>
    <img src="/imagenes/cuerpo/brazoIzq.png" alt="Brazo Izquierdo" class="cuerpo" />
  </div>

  <div class="seccion derecha">
    <h2>Multimedia</h2>
    <div class="contenido-scroll">
      <div v-for="(media, index) in multimedia" :key="index" class="media-item">
        <img v-if="media.type === 'img'" :src="media.url" class="media" />
        <video v-else-if="media.type === 'video'" controls :src="media.url" class="media" />
        <img v-else-if="media.type === 'gif'" :src="media.url" class="media" />
      </div>
    </div>
  </div>
</div>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const regresar = () => {
  router.push('/cuerpoFrontal')
}

const secciones = ref([]);
const files = [
  'brazoIzq1.jpg',
  'brazoIzq2.jpg',
  'brazoIzq3.jpg'
];

const multimedia = ref(
  files.map(f => {
    const ext = f.split('.').pop().toLowerCase();
    let type = 'img';
    if(ext === 'mp4' || ext === 'webm') type = 'video';
    else if(ext === 'gif') type = 'gif';

    return { url: `/imagenes/multimedia/${f}`, type };
  })
);


onMounted(async () => {
  const res = await fetch('https://docs.google.com/document/d/e/2PACX-1vTb2asxhvBXICHGgTAj0OWFhAk2mKBzT-0uugJSob-5UWfwTDRepYdbAJTx9N0qUfIzAnKXy5_QzV4X/pub');
  const html = await res.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const h2s = doc.querySelectorAll('h2');
  
  h2s.forEach(h2 => {
    const content = [];
    let next = h2.nextElementSibling;
    while (next && next.tagName !== 'H2') {
      content.push(next.innerText);
      next = next.nextElementSibling;
    }

    secciones.value.push({
      title: h2.innerText,
      content: content.join('\n')
    });
  });
});
</script>


<style scoped>
.cuerpo-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  padding: 40px;
  height: 100vh;
  background-image: url('/imagenes/fondos/fondo2.jpg');
  background-size: cover;
  background-position: center;
  box-sizing: border-box;
}

.seccion {
  width: 25%;
  height: 85vh;
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(5px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  overflow-y: auto;
  padding: 20px;
  color: aliceblue;
}

.seccion h2 {
  text-align: center;
  margin-bottom: 15px;
  font-family: 'Poppins', sans-serif;
}

.seccion h3 {
  margin-top: 15px;
  margin-bottom: 5px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
}

.contenido-scroll {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 10px;
}

.contenido-scroll::-webkit-scrollbar {
  width: 6px;
}

.contenido-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 10px;
}

.contenido-central {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  padding-top: 0px;
}


.titulo {
  font-size: 3em;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  color: aliceblue;
  text-shadow: 2px 2px 6px rgba(0,0,0,0.5);
  margin: 0 0 20px 0;
}

.cuerpo {
  width: 180px;
  height: auto;
  backdrop-filter: blur(2px);
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
}

.media {
  width: 100%;
  border-radius: 10px;
  margin-bottom: 10px;
  box-shadow: 0 4px 10px rgba(255,255,255,0.2);
}
</style>