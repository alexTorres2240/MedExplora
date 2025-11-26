<template>
  <div class="viewer" :class="{ 'menu-abierto': menuAbierto}">
    <div ref="container" class="contenedor-3d" :class="{ oculto: seccionActiva !== null }"></div>

    <transition name="fade">
      <!-- Mostrar sección si hay seccionActiva pero no hay subseccionActiva -->
      <div v-if="seccionActiva !== null && subseccionActiva === null" class="info-layout" :class="{ 'info-compacto': menuAbierto }">
        <template v-for="(item, index) in seccionesInfo[seccionActiva].contenido" :key="index">
          <h2 v-if="item.tipo==='titulo'" v-html="item.texto"></h2>
          <p v-else-if="item.tipo==='parrafo'" v-html="item.texto"></p>
          <img v-else-if="item.tipo==='imagen'" :src="item.src" />
        </template>
      </div>

      <!-- Mostrar subsección si hay subseccionActiva -->
      <div v-else-if="subseccionActiva !== null" class="info-layout" :class="{ 'info-compacto': menuAbierto }">
        <template v-for="(item, index) in subseccionesInfo[subseccionActiva].contenido" :key="index">
          <h2 v-if="item.tipo==='titulo'" v-html="item.texto"></h2>
          <p v-else-if="item.tipo==='parrafo'" v-html="item.texto"></p>
          <img v-else-if="item.tipo==='imagen'" :src="item.src" />
        </template>
      </div>
    </transition>


    <div class="bar top-bar">
      <div class="return-icon" @click="volver">⬅</div>
      <div class="menu-icon" @click="menuAbierto = !menuAbierto">☰</div>
    </div>

    <div class="info-panel">
      <h2>Cabeza</h2>
      <p>Haz clic en una parte de la cabeza para explorar sus funciones y características anatómicas.</p>
      <div class="info-details">
        <div class="info-buttons">
          <template v-if="!modoExploracion">
            <button @click="modoExploracion=true">👨‍⚕️ Semiología de Cabeza y Cuello</button>
          </template>
          <template v-if="modoExploracion && seccionActiva===null">
            <button @click="seccionActiva='zonas'">🗂️ Subdivisiones de la Cara</button>
            <button @click="seccionActiva='cara'">👨‍🦲 Exploración General de la Cara</button>
            <button @click="seccionActiva='cuello'">💁‍♂️ Exploración General del Cuello</button>
            <button @click="volverExploracion">↩️ Volver</button>
          </template>
          <template v-if="modoExploracion && seccionActiva=='zonas'">
            <button @click="subseccionActiva='zonas.cabeza'">🧠 Cabeza</button>
            <button @click="subseccionActiva='zonas.cara'">😀 Cara</button>
            <button @click="subseccionActiva='zonas.ojos'">👀 Ojos</button>
            <button @click="subseccionActiva='zonas.oidos'">👂 Oídos</button>
            <button @click="subseccionActiva='zonas.nariz'">👃 Nariz y Senos Paranasales</button>
            <button @click="subseccionActiva='zonas.boca'">👅 Boca y Orofaringe</button>
            <button @click="subseccionActiva='zonas.cuello'">🦴 Cuello</button>
            <button @click="subseccionActiva='zonas.cervical'">🔹 Región Cervical y Supraclavicular</button>
            <button @click="subseccionActiva='zonas.resumen'">📌 Resumen de los Pares Craneales</button>
            <button @click="volverSecciones">↩️ Volver</button>
          </template>
          <template v-if="modoExploracion && seccionActiva=='cara'">
            <button @click="subseccionActiva='cara.palpacion'">✋ Palpación</button>
            <button @click="subseccionActiva='cara.craneo'">💀 Cráneo</button>
            <button @click="subseccionActiva='cara.ojos'">👀 Ojos</button>
            <button @click="subseccionActiva='cara.oidos'">👂 Oídos</button>
            <button @click="subseccionActiva='cara.nariz'">👃 Nariz</button>
            <button @click="subseccionActiva='cara.boca'">👄 Boca</button>
            <button @click="volverSecciones">↩️ Volver</button>
          </template>
          <template v-if="modoExploracion && seccionActiva=='cuello'">
            <button @click="subseccionActiva='cuello.inspeccion'">👁️ Inspección</button> <!-- Ojo para observar -->
            <button @click="subseccionActiva='cuello.palpacion'">✋ Palpación</button> <!-- Mano para tocar -->
            <button @click="subseccionActiva='cuello.ganglios'">🩸 Ganglios Linfáticos</button> <!-- Gota de sangre o célula para glándulas/linfa -->
            <button @click="volverSecciones">↩️ Volver</button> <!-- Flecha para regresar -->
          </template>
        </div>
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
const modoExploracion = ref(false)
const seccionActiva = ref(null)
const subseccionActiva = ref(null)

