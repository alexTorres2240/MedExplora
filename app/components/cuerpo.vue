<template>
  <div ref="container" class="viewer" :class="{ 'menu-abierto': menuAbierto }">
    <!-- Barra superior -->
    <div class="bar top-bar">
      <div class="return-icon" @click="volver">⬅</div>
      <div class="menu-icon" @click="menuAbierto = !menuAbierto">☰</div>
    </div>

    <!-- Panel lateral -->
    <div class="info-panel">
      <h2>{{ titulo }}</h2>
      <p>{{ descripcion }}</p>
      <slot name="extra"></slot>
    </div>

    <!-- Menu lateral -->
    <transition name="slide">
      <div v-if="menuAbierto" class="side-menu">
        <ul>
          <li v-for="item in menuItems" :key="item.texto" @click="irA(item.destino)">
            {{ item.texto }}
          </li>
        </ul>            
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import PartInfoModal from '~/components/PartInfoModal.vue'

const props = defineProps({
  titulo: String,
  descripcion: String,
  modelo: String,
  version: String,
  menuItems: { type: Array, default: () => [] }
})

const router = useRouter()
const container = ref(null)
const menuAbierto = ref(false)

const volver = () => router.push('/inicio')
const irA = (ruta) => {
  if (ruta) router.push(`/${ruta}`)
  menuAbierto.value = false
}

onMounted(async () => {
  const THREE = await import('three')
  const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')
  const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js')
  const { Scene, PerspectiveCamera, WebGLRenderer, AmbientLight, DirectionalLight, Color, Box3, Vector3 } = THREE

  const scene = new Scene()
  scene.background = new Color(0xf2f2f2)

  // Calculamos tamaño restando el panel lateral (ej: 500px)
  const width = window.innerWidth - 500
  const height = window.innerHeight
  const camera = new PerspectiveCamera(45, width / height, 0.1, 1000)
  camera.position.set(0, 1.6, 3)

  const renderer = new WebGLRenderer({ antialias: true })
  renderer.setSize(width, height)
  container.value.appendChild(renderer.domElement)

  // Luces
  const ambient = new AmbientLight(0xffffff, 0.6)
  const dir = new DirectionalLight(0xffffff, 1)
  dir.position.set(5, 10, 7)
  scene.add(ambient, dir)

  // Controles
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(0, 1, 0)
  controls.update()

  // Cargar modelo
  const loader = new GLTFLoader()
  loader.load(props.modelo, (gltf) => {
    const model = gltf.scene

    // Centramos y escalamos automáticamente
    const box = new Box3().setFromObject(model)
    const size = box.getSize(new Vector3())
    const center = box.getCenter(new Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = maxDim > 0 ? 2 / maxDim : 1
    model.scale.set(scale, scale, scale)
    model.position.x -= center.x * scale
    model.position.y -= center.y * scale
    model.position.z -= center.z * scale
    model.position.y += 1

    scene.add(model)
  })

  // Animación
  function animate() {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
  }
  animate()
})
</script>

<style scoped>
.viewer {
  position: fixed;
  top: 25px;
  left: 500px; /* espacio para panel lateral */
  width: calc(100% - 500px);
  height: calc(100vh - 25px);
  background: #111;
}

.info-panel {
  position: fixed;
  top: 25px;
  left: 0;
  width: 500px;
  height: calc(100vh - 25px);
  background: #024731;
  color: #fff;
  padding: 25px 20px;
  display: flex;
  flex-direction: column;
}

.bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 25px;
  background: #00723F;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  z-index: 1000;
}
</style>
