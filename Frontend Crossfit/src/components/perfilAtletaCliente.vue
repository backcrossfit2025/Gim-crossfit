<template>
  <div class="perfil-atleta-cliente-page q-pa-md flex flex-center">
    <q-card class="perfil-card q-pa-md q-mx-auto">
      <div v-if="perfil">
        <div class="q-mb-lg text-center">
          <q-avatar size="80px" class="q-mb-sm" color="orange" text-color="white">
            <q-icon name="person" size="56px"/>
          </q-avatar>
          <div class="text-h5 text-orange-9 text-weight-bold">Mi Perfil de Atleta</div>
        </div>
        <q-tabs v-model="tab" class="bg-grey-2 text-orange-9 shadow-1 q-mb-md" active-color="orange" indicator-color="orange">
          <q-tab name="general" label="General" />
          <q-tab name="antropo" label="Antropometría" />
          <q-tab name="items" label="Items" />
          <q-tab name="consumismo" label="Consumismo" />
        </q-tabs>

        <q-tab-panels v-model="tab" animated>
          <!-- GENERAL -->
          <q-tab-panel name="general" class="panel-card">
            <q-card flat bordered class="q-pa-md bg-grey-1 shadow-1 q-mb-md">
              <div class="q-mb-sm"><b>Nombre:</b> <span>{{ perfil.nombre }}</span></div>
              <div class="q-mb-sm"><b>Edad:</b> <span>{{ edadCalculada }}</span></div>
              <div class="q-mb-sm"><b>Sexo:</b> <span>{{ perfil.sexo }}</span></div>
              <div class="q-mb-sm"><b>Correo:</b> <span>{{ perfil.correo }}</span></div>
              <div class="q-mb-sm"><b>Teléfono:</b> <span>{{ perfil.telefono }}</span></div>
            </q-card>
          </q-tab-panel>

          <!-- ANTROPOMETRÍA -->
          <q-tab-panel name="antropo" class="panel-card">
            <div class="row">
              <div class="col-12">
                <q-card flat bordered class="q-pa-md bg-grey-1 shadow-1 q-mb-md antropo-card-custom">
                  <div class="text-h6 text-orange-9 q-mb-md text-center card-title">Básicos</div>
                  <div class="q-mb-xs datos-campo"><b>Estatura:</b> <span>{{ perfil.datos_antropometricos.estatura_cm }} centimetros</span></div>
                  <div class="q-mb-xs datos-campo"><b>Peso:</b> <span>{{ perfil.datos_antropometricos.peso_kg }} kg</span></div>
                  <div class="q-mb-xs datos-campo"><b>IMC:</b> <span>{{ perfil.datos_antropometricos.imc }}</span></div>
                </q-card>
              </div>
            </div>
            <div class="row q-col-gutter-md antropo-scroll-wrapper">
              <div class="col-12 col-md-6">
                <q-card flat bordered class="q-pa-md bg-grey-1 shadow-1 q-mb-md antropo-card-custom">
                  <div class="text-h6 text-orange-9 q-mb-md text-center card-title">Pliegues Cutáneos</div>
                  <q-list separator>
                    <q-item v-for="(val, key) in perfil.datos_antropometricos.pliegues_cutaneos || {}" :key="key" dense class="datos-campo">
                      <q-item-section>{{ key }}: {{ val }} cm</q-item-section>
                    </q-item>
                  </q-list>
                </q-card>
              </div>
              <div class="col-12 col-md-6">
                <q-card flat bordered class="q-pa-md bg-grey-1 shadow-1 q-mb-md antropo-card-custom">
                  <div class="text-h6 text-orange-9 q-mb-md text-center card-title">Perímetros Musculares</div>
                  <q-list separator>
                    <q-item v-for="(val, key) in perfil.datos_antropometricos.perimetros_musculares || {}" :key="key" dense class="datos-campo">
                      <q-item-section>{{ key }}: {{ val }} cm</q-item-section>
                    </q-item>
                  </q-list>
                </q-card>
              </div>
            </div>
          </q-tab-panel>

          <!-- ITEMS: EDICIÓN DIRECTA Y SUBIDA DE EVIDENCIA -->
          <q-tab-panel name="items" class="panel-card">
            <q-card flat bordered class="q-pa-md bg-grey-1 shadow-1 q-mb-md"
              v-for="(item, idx) in perfil.items" :key="idx">
              <div v-if="item.item_id?.descripcion" class="q-mb-xs"><b>Ejecuta:</b> <span>{{ item.item_id.descripcion }}</span></div>
              <!-- Edición directa del valor -->
              <div v-if="itemEditando === idx" class="q-mb-xs flex items-center">
                <b>Cumple:</b>
                <q-input v-model="valorEditando" dense type="number" style="width:80px" @keyup.enter="guardarEdicionItem(idx)" />
                <span class="q-ml-xs">{{ item.item_id?.medida }}</span>
                <q-btn icon="check" flat size="sm" color="positive" @click="guardarEdicionItem(idx)" />
                <q-btn icon="close" flat size="sm" color="negative" @click="cancelarEdicionItem" />
              </div>
              <div v-else class="q-mb-xs flex items-center">
                <b>Cumple:</b>
                <span class="q-ml-xs">{{ item.valor }} {{ item.item_id?.medida }}</span>
                <q-btn icon="edit" flat size="xs" color="primary" class="q-ml-xs" @click="iniciarEdicionItem(idx, item.valor)" />
              </div>
              <div v-if="item.nivel" class="q-mb-xs"><b>Nivel:</b> <span>{{ item.nivel }}</span></div>
              <div v-if="item.evidencia" class="q-mb-xs">
                <b>Evidencia:</b><br>
                <q-img :src="item.evidencia" class="q-mt-xs rounded-img" style="width: 90px; height: 90px;" />
              </div>
              <q-btn
                icon="cloud_upload"
                size="sm"
                color="orange"
                flat
                @click="$refs['fileEvidencia' + idx][0].click()"
                label="Subir Evidencia"
              />
              <input
                :ref="'fileEvidencia' + idx"
                type="file"
                accept="image/*"
                style="display: none"
                @change="onEvidenciaFileChange($event, idx)"
              />
            </q-card>
          </q-tab-panel>

          <!-- CONSUMISMO -->
          <q-tab-panel name="consumismo" class="panel-card">
            <q-card flat bordered class="q-pa-md bg-grey-1 shadow-1 q-mb-md">
              <div v-for="(consumo, idx) in perfil.consumismo" :key="idx">
                <div class="q-mb-xs"><b>¿Usa tenis de crossfit?</b> <span>{{ consumo.tenis_crossfit ? 'Sí' : 'No' }}</span></div>
                <div class="q-mb-xs" v-if="Array.isArray(consumo.accesorios) && consumo.accesorios.length">
                  <b>Accesorios:</b> <span>{{ consumo.accesorios.join(', ') }}</span>
                </div>
                <div class="q-mb-xs" v-if="Array.isArray(consumo.programaciones) && consumo.programaciones.length">
                  <b>Programaciones:</b> <span>{{ consumo.programaciones.join(', ') }}</span>
                </div>
              </div>
            </q-card>
          </q-tab-panel>
        </q-tab-panels>
        <div class="text-center q-mt-lg">
          <q-btn color="orange" icon="edit" label="Editar Perfil" @click="editarPerfil" />
        </div>
      </div>
      <div v-else>
        <q-card flat bordered class="q-pa-xl bg-grey-1 shadow-2 text-center">
          <div class="text-h6 text-grey-7 q-mb-md">¡Aún no tienes perfil!</div>
          <q-btn color="orange" icon="add" label="Crear mi perfil" @click="crearPerfil" />
        </q-card>
      </div>


      <!-- Diálogo editar perfil -->
      <q-dialog v-model="mostrarDialogo">
        <q-card style="min-width: 350px; max-width: 90vw">
          <q-card-section>
            <div class="text-h6">Editar Perfil</div>
          </q-card-section>
          <q-card-section>
            <q-form @submit.prevent="guardarCambios">
              <q-input v-model="perfilEdita.nombre" label="Nombre" dense required />
              <q-input v-model="perfilEdita.fecha_nacimiento" label="Fecha de nacimiento" dense type="date" required />
              <q-select v-model="perfilEdita.sexo" :options="sexoOptions" label="Sexo" dense map-options emit-value />
              <q-input v-model="perfilEdita.correo" label="Correo" dense />
              <q-input v-model="perfilEdita.telefono" label="Teléfono" dense />
              <q-expansion-item label="Antropometría" icon="fitness_center" default-opened>
                <q-input v-model="perfilEdita.datos_antropometricos.estatura_cm" label="Estatura (cm)" dense type="number" />
                <q-input v-model="perfilEdita.datos_antropometricos.peso_kg" label="Peso (kg)" dense type="number" />
                <q-input v-model="perfilEdita.datos_antropometricos.imc" label="IMC" dense type="number" readonly />

                <q-expansion-item label="Pliegues Cutáneos">
                  <q-input v-for="k in plieguesKeys" :key="k" v-model="perfilEdita.datos_antropometricos.pliegues_cutaneos[k]" :label="k" dense type="number" />
                </q-expansion-item>
                <q-expansion-item label="Perímetros Musculares">
                  <q-input v-for="k in perimetrosKeys" :key="k" v-model="perfilEdita.datos_antropometricos.perimetros_musculares[k]" :label="k" dense type="number" />
                </q-expansion-item>
              </q-expansion-item>
              <q-expansion-item label="Consumismo" icon="shopping_cart">
                <q-toggle v-model="perfilEdita.consumismo[0].tenis_crossfit" label="¿Usa tenis de crossfit?" left-label />
                <q-select v-model="perfilEdita.consumismo[0].accesorios" :options="['muñequeras', 'cinturón', 'rodilleras', 'calleras', 'otros']" label="Accesorios" multiple dense use-chips use-input new-value-mode="add" map-options />
                <q-select v-model="perfilEdita.consumismo[0].programaciones" :options="['mayhem', 'invictus', 'comptrain', 'otros']" label="Programaciones" multiple dense use-chips use-input new-value-mode="add" map-options />
              </q-expansion-item>
