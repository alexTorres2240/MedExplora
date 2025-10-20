<template>
  <div class="container">
    <header>
      <h1>Cuerpo Humano Interactivo - 3D</h1>
      <p class="description">
        Modelo 3D del cuerpo humano con torso transparente y órganos internos
      </p>
    </header>
    
    <div class="content-area">
      <div class="human-body">
        <h2 class="body-title">Modelo 3D Anatómico</h2>
        <div ref="container" class="torso-3d-container">
          <div class="controls">
            <button @click="resetView" class="control-btn">Reset Vista</button>
            <button @click="toggleBody" class="control-btn">
              {{ showBody ? 'Ocultar Cuerpo' : 'Mostrar Cuerpo' }}
            </button>
            <button @click="toggleOrgans" class="control-btn">
              {{ showOrgans ? 'Ocultar Órganos' : 'Mostrar Órganos' }}
            </button>
            <button @click="toggleRotation" class="control-btn">
              {{ autoRotate ? 'Pausar Rotación' : 'Rotar Automático' }}
            </button>
          </div>
          <div class="loading" v-if="loading">
            {{ loadingProgress > 0 ? `Cargando modelo... ${loadingProgress}%` : 'Cargando modelo 3D...' }}
          </div>
          <div class="instructions" v-else>
            <p>🖱️ Arrastra para rotar • 🔍 Rueda para zoom • 👆 Click en órganos</p>
          </div>
        </div>
      </div>
      
      <div class="info-panel">
        <h2 class="info-title">{{ currentOrganInfo?.name || 'Sistema Anatómico Humano' }}</h2>
        <div class="info-content">
          <div v-if="!currentOrganInfo">
            <h3>Órganos Internos:</h3>
            <ul>
              <li><strong>❤️ Corazón</strong> - Sistema circulatorio</li>
              <li><strong>🫁 Pulmones</strong> - Sistema respiratorio</li>
              <li><strong>🍴 Estómago</strong> - Sistema digestivo</li>
              <li><strong>🧠 Hígado</strong> - Desintoxicación</li>
              <li><strong>🔄 Intestinos</strong> - Absorción de nutrientes</li>
              <li><strong>🦴 Columna Vertebral</strong> - Soporte estructural</li>
            </ul>
            
            <h3>Controles Interactivos:</h3>
            <ul>
              <li><strong>Arrastrar:</strong> Rotación 360° del modelo</li>
              <li><strong>Rueda del mouse:</strong> Zoom in/out</li>
              <li><strong>Click en órganos:</strong> Información detallada</li>
              <li><strong>Botones:</strong> Controlar visibilidad</li>
            </ul>

            <h3>Características:</h3>
            <ul>
              <li>Torso humano transparente</li>
              <li>Órganos internos detallados</li>
              <li>Modelo anatómicamente preciso</li>
              <li>Interfaz intuitiva</li>
            </ul>
          </div>
          
          <div v-else>
            <h3>{{ currentOrganInfo.name }}</h3>
            <p>{{ currentOrganInfo.description }}</p>
            
            <h4>Función principal:</h4>
            <p>{{ currentOrganInfo.function }}</p>
            
            <h4>Datos anatómicos:</h4>
            <ul>
              <li v-for="fact in currentOrganInfo.facts" :key="fact">{{ fact }}</li>
            </ul>

            <h4>Cuidados y salud:</h4>
            <ul>
              <li v-for="care in currentOrganInfo.careTips" :key="care">{{ care }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue'

export default {
  name: 'App'
}
</script>

<script setup>
const container = ref(null)
const loading = ref(true)
const loadingProgress = ref(0)
const showBody = ref(true)
const showOrgans = ref(true)
const autoRotate = ref(true)
const selectedOrganType = ref('')

let scene, camera, renderer, bodyModel, organsGroup, raycaster, mouse, clock
let isDragging = false
let previousMousePosition = { x: 0, y: 0 }

const organInfo = {
  'heart': {
    name: 'Corazón',
    description: 'El corazón es un órgano muscular hueco que funciona como una bomba, impulsando la sangre a través de los vasos sanguíneos del cuerpo.',
    function: 'Bombeo de sangre oxigenada a todo el organismo',
    facts: [
      'Tamaño: Similar a un puño cerrado',
      'Peso: 250-300 gramos en adultos',
      'Latidos por día: 100,000 - 115,000',
      'Volumen sanguíneo bombeado: 7,500 litros diarios'
    ],
    careTips: [
      'Ejercicio cardiovascular regular',
      'Dieta baja en grasas saturadas',
      'Control de presión arterial',
      'Evitar tabaco y alcohol en exceso'
    ]
  },
  'lung-left': {
    name: 'Pulmón Izquierdo',
    description: 'El pulmón izquierdo es más pequeño que el derecho debido al espacio ocupado por el corazón.',
    function: 'Intercambio gaseoso (oxigenación de sangre y eliminación de CO2)',
    facts: [
      'Dos lóbulos (superior e inferior)',
      'Capacidad: 2.5 - 3 litros de aire',
      'Número de alveolos: ~150 millones',
      'Superficie de intercambio: 50-70 m²'
    ],
    careTips: [
      'Ejercicios de respiración profunda',
      'Evitar exposición a contaminantes',
      'No fumar',
      'Vacunación contra influenza y neumonía'
    ]
  },
  'lung-right': {
    name: 'Pulmón Derecho',
    description: 'El pulmón derecho es más grande y tiene tres lóbulos.',
    function: 'Intercambio gaseoso y filtrado de partículas',
    facts: [
      'Tres lóbulos (superior, medio e inferior)',
      'Peso: 500-600 gramos',
      'Volumen respiratorio: 500 ml por respiración tranquila',
      'Frecuencia respiratoria: 12-20 respiraciones/minuto'
    ],
    careTips: [
      'Mantener buena postura para expansión torácica',
      'Ejercicios aeróbicos regulares',
      'Evitar ambientes con humo',
      'Controlar alergias respiratorias'
    ]
  },
  'stomach': {
    name: 'Estómago',
    description: 'Órgano muscular en forma de J que almacena y digiere los alimentos.',
    function: 'Digestión mecánica y química de alimentos',
    facts: [
      'Capacidad: 1-1.5 litros',
      'pH del jugo gástrico: 1.5-3.5',
      'Producción diaria de jugos: 2-3 litros',
      'Tiempo de vaciado: 2-4 horas'
    ],
    careTips: [
      'Comer despacio y masticar bien',
      'Evitar comidas muy picantes o ácidas',
      'No acostarse inmediatamente después de comer',
      'Manejar el estrés que afecta la digestión'
    ]
  },
  'liver': {
    name: 'Hígado',
    description: 'El hígado es el órgano interno más grande y realiza más de 500 funciones metabólicas esenciales.',
    function: 'Desintoxicación, metabolismo, almacenamiento y producción de bilis',
    facts: [
      'Peso: 1.4-1.6 kg',
      'Recibe 1.5 litros de sangre por minuto',
      'Capacidad de regeneración: hasta 75%',
      'Almacena vitaminas A, D, E, K y B12'
    ],
    careTips: [
      'Limitar consumo de alcohol',
      'Dieta equilibrada baja en grasas',
      'Evitar automedicación',
      'Vacunación contra hepatitis'
    ]
  },
  'intestines': {
    name: 'Intestinos',
    description: 'Sistema tubular que se extiende desde el estómago hasta el ano.',
    function: 'Absorción de nutrientes, agua y formación de heces',
    facts: [
      'Longitud total: 7-8 metros',
      'Intestino delgado: 6-7 metros',
      'Intestino grueso: 1.5 metros',
      'Superficie de absorción: 200-300 m²'
    ],
    careTips: [
      'Consumir suficiente fibra',
      'Mantenerse hidratado',
      'Ejercicio físico regular',
      'Incluir probióticos en la dieta'
    ]
  },
  'spine': {
    name: 'Columna Vertebral',
    description: 'Estructura ósea flexible que proporciona soporte estructural.',
    function: 'Soporte, protección de médula espinal y movilidad',
    facts: [
      '33 vértebras en total',
      '7 cervicales, 12 torácicas, 5 lumbares, 5 sacras, 4 coccígeas',
      'Longitud: 61-71 cm en adultos',
      'Curvaturas naturales: cervical, torácica, lumbar, sacra'
    ],
    careTips: [
      'Mantener postura correcta al sentarse',
      'Ejercicios de fortalecimiento abdominal',
      'Evitar cargar pesos excesivos',
      'Usar calzado adecuado'
    ]
  }
}

const currentOrganInfo = computed(() => {
  return selectedOrganType.value ? organInfo[selectedOrganType.value] : null
})

onMounted(async () => {
  console.log('Iniciando aplicación 3D...')
  
  if (!container.value) {
    console.error('Container no encontrado')
    return
  }
  
  try {
    const THREE = await import('three')
    const GLTFLoaderModule = await import('three/examples/jsm/loaders/GLTFLoader.js')
    const GLTFLoader = GLTFLoaderModule.GLTFLoader
    await initThreeJS(THREE, GLTFLoader)
  } catch (error) {
    console.error('Error cargando Three.js:', error)
    loading.value = false
  }
})

onUnmounted(() => {
  if (renderer) {
    renderer.dispose()
  }
})

const initThreeJS = async (THREE, GLTFLoader) => {
  if (!container.value) return

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x1a2a6c)

  camera = new THREE.PerspectiveCamera(
    45,
    container.value.clientWidth / container.value.clientHeight,
    0.1,
    1000
  )
  camera.position.set(0, 0, 12)

  renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true 
  })
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container.value.appendChild(renderer.domElement)

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)

  const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight1.position.set(5, 5, 5)
  scene.add(directionalLight1)

  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4)
  directionalLight2.position.set(-5, -5, -5)
  scene.add(directionalLight2)

  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()
  clock = new THREE.Clock()

  await loadBodyModel(THREE, GLTFLoader)
  createOrgans(THREE)
  setupEventListeners()
  animate()
}

