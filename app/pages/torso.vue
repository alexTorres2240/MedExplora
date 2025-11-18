<template>
  <div ref="container" class="viewer" :class="{ 'menu-abierto': menuAbierto}">
    <div class="bar top-bar">
      <div class="return-icon" @click="volver">⬅</div>
      <div class="menu-icon" @click="menuAbierto = !menuAbierto">☰</div>
    </div>

     <div class="info-panel">
        <h2>Torso</h2>
        <p>Haz clic en una parte del torso para explorar sus funciones y características anatómicas.</p>
        <div class="info-details">
            <p><strong>Estado:</strong> Interactivo</p>
            <p><strong>Fuente:</strong> Modelo Torso.glb</p>
            <p><strong>Versión:</strong> 1.0.2</p>
        </div>
    </div>

    <transition name="slide">
      <div v-if="menuAbierto" class="side-menu">
        <ul>
          <li @click="irA('glosario')">📓 Glosario</li>
          <li @click="irA('bibliografia')">📚 Bibliografía</li>
          <li @click="irA('creditos')">👥 Créditos</li>
          <li @click="irA('')">🚪 Cerrar sesión</li>
        </ul>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const parteSeleccionada = ref(null)
const container = ref(null)
const loading = ref(true)
const menuAbierto = ref(false)

const volver = () => {
    router.push('/inicio')
}

const irA = (seccion) => {
  console.log(`Navegar a: ${seccion}`)
  router.push(`/${seccion}`)
  menuAbierto.value = false
}

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

  scene = new Scene()
  scene.background = new Color(0xf2f2f2)
  const width = window.innerWidth
  const height = window.innerHeight
  camera = new PerspectiveCamera(45, width / height, 0.1, 1000)
  camera.position.set(0, 1.6, 3)

  renderer = new WebGLRenderer({ antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio || 1)
  renderer.outputEncoding = THREE.sRGBEncoding
  container.value.appendChild(renderer.domElement)

  const ambient = new AmbientLight(0xffffff, 0.6)
  scene.add(ambient)
  const dir = new DirectionalLight(0xffffff, 1.0)
  dir.position.set(5, 10, 7.5)
  scene.add(dir)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(0, 1, 0)
  controls.update()

  const loader = new GLTFLoader()
  loader.load(
    '/models/Torso.glb',
    (gltf) => {
      const model = gltf.scene

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

      console.log('--- Jerarquía del modelo ---')
      model.traverse((obj) => {
        if (obj.isMesh) {
          const nombre = obj.name.toLowerCase()
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

  renderer.domElement.addEventListener('pointerdown', onClick)

  function animate() {
    animationId = requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
  }
  animate()

  function onWindowResize() {
    const w = window.innerWidth
    const h = window.innerHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  }
  window.addEventListener('resize', onWindowResize)

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
  top: 25px;
  left: 270px;
  width: calc(100% - 260px);
  height: calc(100vh - 45px);
  background: #111;
  overflow: hidden;
  transition: left 0.3s ease;
}

.viewer.menu-abierto {
  left: 155px;
}

.bar{
  position: fixed;
  top: 0;
  left: 0;
  width: 99%;
  height: 45px;
  background: #00723F;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  box-shadow: 0 0 8px rgba(0,0,0,0.4);
  z-index: 20000;
}

.menu-icon{
  font-size: 26px;
  color: #fff;
  cursor: pointer;
  line-height: 1;
  user-select: none;
}

.return-icon{
  font-size: 26px;
  color: #fff;
  cursor: pointer;
  line-height: 1;
  user-select: none;
}


.side-menu {
  position: fixed;
  top: 0;
  right: 0;
  width: 240px;
  height: 100vh;
  background: #DD971A;
  color: #fff;
  box-shadow: 2px 0 10px #B08208;
  padding-top: 60px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
}

.side-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.side-menu li {
  padding: 15px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  cursor: pointer;
  transition: background 0.3s;
}

.side-menu li:hover {
  background: rgba(255, 255, 255, 0.1);
}

.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from, .slide-leave-to {
  transform: translateX(100%);
}

.info-panel {
  position: fixed;
  top: 45px;
  left: 0;
  width: 500px;
  height: calc(100vh - 45px);
  background: #024731;
  color: #fff;
  padding: 25px 20px;
  box-shadow: 4px 0 12px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  backdrop-filter: blur(8px);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 15000;
}

.info-panel h2 {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #fff;
}

.info-panel p {
  font-size: 15px;
  line-height: 1.5;
  margin-bottom: 10px;
}

.info-details {
  margin-top: 20px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.info-details p {
  font-size: 14px;
  color: #ddd;
}

</style>