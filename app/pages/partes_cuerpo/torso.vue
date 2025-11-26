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
      <h2>Torso</h2>
      <p>Haz clic en una parte del torso para explorar sus funciones y características anatómicas.</p>
      <div class="info-details">
        <div class="info-buttons">
          <template v-if="!modoExploracion">
            <button @click="modoExploracion=true">🩺 Exploración Física</button>
          </template>
          <template v-if="modoExploracion && seccionActiva===null">
            <button @click="seccionActiva='preinicio'">⚖️ Protocolo y Consideraciones Éticas</button>
            <button @click="seccionActiva='preparacion'">🛏️ Preparación y Posición del Paciente</button>
            <button @click="seccionActiva='divisiones'">🧭 Divisiones Topográficas del Paciente</button>
            <button @click="seccionActiva='inspeccion'">👁️ Inspección del Abdomen</button>
            <button @click="seccionActiva='auscultacion'">🎧 Auscultación del Abdomen</button>
            <button @click="seccionActiva='percusion'">👋 Percusión del Abdomen</button>
            <button @click="seccionActiva='palpacion'">✋ Palpación del Abdomen</button>
            <button @click="seccionActiva='maniobras'">🩺 Maniobras Específicas y Signos Abdominales</button>
            <button @click="volverExploracion">↩️ Volver</button>
          </template>
          <template v-if="modoExploracion && seccionActiva=='preinicio'">
            <button @click="subseccionActiva='preinicio.protocolo'">📝 Protocolo Inicial y Comunicación</button>
            <button @click="subseccionActiva='preinicio.consideraciones'">🛡️ Consideraciones Éticas y Consentimiento</button>
            <button @click="volverSecciones">↩️ Volver</button>
          </template>
          <template v-if="modoExploracion && seccionActiva=='preparacion'">
            <button @click="subseccionActiva='preparacion.posicion'">🛏️ Posición del Paciente</button>
            <button @click="subseccionActiva='preparacion.preparacion'">🩺 Preparación del Abdomen y Pudor</button>
            <button @click="subseccionActiva='preparacion.condiciones'">🌡️ Condiciones del Entorno y del Examinador</button>
            <button @click="volverSecciones">↩️ Volver</button>
          </template>
          <template v-if="modoExploracion && seccionActiva=='divisiones'">
            <button @click="subseccionActiva='divisiones.nueve'">🔲 División en Nueve Cuadrantes</button>
            <button @click="subseccionActiva='divisiones.cuatro'">🔳 División en Cuatro Cuadrantes</button>
            <button @click="volverSecciones">↩️ Volver</button>
          </template>
          <template v-if="modoExploracion && seccionActiva=='inspeccion'">
            <button @click="subseccionActiva='inspeccion.aspecto'">👀 Aspecto General y Movimiento</button>
            <button @click="subseccionActiva='inspeccion.forma'">📏 Forma, Tamaño y Simetría</button>
            <button @click="subseccionActiva='inspeccion.piel'">🩹 Piel y Anormalidades Superficiales</button>
            <button @click="subseccionActiva='inspeccion.circulacion'">🩸 Circulación Colateral</button>
            <button @click="volverSecciones">↩️ Volver</button>
          </template>
          <template v-if="modoExploracion && seccionActiva=='auscultacion'">
            <button @click="subseccionActiva='auscultacion.tecnica'">🎧 Técnica de Auscultación</button>
            <button @click="subseccionActiva='auscultacion.datos'">📊 Datos Clínicos Obtenidos</button>
            <button @click="volverSecciones">↩️ Volver</button>
          </template>
          <template v-if="modoExploracion && seccionActiva=='percusion'">
            <button @click="subseccionActiva='percusion.tecnica'">👋 Técnica de Percusión</button>
            <button @click="subseccionActiva='percusion.consideraciones'">🗺️ Percusión para Delimitación de Órganos Específicos</button>
            <button @click="volverSecciones">↩️ Volver</button>
          </template>
          <template v-if="modoExploracion && seccionActiva=='palpacion'">
            <button @click="subseccionActiva='palpacion.superficial'">✋ Palpación Superficial (Monomanual)</button>
            <button @click="subseccionActiva='palpacion.profunda'">🖐️ Palpación Profunda (Monomanual o Bimanual)</button>
            <button @click="subseccionActiva='palpacion.generales'">📏 Principios Generales</button>
            <button @click="volverSecciones">↩️ Volver</button>
          </template>
          <template v-if="modoExploracion && seccionActiva=='maniobras'">
            <button @click="subseccionActiva='maniobras.murphy'">🩺 Signo de Murphy</button>
            <button @click="subseccionActiva='maniobras.blumberg'">⚡ Signo de Blumberg</button>
            <button @click="subseccionActiva='maniobras.mcburney'">📍 Punto de McBurney</button>
            <button @click="subseccionActiva='maniobras.rovsing'">↪️ Signo de Rovsing</button>
            <button @click="subseccionActiva='maniobras.hepatica'">🖐️ Palpación Hepática</button>
            <button @click="subseccionActiva='maniobras.onda'">🌊 Signo de la Onda Ascítica</button>
            <button @click="volverSecciones">↩️ Volver</button>
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
  preinicio: {
    contenido: [
      { tipo: 'titulo', texto: 'Protocolo y Consideraciones Éticas' },
      { tipo: 'parrafo', texto: 'El protocolo inicial y las consideraciones éticas son pasos esenciales que deben llevarse a cabo antes de comenzar las etapas formales de la exploración física del abdomen. Estos pasos garantizan el respeto al paciente, la reducción de la ansiedad y la obtención de datos confiables.' },
      { tipo: 'parrafo', texto: 'Al terminar la exploración, el protocolo ético concluye al indicarle al paciente que se ha concluido el examen y solicitarle cubrirse. Es fundamental discutir los hallazgos y explicarle cuál es el seguimiento de los mismos para favorecer una relación médico-paciente adecuada y enfatizar el respeto.'}
    ]
  },
  preparacion: {
    contenido: [
      { tipo: 'titulo', texto: 'Preparación del Paciente' },
      { tipo: 'parrafo', texto: 'La preparación y la posición del paciente son pasos cruciales en el protocolo inicial de la exploración física del abdomen (EFA) para garantizar la comodidad, el respeto y la obtención de datos clínicos confiables.' }
    ]
  },
  divisiones: {
    contenido: [
      { tipo: 'titulo', texto: 'Divisiones Topográficas del Abdomen'},
      { tipo: 'parrafo', texto: 'Las divisiones topográficas del abdomen son trazados imaginarios utilizados en la práctica médica para especificar la localización de los hallazgos y conocer qué vísceras se encuentran en cada zona. Esto es fundamental, ya que facilita la asociación de síntomas o signos con órganos específicos, lo que orienta hacia un diagnóstico preciso.'}
    ]
  },
  inspeccion: {
    contenido: [
      { tipo: 'titulo', texto: 'Inspección del Abdomen'},
      { tipo: 'parrafo', texto: 'La inspección es el primer paso en la secuencia de la exploración física del abdomen. Su objetivo principal es la observación del aspecto general del paciente y la detección de anormalidades en la superficie y el contorno abdominal.'}
    ]
  },
  auscultacion: {
    contenido: [
      { tipo: 'titulo', texto: 'Auscultación del Abdomen'},
      { tipo: 'parrafo', texto: 'La auscultación es el segundo paso en la exploración física del abdomen (EFA), siguiendo a la inspección. Este orden es fundamental, ya que la auscultación siempre precede a la palpación y la percusión. La razón para este orden modificado es que la manipulación intestinal (palpación o percusión) puede modificar la motilidad intestinal y, con ello, alterar los ruidos que se percibirían normalmente, llevando a datos falsos.'}
    ]
  },
  percusion: {
    contenido: [
      { tipo: 'titulo', texto: 'Percusión del Abdomen'},
      { tipo: 'parrafo', texto: 'La percusión es el tercer paso en la exploración física del abdomen (EFA), siguiendo a la inspección y la auscultación, y siempre se realiza antes de la palpación. El objetivo de la percusión es evaluar la densidad de los órganos internos mediante la resonancia y la transmisión de los sonidos.'}
    ]
  },
  palpacion: {
    contenido: [
      { tipo: 'titulo', texto: 'Palpación del Abdomen'},
      { tipo: 'parrafo', texto: 'La palpación es el cuarto y último paso del examen físico abdominal. Es una herramienta fundamental para detectar signos tempranos de enfermedades graves y es considerada la etapa más completa. La meta de la palpación es evaluar el tamaño de los órganos, su consistencia y la sensibilidad del abdomen.'}
    ]
  },
  maniobras: {
    contenido: [
      { tipo: 'titulo', texto: 'Maniobras Específicas y Signos Abdominales'},
      { tipo: 'parrafo', texto: 'Durante la palpación, se buscan signos específicos que orientan hacia un diagnóstico particular.'}
    ]
  }
}