const loadBodyModel = async (THREE, GLTFLoader) => {
  const loader = new GLTFLoader()
  
  loader.load(
    '/scene.gltf',
    (gltf) => {
      bodyModel = gltf.scene
      bodyModel.position.set(0, -6, 0)
      bodyModel.scale.set(2, 2, 2)
      
      bodyModel.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.transparent = true
          child.material.opacity = 0.3
          child.material.color.setHex(0x88ccff)
        }
      })
      
      scene.add(bodyModel)
      loading.value = false
    },
    (progress) => {
      if (progress.total > 0) {
        loadingProgress.value = Math.round((progress.loaded / progress.total) * 100)
      }
    },
    (error) => {
      console.error('Error cargando el modelo GLTF:', error)
      loading.value = false
      createBasicBody(THREE)
    }
  )
}

const createBasicBody = (THREE) => {
  const bodyGroup = new THREE.Group()

  const torsoGeometry = new THREE.CylinderGeometry(1.2, 1, 3, 16)
  const torsoMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x88ccff,
    transparent: true,
    opacity: 0.3
  })
  const torso = new THREE.Mesh(torsoGeometry, torsoMaterial)
  bodyGroup.add(torso)

  const shoulderGeometry = new THREE.SphereGeometry(1.5, 16, 16)
  const shoulderMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x88ccff,
    transparent: true,
    opacity: 0.3
  })
  const shoulders = new THREE.Mesh(shoulderGeometry, shoulderMaterial)
  shoulders.position.y = 1.5
  shoulders.scale.set(1, 0.3, 1)
  bodyGroup.add(shoulders)

  bodyModel = bodyGroup
  scene.add(bodyModel)
}

