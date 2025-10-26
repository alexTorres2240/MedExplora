<!-- components/BodyModel.vue -->
<template>
  <div ref="container" class="viewer">
    <!-- Barra superior -->
    <div class="bar top-bar">
      <div class="menu-icon">☰</div>
    </div>

    <!-- Ventana emergente -->
    <PartInfoModal
      v-if="parteSeleccionada"
      :parte="parteSeleccionada"
      @cerrar="parteSeleccionada = null"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import PartInfoModal from './PartInfoModal.vue'

const parteSeleccionada = ref(null)
const container = ref(null)
const loading = ref(true)

let renderer = null
let scene = null
let camera = null
let controls = null
let animationId = null

onMounted(async () => {
  const THREE = await import('three')
  const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')
  const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js')
  const { Scene, PerspectiveCamera, WebGLRenderer, AmbientLight, DirectionalLight, Color, Box3, Vector3, Raycaster, Vector2 } = THREE

  // --- Scene & Camera ---
  scene = new Scene()
  scene.background = new Color(0x2C2C2C) // Cambiar fondo
  const width = window.innerWidth
  const height = window.innerHeight
  camera = new PerspectiveCamera(45, width / height, 0.1, 1000)
  camera.position.set(0, 1.6, 3)

  // --- Renderer ---
  renderer = new WebGLRenderer({ antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio || 1)
  renderer.outputEncoding = THREE.sRGBEncoding
  container.value.appendChild(renderer.domElement)

  // --- Lights ---
  const ambient = new AmbientLight(0xffffff, 0.6)
  scene.add(ambient)
  const dir = new DirectionalLight(0xffffff, 1.0)
  dir.position.set(5, 10, 7.5)
  scene.add(dir)

  // --- Controls ---
  controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(0, 1, 0)
  controls.update()

  // --- Load GLTF ---
  const loader = new GLTFLoader()
  loader.load(
    '/models/Cuerpo.glb',
    (gltf) => {
      const model = gltf.scene

      // Centrar modelo automáticamente
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

      // --- Mostrar jerarquía (ver nombres del GLTF) ---
      console.log('--- Jerarquía del modelo ---')
      model.traverse((obj) => {
        if (obj.isMesh) {
          const nombre = obj.name.toLowerCase() // minúsculas para todo
          // Asignamos parte en minúsculas
          if (nombre.includes('brazoizquierdo')) obj.userData.parte = 'brazoi'
          else if (nombre.includes('brazoderecho')) obj.userData.parte = 'brazod'
          else if (nombre.includes('cabeza')) obj.userData.parte = 'cabeza'
          else if (nombre.includes('piernaizquierda')) obj.userData.parte = 'piernai'
          else if (nombre.includes('piernaderecha')) obj.userData.parte = 'piernad'
          else if (nombre.includes('torso')) obj.userData.parte = 'torso'
          else if (nombre.includes('espalda')) obj.userData.parte = 'espalda'
        }
      })

      scene.add(model)
      loading.value = false
    },
    undefined,
    (error) => {
      console.error('Error cargando modelo GLTF:', error)
      loading.value = false
    }
  )

  // --- Raycaster ---
  const raycaster = new Raycaster()
  const mouse = new Vector2()

  function onClick(event) {
    const rect = renderer.domElement.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    mouse.set(x, y)
    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObjects(scene.children, true)
    console.log('Intersects:', intersects) // depuración
    if (intersects.length > 0) {
      const objeto = intersects[0].object
      if (objeto.userData.parte) {
        parteSeleccionada.value = objeto.userData.parte // minúsculas
        console.log('Clic en parte:', objeto.userData.parte)
      }

    }

  }

  // --- Escucha click en canvas ---
  renderer.domElement.addEventListener('pointerdown', onClick)

  // --- Animación ---
  function animate() {
    animationId = requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
  }
  animate()

  // --- Responsivo ---
  function onWindowResize() {
    const w = window.innerWidth
    const h = window.innerHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  }
  window.addEventListener('resize', onWindowResize)

  // --- Limpieza ---
  onBeforeUnmount(() => {
    cancelAnimationFrame(animationId)
    window.removeEventListener('resize', onWindowResize)
    renderer.domElement.removeEventListener('pointerdown', onClick)
    if (controls) controls.dispose()
    if (renderer) {
      scene.traverse((child) => {
        if (child.geometry) child.geometry.dispose()
        if (child.material) {
          if (Array.isArray(child.material)) child.material.forEach(m => m.dispose && m.dispose())
          else child.material.dispose && child.material.dispose()
        }
      })
      renderer.dispose()
      if (container.value && renderer.domElement) container.value.removeChild(renderer.domElement)
    }
  })
})
</script>

<style scoped>
.viewer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: #2C2C2C;
  overflow: hidden;
}

.bar{
  position: fixed;
  top: 0;
  left: 0;
  width: 99%;
  height: 45px;
  background: linear-gradient(90deg, #00ff00, #007700);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 10px;
  box-shadow: 0 0 8px rgba(0,0,0,0.4);
  z-index: 9999;
}

.menu-icon{
  font-size: 26px;
  color: #fff;
  cursor: pointer;
  line-height: 1;
  user-select: none;
}
</style>