<q-expansion-item label="Items" icon="list">
  <div class="item-block-wrapper">
    <q-select
      v-model="itemSeleccionado"
      :options="itemsFiltrados"
      option-label="descripcion"
      option-value="_id"
      label="Selecciona un item"
      dense
      emit-value
      map-options
      outlined
      popup-content-class="items-select-popup"
      class="q-mb-sm full-width"
      :popup-content-style="'max-height: 250px; min-width: 220px; border-radius: 12px;'"
      :disable="editandoItem"
    />
    <q-input
      v-model="valorItem"
      :label="`Valor${unidadSeleccionada ? ' (' + unidadSeleccionada + ')' : ''}`"
      dense
      type="number"
      :suffix="unidadSeleccionada"
      outlined
      class="valor-responsive q-mb-sm"
    />
    <q-btn
      v-if="editandoItem"
      label="Actualizar"
      color="primary"
      @click="actualizarItem"
      class="btn-agregar-item"
    />
    <q-btn
      v-else
      label="Agregar"
      color="orange"
      @click="agregarItem"
      class="btn-agregar-item"
    />
    <div
      v-for="(item, idx) in perfilEdita.items"
      :key="idx"
      class="item-card-display q-mt-sm"
    >
      <span class="item-value-text">
        <b>{{ buscarDescripcion(item.item_id) }}</b> - Valor: <b>{{ item.valor }}</b>
        <span class="unidad-label">{{ buscarUnidad(item.item_id) }}</span>
      </span>
      <q-img
        v-if="item.evidencia"
        :src="item.evidencia"
        class="img-evidencia"
        spinner-color="orange"
      />
      <q-btn icon="edit" size="xs" color="primary" flat @click="prepararEdicionItem(idx)" />
      <q-btn icon="cloud_upload" size="sm" color="orange" flat @click="$refs['fileEvidenciaEdit' + idx][0].click()" />
      <input :ref="'fileEvidenciaEdit' + idx" type="file" accept="image/*" style="display: none" @change="onEvidenciaFileChangeEdit($event, idx)" />
      <q-btn icon="delete" size="xs" color="red" @click="eliminarItem(idx)" flat />
    </div>
  </div>