const createOrgans = (THREE) => {
  organsGroup = new THREE.Group()

  const heartGeometry = new THREE.SphereGeometry(0.25, 16, 16)
  const heartMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xff4444,
    transparent: true,
    opacity: 0.9
  })
  const heart = new THREE.Mesh(heartGeometry, heartMaterial)
  heart.position.set(0.2, 0.5, 0.3)
  heart.name = 'heart'
  heart.userData = { organType: 'heart' }
  organsGroup.add(heart)

  const lungLeftGeometry = new THREE.SphereGeometry(0.35, 16, 16)
  const lungMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x44aaff,
    transparent: true,
    opacity: 0.9
  })
  
  const lungLeft = new THREE.Mesh(lungLeftGeometry, lungMaterial)
  lungLeft.position.set(-0.6, 0.6, 0.2)
  lungLeft.scale.set(1.2, 0.8, 0.7)
  lungLeft.name = 'lung-left'
  lungLeft.userData = { organType: 'lung-left' }
  organsGroup.add(lungLeft)
  
  const lungRightGeometry = new THREE.SphereGeometry(0.35, 16, 16)
  const lungRight = new THREE.Mesh(lungRightGeometry, lungMaterial)
  lungRight.position.set(0.6, 0.6, 0.2)
  lungRight.scale.set(1.2, 0.8, 0.7)
  lungRight.name = 'lung-right'
  lungRight.userData = { organType: 'lung-right' }
  organsGroup.add(lungRight)

  const stomachGeometry = new THREE.SphereGeometry(0.3, 16, 16)
  const stomachMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xffaa44,
    transparent: true,
    opacity: 0.9
  })
  const stomach = new THREE.Mesh(stomachGeometry, stomachMaterial)
  stomach.position.set(0, 0, 0.4)
  stomach.scale.set(1.3, 0.8, 0.6)
  stomach.name = 'stomach'
  stomach.userData = { organType: 'stomach' }
  organsGroup.add(stomach)

  const liverGeometry = new THREE.SphereGeometry(0.25, 16, 16)
  const liverMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x88ff88,
    transparent: true,
    opacity: 0.9
  })
  const liver = new THREE.Mesh(liverGeometry, liverMaterial)
  liver.position.set(-0.4, 0.1, 0.4)
  liver.scale.set(1.3, 0.7, 0.7)
  liver.name = 'liver'
  liver.userData = { organType: 'liver' }
  organsGroup.add(liver)

  const intestinesGeometry = new THREE.TorusGeometry(0.35, 0.08, 16, 32)
  const intestinesMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xffd54f,
    transparent: true,
    opacity: 0.9
  })
  const intestines = new THREE.Mesh(intestinesGeometry, intestinesMaterial)
  intestines.position.set(0, -0.5, 0.3)
  intestines.rotation.x = Math.PI / 2
  intestines.name = 'intestines'
  intestines.userData = { organType: 'intestines' }
  organsGroup.add(intestines)

  const spineGeometry = new THREE.CylinderGeometry(0.08, 0.08, 2.5, 16)
  const spineMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xffffff,
    transparent: true,
    opacity: 0.8
  })
  const spine = new THREE.Mesh(spineGeometry, spineMaterial)
  spine.position.set(0, 0, -0.2)
  spine.name = 'spine'
  spine.userData = { organType: 'spine' }
  organsGroup.add(spine)

  scene.add(organsGroup)
}

