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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const secciones = ref([])

onMounted(async () => {
  try {
    const res = await fetch(
      'https://docs.google.com/document/d/e/2PACX-1vTb2asxhvBXICHGgTAj0OWFhAk2mKBzT-0uugJSob-5UWfwTDRepYdbAJTx9N0qUfIzAnKXy5_QzV4X/pub'
    )
    const html = await res.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')

    const h2s = doc.querySelectorAll('h2')
    h2s.forEach(h2 => {
      const content = []
      let next = h2.nextElementSibling
      while (next && next.tagName !== 'H2') {
        content.push(next.innerText)
        next = next.nextElementSibling
      }

      secciones.value.push({
        title: h2.innerText,
        content: content.join('\n')
      })
    })
  } catch (error) {
    console.error('Error cargando información del documento:', error)
  }
})
</script>

<style scoped>
.cuerpo-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 40px;
  height: 100vh;
  background-image: url('/imagenes/fondos/fondo2.jpg');
  background-size: cover;
  background-position: center;
  color: aliceblue;
}

.seccion {
  width: 25%;
  height: 85vh;
  background-color: rgba(255,255,255,0.15);
  backdrop-filter: blur(5px);
  border-radius: 20px;
  overflow-y: auto;
  padding: 20px;
}

.seccion h2, .seccion h3 {
  text-align: center;
}

.contenido-scroll {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 10px;
}

.boton-regresar {
  margin-top: 10px;
  padding: 10px 25px;
  font-size: 1.1em;
  cursor: pointer;
}
.titulo {
  text-align: center;
  font-size: 3em;
}
</style>