</q-expansion-item>

            </q-form>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancelar" v-close-popup />
            <q-btn flat label="Guardar" color="primary" @click="guardarCambios" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-card>
      <div class="social-buttons">
    <a href="https://wa.me/+573103660846" target="_blank" aria-label="whatsapp">
    <img src="../assets/whatsapp.png" alt="whatsapp" />
  </a>
  <a href="https://www.facebook.com/Trainerscol/" target="_blank" aria-label="Facebook">
    <img src="../assets/facebook.png" alt="facebook" />
  </a>
  <a href="https://www.instagram.com/trainerscolsoc?igshid=1tt2rd726w4dz" target="_blank" aria-label="Instagram">
    <img src="../assets/instagram.png" alt="instagram" />
  </a>
  <a href="https://www.youtube.com/channel/UCSlxXNEJxW1c1gtZ8Y-4QRA" target="_blank" aria-label="youtube">
    <img src="../assets/youtube.png" alt="youtube" />
  </a>
</div>

  </div>



</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { Notify } from "quasar";
import { useStoreAtleta } from "../stores/perfilAtleta.js";
import { useStoreUsuarios } from "../stores/usuario.js";
import { useStoreItems } from "../stores/items.js";
import axios from "axios";
import { watch } from 'vue'

const itemSeleccionado = ref(null)
const valorItem = ref('')
const editandoItem = ref(false)
const idxEditando = ref(null)
const atletaStore = useStoreAtleta();
const usuarioStore = useStoreUsuarios();
const itemsStore = useStoreItems();