const volver = () => {
  router.push('/inicio')
}

const irA = (seccion) => {
  console.log("Navegar a sección multimedia:", seccion)
  seccionActiva.value = seccion
  menuAbierto.value = false
}

const seccionesInfo = {
  zonas: {
    contenido: [
      { tipo: 'titulo', texto: 'Subdivisiones de la Cara' },
      { tipo: 'parrafo', texto: 'La exploración de las diferentes zonas del cuerpo es un paso fundamental en la práctica clínica, ya que permite al profesional de la salud identificar de manera sistemática los hallazgos relevantes. Antes de iniciar, es esencial preparar al paciente y explicar el procedimiento, garantizando su comodidad y respeto. Este enfoque organizado facilita la interpretación de signos clínicos y asegura la confiabilidad de los datos obtenidos.' }
    ]
  },
  cara: {
    contenido: [
      { tipo: 'titulo', texto: 'Exploración General de la Cara' },
      { tipo: 'parrafo', texto: 'La exploración de la cara proporciona información valiosa sobre el estado general del paciente y posibles alteraciones sistémicas o locales. Para realizarla correctamente, se debe preparar al paciente y colocarle en una posición adecuada que permita la inspección y palpación de manera cómoda y respetuosa. Observar la simetría, color, movimientos y rasgos faciales es clave para detectar hallazgos clínicos significativos.' }
    ]
  },
  cuello: {
    contenido: [
      { tipo: 'titulo', texto: 'Exploración General del Cuello'},
      { tipo: 'parrafo', texto: 'La exploración del cuello permite evaluar estructuras vitales como la tráquea, tiroides, ganglios linfáticos y vasos sanguíneos importantes. Realizarla de manera sistemática garantiza que no se omitan hallazgos relevantes y facilita la correlación con síntomas del paciente. La posición correcta del paciente y la aplicación de técnicas de inspección y palpación son esenciales para un examen seguro, eficiente y respetuoso.'}
    ]
  }
}