const setupEventListeners = () => {
  const canvas = renderer.domElement

  canvas.addEventListener('mousedown', onMouseDown)
  canvas.addEventListener('mousemove', onMouseMove)
  canvas.addEventListener('mouseup', onMouseUp)
  canvas.addEventListener('wheel', onMouseWheel)
  canvas.addEventListener('click', onCanvasClick)

  window.addEventListener('resize', onWindowResize)
}

const onMouseDown = (event) => {
  isDragging = true
  previousMousePosition = {
    x: event.clientX,
    y: event.clientY
  }
}

const onMouseMove = (event) => {
  if (!isDragging || !bodyModel) return

  const deltaMove = {
    x: event.clientX - previousMousePosition.x,
    y: event.clientY - previousMousePosition.y
  }

  bodyModel.rotation.y += deltaMove.x * 0.01
  bodyModel.rotation.x += deltaMove.y * 0.01

  if (organsGroup) {
    organsGroup.rotation.y += deltaMove.x * 0.01
    organsGroup.rotation.x += deltaMove.y * 0.01
  }

  previousMousePosition = {
    x: event.clientX,
    y: event.clientY
  }
}

const onMouseUp = () => {
  isDragging = false
}

const onMouseWheel = (event) => {
  event.preventDefault()
  camera.position.z += event.deltaY * 0.01
  camera.position.z = Math.max(5, Math.min(20, camera.position.z))
}