const tab = ref("general");
const mostrarDialogo = ref(false);

const perfil = ref(null);
const perfilEdita = ref(null);

const itemEditando = ref(null);
const valorEditando = ref("");



const sexoOptions = [
  { label: "Masculino", value: "M" },
  { label: "Femenino", value: "F" },
  { label: "No especifica", value: "NO_ESPECIFICA" },
];
const plieguesKeys = [
  "biceps", "triceps", "escapula", "abdomen", "suprailiaco", "pectoral", "pierna", "pantorrilla",
];
const perimetrosKeys = [
  "pectoral", "hombro", "cuello", "biceps_relajado", "biceps_contraido", "abdomen", "cintura", "cadera", "muslo_mayor", "pantorrilla",
];

const edadCalculada = computed(() => {
  if (!perfil.value || !perfil.value.fecha_nacimiento) return "";
  const hoy = new Date();
  const nacimiento = new Date(perfil.value.fecha_nacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const m = hoy.getMonth() - nacimiento.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
  return edad;
});

onMounted(async () => {
  await cargarPerfil();
  await itemsStore.getAll(usuarioStore.token);
});

async function cargarPerfil() {
  await atletaStore.getByUsuarioId(usuarioStore.usuario._id, usuarioStore.token);
  perfil.value = atletaStore.perfil;
  if (perfil.value) {
    // Asegura estructura mínima para edición
    if (!perfil.value.datos_antropometricos) perfil.value.datos_antropometricos = {};
    if (!perfil.value.datos_antropometricos.pliegues_cutaneos) perfil.value.datos_antropometricos.pliegues_cutaneos = {};
    if (!perfil.value.datos_antropometricos.perimetros_musculares) perfil.value.datos_antropometricos.perimetros_musculares = {};
    if (!Array.isArray(perfil.value.consumismo) || perfil.value.consumismo.length === 0) {
      perfil.value.consumismo = [{
        tenis_crossfit: false,
        accesorios: [],
        programaciones: [],
      }];
    }
    if (!Array.isArray(perfil.value.items)) perfil.value.items = [];
  }
}

function editarPerfil() {
  perfilEdita.value = JSON.parse(JSON.stringify(perfil.value));
  mostrarDialogo.value = true;
}

function crearPerfil() {
  perfilEdita.value = {
    usuario_id: usuarioStore.usuario._id,
    nombre: "",
    fecha_nacimiento: "",
    sexo: null,
    correo: "",
    telefono: "",
    datos_antropometricos: {
      estatura_cm: null,
      peso_kg: null,
      imc: null,
      pliegues_cutaneos: {},
      perimetros_musculares: {},
    },
    items: [],
    consumismo: [{
      tenis_crossfit: false,
      accesorios: [],
      programaciones: [],
    }],
  };
  mostrarDialogo.value = true;
}


// funcion campo imc calculador de imc



// Utilidad para parsear campos numéricos
function parseNumericos(obj) {
  if (!obj) return;
  for (const key in obj) {
    if (obj[key] !== null && typeof obj[key] === "object") {
      parseNumericos(obj[key]);
    } else if (
      obj[key] !== null &&
      obj[key] !== "" &&
      !isNaN(obj[key]) &&
      typeof obj[key] !== "boolean"
    ) {
      obj[key] = Number(obj[key]);
    }
  }
}
//
function iniciarEdicionItem(idx, valor) {
  itemEditando.value = idx;
  valorEditando.value = valor;
}

function cancelarEdicionItem() {
  itemEditando.value = null;
  valorEditando.value = '';
}
async function guardarEdicionItem(idx) {
  if (!perfil.value.items[idx]) return;
  perfil.value.items[idx].valor = isNaN(valorEditando.value) ? valorEditando.value : Number(valorEditando.value);
  try {
    await atletaStore.editar(perfil.value._id, perfil.value, usuarioStore.token);
    Notify.create({ type: 'positive', message: 'Item actualizado correctamente.' });
    await cargarPerfil();
  } catch (e) {
    Notify.create({ type: 'negative', message: 'Error al actualizar el item.' });
  }
  itemEditando.value = null;
  valorEditando.value = '';
}

const itemsFiltrados = computed(() => itemsStore.items)
const unidadSeleccionada = computed(() => {
  const item = itemsFiltrados.value.find(i => i._id === itemSeleccionado.value)
  return item?.medida || ''
})
function buscarDescripcion(id) {
  const item = itemsStore.items.find(i => i._id === id)
  return item ? item.descripcion : ''
}
function buscarUnidad(id) {
  const item = itemsStore.items.find(i => i._id === id)
  return item ? item.medida : ''
}

// subir evidencia
function dispararInputEvidencia(idx) {
  if ($refs['fileEvidencia' + idx] && $refs['fileEvidencia' + idx][0]) {
    $refs['fileEvidencia' + idx][0].click()
  }
}



// Agregar nuevo item (evita duplicados, alerta si existe)
function agregarItem() {
  if (!itemSeleccionado.value || !valorItem.value) return
  const idSel = typeof itemSeleccionado.value === 'object' ? itemSeleccionado.value._id : itemSeleccionado.value
  const idx = perfilEdita.value.items.findIndex(i => {
    const refId = typeof i.item_id === 'object' ? i.item_id._id : i.item_id
    return refId == idSel
  })
  if (idx !== -1) {
    Notify.create({ type: 'warning', message: 'Este item ya existe. Puedes editarlo directamente.' })
    prepararEdicionItem(idx)
    return
  }
  perfilEdita.value.items.push({
    item_id: idSel,
    valor: valorItem.value,
  })
  itemSeleccionado.value = null
  valorItem.value = ''
  Notify.create({ type: 'positive', message: 'Item agregado correctamente.' })
}

// Preparar edición del item
function prepararEdicionItem(idx) {
  idxEditando.value = idx
  const actualId = perfilEdita.value.items[idx].item_id
  itemSeleccionado.value = typeof actualId === 'object' ? actualId._id : actualId
  valorItem.value = perfilEdita.value.items[idx].valor
  editandoItem.value = true
}

// Actualizar el item
function actualizarItem() {
  if (idxEditando.value === null) return
  perfilEdita.value.items[idxEditando.value].valor = valorItem.value
  itemSeleccionado.value = null
  valorItem.value = ''
  editandoItem.value = false
  idxEditando.value = null
  Notify.create({ type: 'positive', message: 'Item actualizado correctamente.' })
}


// funcion imc
watch(
  () => [perfilEdita.value?.datos_antropometricos?.peso_kg, perfilEdita.value?.datos_antropometricos?.estatura_cm],
  ([peso, estatura]) => {
    if (peso > 0 && estatura > 0) {
      // convertir estatura a metros
      const imc = peso / Math.pow(estatura / 100, 2)
      perfilEdita.value.datos_antropometricos.imc = Number(imc.toFixed(2))
    } else {
      perfilEdita.value.datos_antropometricos.imc = null
    }
  }
)


// Eliminar item (sale del modo edición si lo eliminaste)
function eliminarItem(idx) {
  perfilEdita.value.items.splice(idx, 1)
  if (editandoItem.value && idxEditando.value === idx) {
    editandoItem.value = false
    idxEditando.value = null
    itemSeleccionado.value = null
    valorItem.value = ''
  }
}

// guardar cambios 
async function guardarCambios() {
  try {
    parseNumericos(perfilEdita.value.datos_antropometricos);

    // Convertir valores de items a número
    if (Array.isArray(perfilEdita.value.items)) {
      perfilEdita.value.items.forEach((item) => {
        if (
          item.valor !== undefined &&
          item.valor !== null &&
          !isNaN(item.valor)
        ) {
          item.valor = Number(item.valor);
        }
      });
    }

    const token = usuarioStore.token;
    if (perfilEdita.value._id) {
      await atletaStore.editar(perfilEdita.value._id, perfilEdita.value, token);
      Notify.create({ type: "positive", message: "Perfil actualizado" });
    } else {
      const res = await atletaStore.crear(perfilEdita.value, token);
      if (!res.success) {
        Notify.create({ type: "negative", message: res.msg || "Error al crear perfil" });
        return;
      }
      Notify.create({ type: "positive", message: "Perfil creado" });
    }
    mostrarDialogo.value = false;
    await cargarPerfil();
  } catch (e) {
    Notify.create({
      type: "negative",
      message: e?.response?.data?.msg || e?.message || "Error al guardar",
    });
  }
}


// Manejar cambio de archivo de evidencia
// Subir evidencia desde edición (opcional, por si permites desde edición también)
const onEvidenciaFileChange = async (e, idx) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const formData = new FormData();
    formData.append("evidencia", file);
    const atletaId = perfil.value._id;
    const itemId = perfil.value.items[idx]._id || perfil.value.items[idx].item_id;
    const token = usuarioStore.token;
    const url = `https://gim-crossfit.onrender.com/api/atleta/subir-evidencia/${atletaId}/${itemId}`;
    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-token": token,
      },
    });
    Notify.create({ type: "positive", message: "Imagen subida con éxito" });
    await cargarPerfil();
  } catch (error) {
    Notify.create({
      type: "negative",
      message: error?.response?.data?.msg || error.message,
    });
  }
};