const subseccionesInfo = {
  'preinicio.protocolo': {
    contenido: [
      { tipo: 'titulo', texto: 'Protocolo Inicial y Comunicación' },
      { tipo: 'parrafo', texto: '1. <b>Identificación y Presentación:</b> Es crucial que el personal médico se <b>presente con el paciente.</b> Posteriormente, se debe <b>identificar al paciente</b> confirmando al menos su <b>nombre completo y fecha de nacimiento.</b>' },
      { tipo: 'parrafo', texto: '2. <b>Interrogatorio Previo:</b> Antes de la exploración, se debe interrogar al paciente sobre el <b>motivo de consulta</b>, el <b>padecimiento actual</b> y aquellos <b>datos de la</b> historia clínica que sean relevantes.' },
      { tipo: 'parrafo', texto: '3. <b>Higiene:</b> Es <b>indispensable realizar el lavado</b> clínico <b>de manos</b> antes de comenzar el examen, siguiendo todos los pasos para una buena práctica.' },
      { tipo: 'parrafo', texto: '4. <b>Abordaje y Posición del Examinador:</b> El examinador se posiciona generalmente a la <b>derecha del paciente.</b>' }
    ]
  },
  'preinicio.consideraciones': {
    contenido: [
      { tipo: 'titulo', texto: 'Consideraciones Éticas y Consentimiento' },
      { tipo: 'parrafo', texto: '1. <b>Consentimiento Informado:</b> Una vez concluido el interrogatorio e identificada la necesidad de explorar el abdomen, es <b>indispensable explicar la acciones a realizar</b> y <b>pedir el consentimiento informado</b> del paciente. Sin la aprobación del paciente, no se puede realizar ningún procedimiento.' },
      { tipo: 'parrafo', texto: '2. <b>Reducción de la Ansiedad:</b> Se debe <b>explicar el procedimiento</b> al paciente para <b>reducir su ansiedad.</b> Sin embargo, se debe tener <b>cuidado de no dar</b> información <b>de</b> más que pueda causar un efecto contrario. Es mejor comunicarle que se busca <b>comprobar que no hay alteraciones en abdomen.</b>' },
      { tipo: 'parrafo', texto: '3. <b>Privacidad y Pudor:</b> Una vez aceptado el consentimiento, es necesario <b>asegurar la privacidad</b> del paciente. Se solicita al paciente <b>descubrirse el abdomen</b> desde el tórax hasta la ingle, pero siempre <b>respetando el pudor</b> al <b>cubrir el pecho y el</b> área <b>genital.</b>' },
      { tipo: 'parrafo', texto: '4. <b>Comodidad y Condiciones Técnicas:</b> La posición <b>del paciente</b> debe ser decúbito <b>supino</b> en la mesa de exploración. La <b>temperatura</b> de la sala debe ser <b>adecuada</b> para evitar datos falsos. Las manos del examinador <b>no deben estar</b> frías, ya que esto puede producir una <b>contractura involuntaria</b> o <b>defensa voluntaria.</b>' }
    ]
  },
  'preparacion.posicion': {
    contenido: [
      { tipo: 'titulo', texto: 'Posición del Paciente' },
      { tipo: 'parrafo', texto: '⚫ <b>Decúbito Supino:</b> La posición más común y general para la exploración es el decúbito supino (boca arriba) en la mesa de exploración.' },
      { tipo: 'parrafo', texto: '⚫ <b>Relajación Muscular:</b> Para facilitar la relajación muscular generalizada, se le solicita al paciente que <b>respire tranquilamente por la boca</b> y mantenga los <b>brazos a los lados.</b>' },
      { tipo: 'parrafo', texto: '⚫ <b>Flexión de Rodillas:</b> En pacientes que tienen músculos rectos hipertrofiados, se les puede pedir que <b>flexionen las rodillas</b> para ayudar a relajar los músculos abdominales.' },
      { tipo: 'parrafo', texto: '⚫ <b>Posiciones Especiales:</b> Aunque generalmente se realiza en decúbito supino, en ocasiones, la inspección abdominal puede requerir que el sujeto esté <b>de pie</b> o en <b>posiciones sentadas u otras especiales.</b>' },
    ]
  },
  'preparacion.preparacion': {
    contenido: [
      { tipo: 'titulo', texto: 'Preparación del Abdomen y Pudor' },
      { tipo: 'parrafo', texto: '⚫ <b>Exposición:</b> Una vez obtenido el consentimiento informado, se le solicita al paciente que <b>se descubra el abdomen.</b> El vientre debe estar <b>ampliamente descubierto</b> para la observación. La exposición debe ir desde el tórax hasta la ingle.' },
      { tipo: 'parrafo', texto: '⚫ <b>Respeto al Pudor:</b> Es fundamental <b>respetar el pudor</b> del paciente, por lo que se debe <b>cubrir el pecho</b> y el área genital.' },
    ]
  },
  'preparacion.condiciones': {
    contenido: [
      { tipo: 'titulo', texto: 'Condiciones del Entorno y del Examinador' },
      { tipo: 'parrafo', texto: '⚫ <b>Abordaje:</b> El examinador debe posicionarse por la <b>derecha del paciente.</b>' },
      { tipo: 'parrafo', texto: '⚫ <b>Higiene:</b> Es <b>indispensable realizar el lavado</b> clínico <b>de manos</b> antes de iniciar el examen.' },
      { tipo: 'parrafo', texto: '⚫ <b>Temperatura Ambiental:</b> La temperatura de la sala debe ser <b>adecuada.</b> Esto es importante para evitar la obtención de <b>datos falsos</b>, como las <b>contracturas</b> o fasciculaciones por el frío.' },
      { tipo: 'parrafo', texto: '⚫ <b>Temperatura de las Manos:</b> Las manos del examinador <b>no deben estar frías.</b> Se recomienda <b>calentar las manos</b> y el estetoscopio antes de tocar al paciente.' },
      { tipo: 'parrafo', texto: '⚫ <b>Comodidad y Comunicación:</b> Se puede utilizar la técnica de <b>charlar con el paciente mientras se palpa</b> como otro método para conseguir la relajación muscular.' },
    ]
  },
  'divisiones.nueve': {
    contenido: [
      { tipo: 'titulo', texto: 'División en Nueve Cuadrantes (Escuela Francesa o Latina)' },
      { tipo: 'parrafo', texto: '<b>Trazado:</b> Se utilizan dos líneas verticales (líneas <b>medioclaviculares</b> derecha e izquierda) y dos líneas horizontales (la <b>superior</b> a nivel de la <b>doceava costilla</b> y la <b>inferior</b> a nivel de las espinas ilíacas).' },
      { tipo: 'parrafo', texto: '<b>Cuadrantes Resultantes:</b>' },
      { tipo: 'parrafo', texto: '⚫ <b>Bordes o Periféricos:</b> Hipocondrio derecho, Hipocondrio izquierdo, Flanco derecho, Flanco izquierdo, Fosa Ilíaca derecha, y Fosa Ilíaca izquierda.' },
      { tipo: 'parrafo', texto: '⚫ <b>Centrales:</b> Epigastrio, Mesogastrio (o zona umbilical), e Hipogastrio.' },
      { tipo: 'imagen', src: '/imagenes/multimedia/divisiones-nueve.jpg' }
    ]
  },
  'divisiones.cuatro': {
    contenido: [
      { tipo: 'titulo', texto: 'División en Cuatro Cuadrantes (Escuela Anglosajona)'},
      { tipo: 'parrafo', texto: '<b>Trazado:</b> Utiliza solo dos líneas que se cruzan: una línea vertical media (pasa por la línea alba o línea medio esternal) y una línea horizontal (a nivel del ombligo).' },
      { tipo: 'parrafo', texto: '<b>Cuadrantes Resultantes:</b>' },
      { tipo: 'parrafo', texto: '⚫ Cuadrante Superior Derecho' },
      { tipo: 'parrafo', texto: '⚫ Cuadrante Superior Izquierdo' },
      { tipo: 'parrafo', texto: '⚫ Cuadrante Inferior Derecho' },
      { tipo: 'parrafo', texto: '⚫ Cuadrante Inferior Izquierdo' },
      { tipo: 'imagen', src: '/imagenes/multimedia/divisiones-cuatro.jpg' }
    ]
  },
  'inspeccion.aspecto': {
    contenido: [
      { tipo: 'titulo', texto: 'Aspecto General y Movimiento'},
      { tipo: 'parrafo', texto: '⚫ <b>Posturas Antiálgicas:</b> Se observa si el paciente adopta una posición <b>atenuante del dolor.</b>' },
      { tipo: 'parrafo', texto: '⚫ <b>Patrón Respiratorio:</b> La respiración es <b>abdominal en los hombres</b> y torácica <b>en las mujeres.</b> En patologías irritativas, el abdomen puede estar <b>contracturado.</b>' },
      { tipo: 'parrafo', texto: '⚫ <b>Pulsaciones y Peristalsis:</b> En individuos delgados, pueden verse las <b>pulsaciones de la aorta abdominal</b> en la línea media.' },
      { tipo: 'imagen', src: '/imagenes/multimedia/inspeccion-aspecto.jpg' }
    ]
  },
  'inspeccion.forma': {
    contenido: [
      { tipo: 'titulo', texto: 'Forma, Tamaño y Simetría'},
      { tipo: 'parrafo', texto: '⚫ <b>Forma Normal y Anormal:</b> El abdomen normal es <b>redondeado u ovalado</b> y simétrico. Las anormalidades incluyen abdomen <b>aplanado o abombado, excavado</b> o <b>globoso.</b>' },
      { tipo: 'parrafo', texto: '⚫ <b>Distensión:</b> Un abdomen aumentado de tamaño puede indicar obesidad, obstrucción intestinal, ascitis, embarazo o enfermedad.' },
      { tipo: 'parrafo', texto: '⚫ <b>Asimetría y Masas:</b> La asimetría puede ser signo de <b>enfermedad</b> o indicar que una tumoración está deformando el abdomen.' },
      { tipo: 'parrafo', texto: '⚫ <b>Hernias:</b> La maniobra de la tos puede revelar <b>hernias</b> en las zonas inguinales, umbilicales, femorales o en cicatrices abdominales.' },
      { tipo: 'imagen', src: '/imagenes/multimedia/inspeccion-forma.jpg' }
    ]
  },
  'inspeccion.piel': {
    contenido: [
      { tipo: 'titulo', texto: 'Piel y Anormalidades Superficiales'},
      { tipo: 'parrafo', texto: '⚫ <b>Estrías:</b> Las estrías <b>plateadas</b> se asocian a la pérdida <b>de peso</b> o distensión, mientras que las estrías de color púrpura <b>o</b> rosáceo/violáceo son características de secreción <b>corticosuprarrenal excesiva.</b>' },
      { tipo: 'parrafo', texto: '⚫ <b>Lesiones y Color:</b> Se observan <b>cicatrices, eritema, edema</b> y <b>equimosis.</b>'},
      { tipo: 'parrafo', texto: '⚫ <b>Ombligo:</b> La <b>eversión del ombligo</b> es indicativa de <b>aumento de la presión abdominal</b>, generalmente por <b>ascitis</b> o una <b>masa de</b> gran tamaño.' },
      { tipo: 'imagen', src: '/imagenes/multimedia/inspeccion-piel.jpg' }
    ]
  },
  'inspeccion.circulacion': {
    contenido: [
      { tipo: 'titulo', texto: 'Circulación Colateral'},
      { tipo: 'parrafo', texto: '⚫ <b>Venas Varicosas:</b> Se evalúa la distribución de las venas superficiales.' },
      { tipo: 'parrafo', texto: '⚫ <b>Cabeza de Medusa:</b> La presencia de <b>venas dilatadas</b> que parecen <b>irradiar desde el ombligo</b> se debe al flujo retrógrado en personas con hipertensión <b>portal.</b>'},
      { tipo: 'parrafo', texto: '⚫ <b>Obstrucción de Vena Cava:</b> Las venas superficiales se dilatan, y el drenaje se dirige en dirección cefálica en los dos tercios inferiores del abdomen.'},
      { tipo: 'parrafo', texto: '⚫ <b>Signos Hepáticos:</b> Otros signos de alteraciones hepáticas visibles a la inspección son las arañas vasculares y los lunares rojos.'},
      { tipo: 'imagen', src: '/imagenes/multimedia/inspeccion-circulacion.jpg' }
    ]
  },
  'auscultacion.tecnica': {
    contenido: [
      { tipo: 'titulo', texto: 'Técnica de Auscultación'},
      { tipo: 'parrafo', texto: '⚫ Herramienta: Se realiza con el uso del estetoscopio biauricular. Se utiliza el diafragma para los ruidos hidroaéreos y la campana para los sonidos vasculares y los roces.' },
      { tipo: 'parrafo', texto: '⚫ Posición del Paciente: Se realiza con el paciente acostado en decúbito supino.'},
      { tipo: 'parrafo', texto: '⚫ Orden de Exploración: Se recomienda auscultar en los diferentes cuadrantes del abdomen siguiendo una secuencia específica, comenzando por el cuadrante de la fosa ilíaca derecha.'},
      { tipo: 'parrafo', texto: '⚫ Duración: Se recomienda que cada cuadrante se ausculte por al menos 30 segundos. Si se sospecha que los ruidos están hipoactivos o ausentes, es necesario escuchar en cada cuadrante durante uno a dos minutos.'}
    ]
  },
  'auscultacion.datos': {
    contenido: [
      { tipo: 'titulo', texto: 'Datos Clínicos Obtenidos'},
      { tipo: 'parrafo', texto: '<b>1. Ruidos Intestinales (Hidroaéreos)</b>'},
      { tipo: 'parrafo', texto: '⚫ <b>Ruidos Normales:</b> Se presentan aproximadamente <b>cada 5 a 10 segundos</b> o con una frecuencia de <b>5 a 35 por minuto.</b> Se describen como ruidos <b>burbujeantes</b> o de <b>gorgoteo regulares.</b>' },
      { tipo: 'parrafo', texto: '⚫ <b>Ruidos Disminuidos o Ausentes:</b> Si <b>no se escuchan ruidos transcurridos 2 minutos</b>, se considera una ausencia de peristalsis y puede indicar una obstrucción <b>intestinal</b> de tipoíleo paralítico.'},
      { tipo: 'parrafo', texto: '⚫ <b>Ruidos Aumentados:</b> Se encuentran aumentados en intensidad y frecuencia, a veces descritos como <b>ruidos de lucha</b> o <b>borborigmos</b>. Esto es frecuente en las <b>primeras etapas de la obstrucción intestinal aguda.</b>'},
      { tipo: 'parrafo', texto: '<b>2. Ruidos Vasculares</b>'},
      { tipo: 'parrafo', texto: 'Se deben buscar soplos en áreas específicas utilizando la campana del estetoscopio: <b>aorta abdominal</b>, <b>arteria mesentérica superior</b>, las arterias <b>renales</b> y las <b>femorales</b>. Soplos <b>fuertes o de alta frecuencia</b> pueden ser signo de enfermedad.'},
      { tipo: 'parrafo', texto: '<b>3. Otros Ruidos Patológicos<b>'},
      { tipo: 'parrafo', texto: '⚫ <b>Ruidos de Fricción o Rose:</b> Un <b>ruido</b> áspero <b>y chirriante</b> ocasionado por el roce entre sí de las capas parietal y visceral del peritoneo, siendo <b>sugestivo de inflamación peritoneal.</b>' },
      { tipo: 'parrafo', texto: '⚫ <b>Click:</b> Puede ser un signo de aneurisma aórtico abdominal.'}
    ]
  },
  'percusion.tecnica': {
    contenido: [
      { tipo: 'titulo', texto: 'Técnica de Percusión'},
      { tipo: 'parrafo', texto: 'La técnica más utilizada es la de <b>GAC</b> o dígito digital. Se coloca <b>firmemente el dedo medio izquierdo</b> (dedo percutido) sobre el abdomen del paciente, asegurándose de que la palma y los demás dedos <b>no toquen</b> la superficie abdominal. Con la <b>punta del dedo medio derecho</b> (dedo percutor), se da un <b>ligero golpe breve</b> sobre la falange terminal del dedo izquierdo. El <b>movimiento del dedo percutor debe provenir de la</b> muñeca y no del codo.'},
      { tipo: 'imagen', src: '/imagenes/multimedia/percusion-tecnica.jpg'}
    ]
  },
  'percusion.consideraciones': {
    contenido: [
      { tipo: 'titulo', texto: 'Percusión para Delimitación de Órganos Específicos'},
      { tipo: 'parrafo', texto: '⚫ <b>Hígado:</b> La <b>matidez</b> hepática es normalmente el único sonido mate encontrado sobre órganos abdominales sólidos. El límite <b>superior</b> de la matidez hepática está en el <b>quinto espacio intercostal.</b> Un hígado aumentado de tamaño (<b>hepatomegalia</b>) es <b>mayor de 12 cm.</b>' },
      { tipo: 'parrafo', texto: '⚫ <b>Bazo:</b> La percusión esplénica debe ser <b>negativa</b> (es decir, no percutible si está normal). El <b>espacio de Traube</b> normalmente presenta un sonido timpánico. La presencia de matidez en este espacio sugiere esplenomegalia.'},
      { tipo: 'parrafo', texto: '⚫ <b>Líquido (Ascitis):</b> La percusión ayuda a valorar la presencia de ascitis (acumulación de líquido en el espacio peritoneal). La matidez generada por el líquido se diferencia del globo vesical por la <b>forma de la matidez.</b>'},
    ]
  },
  'palpacion.superficial': {
    contenido: [
      { tipo: 'titulo', texto: 'Palpación Superficial (Monomanual)'},
      { tipo: 'parrafo', texto: 'La palpación superficial se utiliza generalmente para evaluar la <b>pared abdominal.</b>' },
      { tipo: 'parrafo', texto: '⚫ <b>Técnica:</b> Se aplica una <b>ligera</b> presión en los diferentes cuadrantes abdominales.'},
      { tipo: 'parrafo', texto: '⚫ <b>Instrumento:</b> Se utilizan las <b>yemas de los dedos</b> (índice, medio y anular). Los dedos deben estar juntos, evitando movimientos bruscos.'},
      { tipo: 'parrafo', texto: '⚫ <b>Movimiento:</b> Al moverse entre cuadrantes, se debe <b>levantar la mano en vez de deslizarla</b> sobre la pared abdominal.'},
      { tipo: 'parrafo', texto: '⚫ <b>Hallazgos:</b> Permite identificar la sensibilidad, rigidez (que puede indicar inflamación o peritonitis), y movilidad del abdomen.'},
      { tipo: 'imagen', src: '/imagenes/multimedia/palpacion-superficial.jpg'}
    ]
  },
  'palpacion.profunda': {
    contenido: [
      { tipo: 'titulo', texto: 'Palpación Profunda (Monomanual o Bimanual)'},
      { tipo: 'parrafo', texto: 'La <b>palpación</b> profunda se usa para la <b>palpación visceral o intracavitaria</b> y para detectar masas.' },
      { tipo: 'parrafo', texto: '⚫ <b>Palpación Monomanual:</b> Consiste en apoyar suavemente la palma de una mano sobre el abdomen, con los dedos unidos y extendidos, ejerciendo una presión suave para deprimir el abdomen alrededor de 1 cm.'},
      { tipo: 'parrafo', texto: '⚫ <b>Palpación Bimanual:</b> Se coloca la porción plana de la mano derecha sobre el abdomen del paciente y la mano izquierda se superpone sobre la mano derecha. Las puntas de los dedos de la mano izquierda ejercen presión, mientras que la mano derecha aprecia la sensación táctil.'},
      { tipo: 'imagen', src: '/imagenes/multimedia/palpacion-profunda.jpg'}
    ]
  },
  'palpacion.generales': {
    contenido: [
      { tipo: 'titulo', texto: 'Principios Generales'},
      { tipo: 'parrafo', texto: '⚫ <b>Relajación Muscular:</b> Es crucial obtener la relajación muscular para evitar datos falsos o contracturas involuntarias. Las <b>manos deben estar tibias.</b>'},
      { tipo: 'parrafo', texto: '⚫ <b>Dolor Preexistente:</b> Si el paciente presenta un dolor abdominal ya establecido, se debe <b>iniciar la palpación por el lugar más alejado del dolor.</b>'},
      { tipo: 'parrafo', texto: '⚫ <b>Atención al Paciente:</b> El examinador siempre debe <b>mirar la cara del paciente</b> durante la palpación para detectar si realiza una mueca que indique dolor.'}
    ]
  },
  'maniobras.murphy': {
    contenido: [
      { tipo: 'titulo', texto: 'Signo de Murphy'},
      { tipo: 'parrafo', texto: '<b>Patología:</b> Colecistitis (inflamación de la vesícula biliar).'},
      { tipo: 'parrafo', texto: '<b>Técnica:</b> Se palpa el borde costal inferior derecho sobre la línea medioclavicular. Se pide al paciente inhalar profundamente mientras se palpa; si experimenta dolor y corta la inspiración, el signo es positivo.'}
    ]
  },
  'maniobras.blumberg': {
    contenido: [
      { tipo: 'titulo', texto: 'Signo de Blumberg'},
      { tipo: 'parrafo', texto: '<b>Patología:</b> Irritación peritoneal.'},
      { tipo: 'parrafo', texto: '<b>Técnica:</b> Se palpa profundamente en una región (típicamente la fosa ilíaca derecha) y luego se retira la mano de forma brusca. Si el paciente experimenta dolor en la región palpada al descomprimir, se considera positivo.'}
    ]
  },
  'maniobras.mcburney': {
    contenido: [
      { tipo: 'titulo', texto: 'Punto de McBurney'},
      { tipo: 'parrafo', texto: '<b>Patología:</b> Apendicitis aguda.'},
      { tipo: 'parrafo', texto: '<b>Técnica:</b> Se localiza trazando una línea entre la espina ilíaca anterosuperior y el ombligo. El punto se encuentra en la unión del tercio externo con el tercio medio. El dolor a la compresión de este punto es indicativo de apendicitis.'}
    ]
  },
  'maniobras.rovsing': {
    contenido: [
      { tipo: 'titulo', texto: 'Signo de Rovsing'},
      { tipo: 'parrafo', texto: '<b>Patología:</b> Apendicitis aguda.'},
      { tipo: 'parrafo', texto: '<b>Técnica:</b> Se palpa el cuadrante inferior izquierdo del abdomen (FII). Si el paciente experimenta dolor en el cuadrante inferior derecho (FID), se considera positivo.'}
    ]
  },
  'maniobras.hepatica': {
    contenido: [
      { tipo: 'titulo', texto: 'Palpación Hepática'},
      { tipo: 'parrafo', texto: '<b>Patología:</b> Hepatomegalia o patología hepática.'},
      { tipo: 'parrafo', texto: '<b>Técnica:</b> Puede ser monomanual o bimanual. Se comienza a palpar desde la altura del reborde pélvico y se asciende gradualmente hacia el reborde costal. Se le indica al paciente que respire profundamente; el borde hepático normal, que es firme y liso, se debe sentir deslizar sobre las puntas de los dedos durante la inspiración.'}
    ]
  },
  'maniobras.onda': {
    contenido: [
      { tipo: 'titulo', texto: 'Signo de la Onda Ascítica'},
      { tipo: 'parrafo', texto: '<b>Patología:</b> Ascitis (acumulación de líquido peritoneal).'},
      { tipo: 'parrafo', texto: '<b>Técnica:</b> Se coloca una mano exploradora en la línea media y con la otra se percute el borde lateral del abdomen. Si hay ascitis, se siente la onda de agua chocar contra la mano.'}
    ]
  }
  // agrega aquí todas las subsecciones que necesites
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