const subseccionesInfo = {
  'zonas.cabeza': {
    contenido: [
      { tipo: 'titulo', texto: 'Cabeza' },
      { tipo: 'parrafo', texto: '<b>Inspección</b>' },
      { tipo: 'parrafo', texto: '⚫ Tamaño y forma: normocefalia, braquicefalia, dolicocefalia, micro/macrocefalia.' },
      { tipo: 'parrafo', texto: '⚫ Simetría craneal y proporción facial.' },
      { tipo: 'parrafo', texto: '⚫ Piel: color, cicatrices, lesiones, descamación.' },
      { tipo: 'parrafo', texto: '⚫ Cabello: implantación, textura, color, alopecia o seborrea.' },
      { tipo: 'parrafo', texto: '<b>Palpación</b>' },
      { tipo: 'parrafo', texto: '⚫ Cráneo: depresiones, prominencias, dolor a la presión.' },
      { tipo: 'parrafo', texto: '⚫ Cuero cabelludo: adherencias, movilidad, sensibilidad, temperatura.' },
      { tipo: 'parrafo', texto: '⚫ Cabello: textura, grosor, implantación.' },
      { tipo: 'parrafo', texto: '<b>Maniobras</b>' },
      { tipo: 'parrafo', texto: '⚫ Palpación sistemática con yemas de los dedos sobre todo el cráneo.' },
      { tipo: 'imagen', src: '/imagenes/multimedia/zonas-cabeza1.jpg'},
      { tipo: 'imagen', src: '/imagenes/multimedia/zonas-cabeza2.jpg'}
    ]
  },
  'zonas.cara': {
    contenido: [
      { tipo: 'titulo', texto: 'Cara' },
      { tipo: 'parrafo', texto: '<b>Inspección</b>' },
      { tipo: 'parrafo', texto: '⚫ Simetría facial y expresión.' },
      { tipo: 'parrafo', texto: '⚫ Facies caracterísí ticas: hipocrática, cushingoide, parkinsoniana, mixedematosa.' },
      { tipo: 'parrafo', texto: '⚫ Piel: color, edema, lesiones, cicatrices.' },
      { tipo: 'parrafo', texto: '<b>Palpación</b>' },
      { tipo: 'parrafo', texto: '⚫ Senos frontales y maxilares: dolor o crepitación.' },
      { tipo: 'parrafo', texto: '⚫ Glándulas parótidas y submandibulares: tamaño, consistencia, dolor.' },
      { tipo: 'parrafo', texto: '⚫ Articulación temporomandibular: chasquidos, limitación o desviación.' },
      { tipo: 'parrafo', texto: '<b>Percusión</b>' },
      { tipo: 'parrafo', texto: '⚫ Senos frontales y maxilares: dolor o hipersensibilidad (sinusitis).' },
      { tipo: 'parrafo', texto: '<b>Maniobras</b>' },
      { tipo: 'parrafo', texto: '⚫ Compresión bimanual de glándulas parótidas y submandibulares.' },
      { tipo: 'parrafo', texto: '⚫ Apertura y cierre bucal para evaluar articulación.' },
      { tipo: 'parrafo', texto: '<b>Pares craneales relacionados</b>' },
      { tipo: 'parrafo', texto: '⚫ V (Trigémino): Sensibilidad facial y fuerza masticatoria. Reflejo corneal.' },
      { tipo: 'parrafo', texto: '⚫ VII (Facial): Movimientos faciales, sonrisa, inflar mejillas, cierre ocular.' },
      { tipo: 'imagen', src: '/imagenes/multimedia/zonas-cara.jpg'}
    ]
  },
  'zonas.ojos': {
    contenido: [
      { tipo: 'titulo', texto: 'Ojos' },
      { tipo: 'parrafo', texto: '<b>Inspección</b>' },
      { tipo: 'parrafo', texto: '⚫ Alineación ocular, exoftalmos, estrabismo.' },
      { tipo: 'parrafo', texto: '⚫ Párpados: ptosis, edema, lesiones.' },
      { tipo: 'parrafo', texto: '⚫ Escleróticas y conjuntivas: color, hiperemia, ictericia.' },
      { tipo: 'parrafo', texto: '⚫ Pupilas: tamaño, forma, simetríaí , reflejos.' },
      { tipo: 'parrafo', texto: '<b>Palpación</b>' },
      { tipo: 'parrafo', texto: '⚫ Globo ocular: tono, sensibilidad.' },
      { tipo: 'parrafo', texto: '⚫ Regiones periorbitarias: edema o dolor.' },
      { tipo: 'parrafo', texto: '<b>Percusión</b>' },
      { tipo: 'parrafo', texto: '⚫ Senos frontales y maxilares: dolor o hipersensibilidad (sinusitis).' },
      { tipo: 'parrafo', texto: '<b>Maniobras</b>' },
      { tipo: 'parrafo', texto: '⚫ Reflejo fotomotor directo y consensual.' },
      { tipo: 'parrafo', texto: '⚫ Prueba de movimientos oculares extríní secos (en forma de H).' },
      { tipo: 'parrafo', texto: '⚫ Reflejo corneal.' },
      { tipo: 'parrafo', texto: '<b>Pares craneales relacionados</b>' },
      { tipo: 'parrafo', texto: '⚫ II (Óptico): Agudeza visual, campo visual, fondo de ojo.' },
      { tipo: 'parrafo', texto: '⚫ III (Oculomotor), IV (Troclear), VI (Abducens): Movimientos oculares, reflejo pupilar y de acomodación.'},
      { tipo: 'imagen', src: '/imagenes/multimedia/zonas-ojo.jpg'}
    ]
  },
  'zonas.oidos': {
    contenido: [
      { tipo: 'titulo', texto: 'Oídos' },
      { tipo: 'parrafo', texto: '<b>Inspección</b>' },
      { tipo: 'parrafo', texto: '⚫ Pabellón auricular: forma, implantación, lesiones.' },
      { tipo: 'parrafo', texto: '⚫ Conducto auditivo externo: cerumen, secreción, cuerpos extraños.' },
      { tipo: 'parrafo', texto: '⚫ Tímpano: color, integridad, nivel líquido (otoscopía).' },
      { tipo: 'parrafo', texto: '<b>Palpación</b>' },
      { tipo: 'parrafo', texto: '⚫ Trago y mastoides: dolor o inflamación.' },
      { tipo: 'parrafo', texto: '<b>Percusión</b>' },
      { tipo: 'parrafo', texto: '⚫ Senos frontales y maxilares: dolor o hipersensibilidad (sinusitis).' },
      { tipo: 'parrafo', texto: '<b>Maniobras</b>' },
      { tipo: 'parrafo', texto: '⚫ Tracción del pabellón (dolor → otitis externa).' },
      { tipo: 'parrafo', texto: '⚫ Percusión del mastoides (dolor → mastoiditis).' },
      { tipo: 'parrafo', texto: '⚫ Pruebas auditivas: Rinne y Weber.' },
      { tipo: 'parrafo', texto: '<b>Pares craneales relacionados</b>' },
      { tipo: 'parrafo', texto: '⚫ VIII (Vestibulococlear): audición (prueba del susurro, Rinne, Weber) y equilibrio (Romberg, marcha en tándem).' },
      { tipo: 'imagen', src: '/imagenes/multimedia/zonas-oido.jpg'}
    ]
  },
  'zonas.nariz': {
    contenido: [
      { tipo: 'titulo', texto: 'Nariz y Senos Paranasales' },
      { tipo: 'parrafo', texto: '<b>Inspección</b>' },
      { tipo: 'parrafo', texto: '⚫ Forma externa, desviación del tabique.' },
      { tipo: 'parrafo', texto: '⚫ Mucosa nasal: color, secreciones, pólipos.' },
      { tipo: 'parrafo', texto: '⚫ Permeabilidad nasal.' },
      { tipo: 'parrafo', texto: '<b>Palpación y Percusión</b>' },
      { tipo: 'parrafo', texto: '⚫ Senos frontales y maxilares: dolor, crepitación, hipersensibilidad.' },
      { tipo: 'parrafo', texto: '<b>Maniobras</b>' },
      { tipo: 'parrafo', texto: '⚫ Transiluminación de senos.' },
      { tipo: 'parrafo', texto: '⚫ Prueba de permeabilidad nasal.' },
      { tipo: 'parrafo', texto: '<b>Pares craneales relacionados</b>' },
      { tipo: 'parrafo', texto: '⚫ I (Olfatorio): Oler sustancias no irritantes, anosmia o hiposmia.' },
      { tipo: 'imagen', src: '/imagenes/multimedia/zonas-nariz.jpg'}
    ]
  },
  'zonas.boca': {
    contenido: [
      { tipo: 'titulo', texto: 'Boca y Orofaringe' },
      { tipo: 'parrafo', texto: '<b>Inspección</b>' },
      { tipo: 'parrafo', texto: '⚫ Labios, mucosa oral, lengua, dientes, encías.' },
      { tipo: 'parrafo', texto: '⚫ Amígdalas: color, tamaño, exudado.' },
      { tipo: 'parrafo', texto: '⚫ Paladar y úvula: movilidad.' },
      { tipo: 'parrafo', texto: '<b>Palpación</b>' },
      { tipo: 'parrafo', texto: '⚫ Lengua: nódulos, induración.' },
      { tipo: 'parrafo', texto: '⚫ Glándulas salivales: tamaño, consistencia, dolor.' },
      { tipo: 'parrafo', texto: '<b>Maniobras</b>' },
      { tipo: 'parrafo', texto: '⚫ Depresor lingual para observar orofaringe.' },
      { tipo: 'parrafo', texto: '⚫ Reflejo nauseoso (de Guttmann).' },
      { tipo: 'parrafo', texto: '⚫ Evaluar reflejo del velo del paladar.' },
      { tipo: 'parrafo', texto: '<b>Pares craneales relacionados</b>' },
      { tipo: 'parrafo', texto: '⚫ IX (Glosofaríní geo): reflejo nauseoso, gusto posterior, deglución.' },
      { tipo: 'parrafo', texto: '⚫ X (Vago): movilidad del paladar, voz.' },
      { tipo: 'parrafo', texto: '⚫ XII (Hipogloso): movimientos de la lengua.' },
    ]
  },
  'zonas.cuello': {
    contenido: [
      { tipo: 'titulo', texto: 'Cuello' },
      { tipo: 'parrafo', texto: '<b>Inspección</b>' },
      { tipo: 'parrafo', texto: '⚫ Simetría, masas, deformidades, movilidad.' },
      { tipo: 'parrafo', texto: '⚫ Piel: color, cicatrices, pulsaciones anómalas.' },
      { tipo: 'parrafo', texto: '<b>Palpación</b>' },
      { tipo: 'parrafo', texto: '⚫ Ganglios linfáticos: tamaño, consistencia, movilidad, dolor' },
      { tipo: 'parrafo', texto: '⚫ Tiroides: tamaño, nódulos, movilidad con deglución.' },
      { tipo: 'parrafo', texto: '⚫ Tráquea: centración y desplazamientos.' },
      { tipo: 'parrafo', texto: '<b>Auscultación</b>' },
      { tipo: 'parrafo', texto: '⚫ Arterias carótidas: soplos (estenosis).' },
      { tipo: 'parrafo', texto: '⚫ Tiroides: soplo por hipervascularización.' },
      { tipo: 'parrafo', texto: '<b>Maniobras</b>' },
      { tipo: 'parrafo', texto: '⚫ Lahey, Crile, Pizzillo y deglución.' },
      { tipo: 'parrafo', texto: '<b>Pares craneales relacionados</b>' },
      { tipo: 'parrafo', texto: '⚫ XI (Accesorio espinal): movimiento del esternocleidomastoideo y trapecio contra resistencia.' },
      { tipo: 'imagen', src: '/imagenes/multimedia/zonas-cuello.jpg'}
    ]
  },
  'zonas.cervical': {
    contenido: [
      { tipo: 'titulo', texto: 'Región Cervical y Supraclavicular' },
      { tipo: 'parrafo', texto: '<b>Palpación</b>' },
      { tipo: 'parrafo', texto: '⚫ Fosas supraclaviculares: ganglio de Virchow.' },
      { tipo: 'parrafo', texto: '⚫ Músculos cervicales: contracturas, dolor.' },
      { tipo: 'parrafo', texto: '<b>Maniobras</b>' },
      { tipo: 'parrafo', texto: '⚫ Palpación bimanual profunda.' },
      { tipo: 'parrafo', texto: '⚫ Maniobra de Valsalva.' },
    ]
  },
  'zonas.resumen': {
    contenido: [
      { tipo: 'titulo', texto: 'Resumen de los Pares Craneales' },
      { tipo: 'imagen', src: '/imagenes/multimedia/zonas-resumen1.jpg'},
      { tipo: 'imagen', src: '/imagenes/multimedia/zonas-resumen2.jpg'}
    ]
  },
  'cara.palpacion': {
    contenido: [
      { tipo: 'titulo', texto: 'Palpación' },
      { tipo: 'imagen', src: '/imagenes/multimedia/cara-palpacion1.jpg'},
      { tipo: 'imagen', src: '/imagenes/multimedia/cara-palpacion2.jpg'},
    ]
  },
  'cara.craneo': {
    contenido: [
      { tipo: 'titulo', texto: 'Cráneo' },
      { tipo: 'imagen', src: '/imagenes/multimedia/cara-craneo1.jpg'},
      { tipo: 'imagen', src: '/imagenes/multimedia/cara-craneo2.jpg'},
      { tipo: 'imagen', src: '/imagenes/multimedia/cara-craneo3.jpg'},
      { tipo: 'imagen', src: '/imagenes/multimedia/cara-craneo4.jpg'},
      { tipo: 'imagen', src: '/imagenes/multimedia/cara-craneo5.jpg'},
      { tipo: 'imagen', src: '/imagenes/multimedia/cara-craneo6.jpg'},
    ]
  },
  'cara.ojos': {
    contenido: [
      { tipo: 'titulo', texto: 'Ojos' },
      { tipo: 'imagen', src: '/imagenes/multimedia/cara-ojos1.jpg'},
      { tipo: 'imagen', src: '/imagenes/multimedia/cara-ojos2.jpg'},
    ]
  },
  'cara.oidos': {
    contenido: [
      { tipo: 'titulo', texto: 'Oídos' },
      { tipo: 'imagen', src: '/imagenes/multimedia/cara-oidos1.jpg'},
      { tipo: 'imagen', src: '/imagenes/multimedia/cara-oidos2.jpg'},
    ]
  },
  'cara.nariz': {
    contenido: [
      { tipo: 'titulo', texto: 'Nariz' },
      { tipo: 'imagen', src: '/imagenes/multimedia/cara-nariz1.jpg'},
      { tipo: 'imagen', src: '/imagenes/multimedia/cara-nariz2.jpg'},
    ]
  },
  'cara.boca': {
    contenido: [
      { tipo: 'titulo', texto: 'Boca' },
      { tipo: 'imagen', src: '/imagenes/multimedia/cara-boca1.jpg'},
      { tipo: 'imagen', src: '/imagenes/multimedia/cara-boca2.jpg'},
    ]
  },
  'cuello.inspeccion': {
    contenido: [
      { tipo: 'titulo', texto: 'Inspección' },
      { tipo: 'imagen', src: '/imagenes/multimedia/cuello-inspeccion.jpg'}
    ]
  },
  'cuello.palpacion': {
    contenido: [
      { tipo: 'titulo', texto: 'Palpación' },
      { tipo: 'imagen', src: '/imagenes/multimedia/cuello-palpacion.jpg'}
    ]
  },
  'cuello.ganglios': {
    contenido: [
      { tipo: 'titulo', texto: 'Ganglios Linfático' },
      { tipo: 'imagen', src: '/imagenes/multimedia/cuello-canalios1.jpg'},
      { tipo: 'imagen', src: '/imagenes/multimedia/cuello-canalios2.jpg'}
    ]
  },
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
  scene.background = null   // quitar color gris

  const width = window.innerWidth
  const height = window.innerHeight

  camera = new PerspectiveCamera(45, width / height, 0.1, 1000)
  camera.position.set(0, 1.6, 3)

  renderer = new WebGLRenderer({
    antialias: true,
    alpha: true        // canvas transparente
  })
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
    '/models/Cabeza.glb',
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
    console.log('Intersects:', intersects)
    if (intersects.length > 0) {
      const objeto = intersects[0].object
      if (objeto.userData.parte) {
        parteSeleccionada.value = objeto.userData.parte
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

const volverExploracion = () => {
  modoExploracion.value = false
  seccionActiva.value = null
}

const volverSecciones = () => {
  seccionActiva.value = null
  subseccionActiva.value = null
}

</script>

<style>
body {
  background: none;
  margin: 0;
  padding: 0;
}
</style>

<style scoped>
.viewer {
  position: fixed;
  top: 25px;
  left: 200px;
  width: calc(100% - 260px);
  height: calc(100vh - 45px);
  background: none;
  overflow: hidden;
  transition: left 0.3s ease;
}

.viewer.menu-abierto {
  left: 80px;
}

.bar {
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

.menu-icon {
  font-size: 26px;
  color: #fff;
  cursor: pointer;
  line-height: 1;
  user-select: none;
}

.return-icon {
  font-size: 26px;
  color: #fff;
  cursor: pointer;
  line-height: 1;
  user-select: none;
}

.info-buttons {
  display: flex;
  flex-direction: column;
  max-height: 250px;
  overflow-y: auto;
  padding-right: 6px;
}

.info-buttons button {
  background-color: #024731;
  color: #fff;
  border: none;
  padding: 12px 20px;
  cursor: pointer;
  font-size: 15px;
  text-align: left;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  transition: background 0.3s;
  border-radius: 0;
}

.info-buttons button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.info-buttons::-webkit-scrollbar {
  width: 6px;
}

.info-buttons::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.25);
  border-radius: 4px;
}

.info-buttons::-webkit-scrollbar-thumb:hover {
  background: rgba(255,255,255,0.4);
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

.info-layout {
  position: absolute;
  top: 60px;
  right: 10px;
  width: 700px;
  max-height: calc(100vh - 180px);
  background: #ffffffdd;
  backdrop-filter: blur(10px);
  border-radius: 18px;
  padding: 25px 30px;
  box-shadow: /*0 10px 25px rgba(0,0,0,0.2)*/ none;
  overflow-y: auto;
  transition: all 0.3s ease;
  text-align: center;
}

.info-layout::-webkit-scrollbar {
  width: 8px;
}

.info-layout::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}

.info-layout::-webkit-scrollbar-thumb {
  background: #024731;
  border-radius: 10px;
}

.info-layout::-webkit-scrollbar-thumb:hover {
  background: #00723F;
}


.info-layout.info-compacto {
  right: 105px;
  width: 500px;
  opacity: 0.95;
}

.info-layout h2 {
  font-size: 24px;
  margin-bottom: 12px;
  color: #024731;
  font-weight: bold;
  align-self: center;
}

.info-layout p {
  font-size: 15px;
  line-height: 1.5;
  margin-bottom: 15px;
  text-align: justify;
  color: #333;
}

.info-layout img {
  width: 75%;
  border-radius: 12px;
  margin-top: 10px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.15);
}

.contenedor-3d {
  background-color: null;
  width: 100%;
  height: 100%;
}

@keyframes aparecer {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
  width: 350px;
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

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.oculto {
  display: none;
}

</style>