</script>


<style scoped>
.perfil-atleta-cliente-page {
  min-height: 70vh;
  /* background: linear-gradient(120deg, #ffe5c2 0%, #e3e3e3 100%); */
  
}
.perfil-card {
  max-width: 530px;
  width: 100%;
  border-radius: 20px;
  box-shadow: 0 2px 16px #0001;
}
.panel-card {
  padding: 0;
}
.rounded-img {
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 1px 6px #0002;
}
@media (max-width: 600px) {
  .perfil-card {
    max-width: 99vw;
    padding: 0 !important;
  }
  .q-card {
    border-radius: 0 !important;
    box-shadow: none !important;
    margin-top: 80px;
  }
}
.q-card.q-card--bordered.q-card--flat.no-shadow.q-pa-md.bg-grey-1.shadow-1.q-mb-md {
  display: grid;
  align-items: stretch;
  justify-items: center;
}

/* estilo botones lateral */
.social-buttons {
  position: fixed;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  z-index: 1050;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.social-buttons img {
  margin-bottom: 10px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  box-shadow: 0 2px 8px #ffa72633;
  background: #fff;
  border: 2px solid #ffa726;
  transition: box-shadow 0.2s, border-color 0.2s;
}
.social-buttons a:hover img {
  opacity: 0.85;
  border-color: #ff9800;
  box-shadow: 0 4px 16px #ffa72666;
}
@media (max-width: 576px) {
  .social-buttons {
    /* top: auto; */
    bottom: 10px;
    right: 10px;
    margin-top: 35px;
  }
  
  .social-buttons img {
    width: 40px;
    height: 40px;
    margin-bottom: 6px;
  }
}

/* General: Letras bonitas y tarjetas con sombras suaves */
.antropo-card-custom {
  border-radius: 18px;
  font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif;
  font-size: 1.1rem;
  color: #222;
  box-shadow: 0 2px 10px 0 rgba(255,153,0,0.07);
}

/* Título de cada tarjeta */
.card-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: #FF9800;
  letter-spacing: 1px;
}

