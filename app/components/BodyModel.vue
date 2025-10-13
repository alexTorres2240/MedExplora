<!-- components/BodyModel.vue -->
<template>
  <div ref="container" class="viewer">
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const container = ref(null)
const loading = ref(true)

let renderer = null
let scene = null
let camera = null
let controls = null
let animationId = null

onMounted(async () => {
  // Cargar three y utilidades en tiempo de ejecución (evita SSR)
  const THREE = await import('three')
  const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')
  const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js')

  const { Scene, PerspectiveCamera, WebGLRenderer, AmbientLight, DirectionalLight, Color, Box3, Vector3 } = THREE

  // Crear escena
  scene = new Scene()
  scene.background = new Color(0xf2f2f2)

  // Cámara
  const rect = container.value.getBoundingClientRect()
  const width = window.innerWidth
  const height = window.innerHeight
  camera = new PerspectiveCamera(45, width / height, 0.1, 1000)
  camera.position.set(0, 1.6, 3)

  // Renderer
  renderer = new WebGLRenderer({ antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio || 1)
  renderer.outputEncoding = THREE.sRGBEncoding
  container.value.appendChild(renderer.domElement)

  // Luces
  const ambient = new AmbientLight(0xffffff, 0.6)
  scene.add(ambient)
  const dir = new DirectionalLight(0xffffff, 1.0)
  dir.position.set(5, 10, 7.5)
  scene.add(dir)

  // Controles
  controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(0, 1, 0)
  controls.update()

  // Cargar GLTF
  const loader = new GLTFLoader()
  loader.load(
    '/models/scene.gltf',
    (gltf) => {
      const model = gltf.scene
      // Centrar y escalar automáticamente (bastante útil para modelos arbitrarios)
      const box = new Box3().setFromObject(model)
      const size = box.getSize(new Vector3())
      const center = box.getCenter(new Vector3())
      const maxDim = Math.max(size.x, size.y, size.z)
      const scale = (maxDim > 0) ? (2 / maxDim) : 1
      model.scale.set(scale, scale, scale)
      // re-centrar
      model.position.x -= center.x * scale
      model.position.y -= center.y * scale
      model.position.z -= center.z * scale
      model.position.y += 1

      scene.add(model)
      loading.value = false
    },
    (xhr) => {
      // progreso opcional: xhr.loaded / xhr.total
    },
    (error) => {
      console.error('Error cargando modelo GLTF:', error)
      loading.value = false
    }
  )

  // Animación
  function animate() {
    animationId = requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
  }
  animate()

  // Responsivo
  function onWindowResize() {
    const w = window.innerWidth
    const h = window.innerHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  }
  window.addEventListener('resize', onWindowResize)

  // cleanup
  onBeforeUnmount(() => {
    cancelAnimationFrame(animationId)
    window.removeEventListener('resize', onWindowResize)
    if (controls) controls.dispose()
    if (renderer) {
      // dispose geometries/materials
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
  width: 100vw;
  height: 100vh;
  background: #111;
  overflow: hidden;
}
.loading {
  position: absolute;
  z-index: 5;
  color: white;
  font-weight: bold;
}
</style>