const onCanvasClick = (event) => {
  if (!container.value || !organsGroup) return

  const rect = container.value.getBoundingClientRect()
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  raycaster.setFromCamera(mouse, camera)

  const intersects = raycaster.intersectObjects(organsGroup.children, true)

  if (intersects.length > 0) {
    const clickedOrgan = intersects[0].object
    const organType = clickedOrgan.userData?.organType
    
    if (organType && organInfo[organType]) {
      selectedOrganType.value = organType
      
      if (clickedOrgan.material && clickedOrgan.material.emissive) {
        clickedOrgan.material.emissive.setHex(0x333333)
        setTimeout(() => {
          if (clickedOrgan.material && clickedOrgan.material.emissive) {
            clickedOrgan.material.emissive.setHex(0x000000)
          }
        }, 300)
      }
    }
  } else {
    selectedOrganType.value = ''
  }
}

const onWindowResize = () => {
  if (!container.value || !camera || !renderer) return

  camera.aspect = container.value.clientWidth / container.value.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
}

const resetView = () => {
  if (bodyModel && camera) {
    bodyModel.rotation.x = 0
    bodyModel.rotation.y = 0
    bodyModel.rotation.z = 0
    if (organsGroup) {
      organsGroup.rotation.x = 0
      organsGroup.rotation.y = 0
      organsGroup.rotation.z = 0
    }
    camera.position.set(0, 0, 12)
  }
  selectedOrganType.value = ''
}

const toggleBody = () => {
  showBody.value = !showBody.value
  if (bodyModel) {
    bodyModel.visible = showBody.value
  }
}

const toggleOrgans = () => {
  showOrgans.value = !showOrgans.value
  if (organsGroup) {
    organsGroup.visible = showOrgans.value
  }
}

const toggleRotation = () => {
  autoRotate.value = !autoRotate.value
}

const animate = () => {
  requestAnimationFrame(animate)

  if (!isDragging && autoRotate.value && bodyModel) {
    bodyModel.rotation.y += 0.005
    if (organsGroup) {
      organsGroup.rotation.y += 0.005
    }
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
  color: white;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

header {
  text-align: center;
  margin-bottom: 30px;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.description {
  font-size: 1.1rem;
  max-width: 800px;
  margin: 0 auto 20px;
  line-height: 1.6;
  opacity: 0.9;
}

.content-area {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
}

.human-body {
  flex: 1;
  min-width: 300px;
  max-width: 600px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.body-title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.5rem;
  color: #ffcc00;
}

.torso-3d-container {
  width: 100%;
  height: 500px;
  border-radius: 15px;
  overflow: hidden;
  position: relative;
  background: linear-gradient(135deg, #1a2a6c 0%, #b21f1f 50%, #fdbb2d 100%);
}

.controls {
  position: absolute;
  top: 15px;
  left: 15px;
  z-index: 10;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.control-btn {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.loading, .instructions {
  position: absolute;
  color: white;
  text-align: center;
}

.loading {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.2rem;
}

.instructions {
  top: auto;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.9rem;
  opacity: 0.8;
}

.info-panel {
  flex: 1;
  min-width: 300px;
  max-width: 500px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  padding: 25px;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.info-title {
  font-size: 1.8rem;
  margin-bottom: 15px;
  color: #ffcc00;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 10px;
}

.info-content {
  line-height: 1.7;
}

.info-content h3 {
  margin: 20px 0 10px;
  color: #4fc3f7;
}

.info-content h4 {
  margin: 15px 0 8px;
  color: #69f0ae;
}

.info-content ul {
  margin-left: 20px;
  margin-bottom: 15px;
}

.info-content li {
  margin-bottom: 8px;
}

@media (max-width: 768px) {
  .content-area {
    flex-direction: column;
  }
  
  .human-body, .info-panel {
    max-width: 100%;
  }
  
  .controls {
    flex-direction: column;
  }
}
</style>