/* Campos de datos */
.datos-campo {
  font-size: 1.07rem;
  margin-bottom: 2px;
}

/* Responsividad para celulares pequeños (máx 430px) */
@media (max-width: 430px) {
  .panel-card .antropo-card-custom {
    font-size: 0.92rem !important;
    padding: 12px 5px !important;
  }
  .panel-card .card-title {
    font-size: 1.08rem !important;
    margin-bottom: 8px !important;
  }
  .panel-card .datos-campo {
    font-size: 0.95rem !important;
    margin-bottom: 0.7em !important;
  }
  .panel-card .q-list, .panel-card .q-item {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  .perfil-atleta-cliente-page {
  min-height: 30vh !important;
  /* background: linear-gradient(120deg, #ffe5c2 0%, #e3e3e3 100%); */
  
}
}



/* scrroll antropometria */
/* Scroll solo para las tarjetas de pliegues y perímetros */
.antropo-scroll-wrapper {
  max-height: 320px;    /* Escritorio y tablets */
  overflow-y: auto;
  padding-right: 8px;
  transition: max-height 0.2s;
}

/* Pantallas medianas (tablets chicas) */
@media (max-width: 900px) {
  .antropo-scroll-wrapper {
    max-height: 300px;
  }
}

/* Pantallas pequeñas (móviles normales) */
@media (max-width: 600px) {
  .antropo-scroll-wrapper {
    max-height: 170px;
    padding-right: 4px;
  }
}

/* Pantallas muy pequeñas (teléfonos de 400px o menos) */
@media (max-width: 450px) {
  .antropo-scroll-wrapper {
    max-height: 110px;
    padding-right: 2px;
  }
  .antropo-card-custom {
    font-size: 0.91rem;
    padding: 10px 6px !important;
  }
  .card-title {
    font-size: 1.09rem !important;
  }
  .datos-campo {
    font-size: 0.97em;
    padding: 3px 2px !important;
  }
}


/* modal editar */

/* Hace el modal responsivo en móviles pequeños */
@media (max-width: 420px) {
  .q-dialog__inner > .q-card {
    min-width: 96vw !important;
    max-width: 99vw !important;
    padding: 0 !important;
    border-radius: 12px !important;
    font-size: 0.99em;
  }
  .q-card__section, .q-card__actions {
    padding-left: 10px !important;
    padding-right: 10px !important;
    font-size: 0.98em;
  }
  .q-input, .q-select, .q-toggle {
    font-size: 0.97em !important;
  }
  .q-expansion-item {
    font-size: 0.97em !important;
  }
  .q-btn {
    font-size: 0.98em !important;
    min-width: 76px;
  }
}

/* Opcional: que todo el contenido interno haga scroll si se pasa */
@media (max-width: 420px) {
  .q-dialog__inner > .q-card {
    max-height: 97vh;
    overflow-y: auto;
  }
}

/* estilos items carga
 */
 .item-block-wrapper {
  padding-bottom: 8px;
}
.full-width {
  width: 100%;
}
.items-select-popup {
  border-radius: 14px;
  box-shadow: 0 2px 12px #0002;
  font-size: 1.07em;
}
.valor-responsive .q-field__control {
  border-radius: 10px;
}
.btn-agregar-item {
  border-radius: 18px;
  font-weight: 500;
  font-size: 1em;
  min-width: 120px;
}
.item-card-display {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f7f7fc;
  border-radius: 12px;
  box-shadow: 0 2px 10px #0001;
  padding: 6px 10px;
  margin-bottom: 2px;
  font-size: 1.07em;
  flex-wrap: wrap;
}
.img-evidencia {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
  margin: 0 4px;
}
.item-value-text {
  display: flex;
  align-items: center;
  gap: 4px;
}
.unidad-label {
  color: #678;
  font-size: 0.93em;
  margin-left: 1px;
}
@media (max-width: 650px) {
  .item-block-wrapper, .item-card-display {
    font-size: 0.98em;
    flex-direction: column;
    gap: 6px;
    align-items: flex-start;
    padding: 6px 2px;
  }
  .img-evidencia {
    width: 40px;
    height: 40px;
  }
  .btn-agregar-item {
    min-width: 100px;
    font-size: 0.99em;
  }
}

</style>