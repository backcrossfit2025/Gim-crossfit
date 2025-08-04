<template>
  <div class="tabla-wrapper">
    <q-card class="q-pa-md">
      <div class="row items-center q-mb-md">
        <div class="col"><h5>CRUD Atletas</h5></div>
        <div class="col-auto">
          <q-input
            dense
            debounce="300"
            v-model="filtro"
            placeholder="Buscar por nombre"
          />
          <q-btn
            dense
            color="orange"
            icon="add"
            label="Nuevo"
            class="q-ml-sm"
            @click="crearAtleta"
          />
        </div>
      </div>
      <q-table
        :rows="filtrados"
        :columns="columns"
        row-key="_id"
        :loading="useAtleta.cargando"
        flat
        dense
      >
        <template #body-cell-acciones="props">
          <q-td>
            <q-btn
              size="sm"
              icon="visibility"
              flat
              color="orange"
              @click="verDetalle(props.row)"
            />
            <q-btn
              size="sm"
              icon="edit"
              flat
              color="secondary"
              @click="editarAtleta(props.row)"
            />
            <q-btn
              size="sm"
              icon="delete"
              flat
              color="negative"
              @click="borrarAtleta(props.row._id)"
            />
          </q-td>
        </template>
      </q-table>

      <!-- Diálogo detalle -->
      <q-dialog v-model="mostrarDetalle">
        <q-card style="min-width: 400px; max-width: 90vw">
          <q-card-section>
            <div class="text-h6">
              Detalle Atleta: {{ atletaDetalle?.nombre }}
            </div>
          </q-card-section>
          <q-card-section>
            <q-tabs v-model="tab" class="text-primary">
              <q-tab name="general" label="General" />
              <q-tab name="antropo" label="Antropometría" />
              <q-tab name="consumismo" label="Consumismo" />
              <q-tab name="items" label="Items" />
            </q-tabs>

            <q-tab-panels v-model="tab" animated>
              <q-tab-panel name="general">
                <div class="item-card letra-normal">
                  <div class="item-label">
                    <b>Nombre:</b>
                    <span class="item-value">{{ atletaDetalle?.nombre }}</span>
                  </div>
                  <div class="item-label">
                    <b>Edad:</b>
                    <span class="item-value">{{ atletaDetalle?.edad }}</span>
                  </div>
                  <div class="item-label">
                    <b>Sexo:</b>
                    <span class="item-value">{{ atletaDetalle?.sexo }}</span>
                  </div>
                  <div class="item-label">
                    <b>Correo:</b>
                    <span class="item-value">{{ atletaDetalle?.correo }}</span>
                  </div>
                  <div class="item-label">
                    <b>Teléfono:</b>
                    <span class="item-value">{{
                      atletaDetalle?.telefono
                    }}</span>
                  </div>
                  <div class="item-label">
  <b>Puntos:</b>
  <span class="item-value">{{ atletaDetalle?.puntos }}</span>
</div>
                </div>
              </q-tab-panel>
              <q-tab-panel name="antropo">
                <div
                  v-if="atletaDetalle?.datos_antropometricos"
                  class="item-card letra-normal"
                >
                  <div class="item-label">
                    <b>Estatura:</b>
                    <span class="item-value"
                      >{{
                        atletaDetalle.datos_antropometricos.estatura_cm
                      }}
                      cm</span
                    >
                  </div>
                  <div class="item-label">
                    <b>Peso:</b>
                    <span class="item-value"
                      >{{
                        atletaDetalle.datos_antropometricos.peso_kg
                      }}
                      kg</span
                    >
                  </div>
                  <!-- <div class="item-label">
                    <b>IMC:</b>
                    <span class="item-value">{{
                      atletaDetalle.datos_antropometricos.imc
                    }}</span>
                  </div> -->

   <!-- IMC con color dinámico -->
                  <div class="item-label">
                    <b>IMC: </b>
                    <span :class="colorIMCDetalle(atletaDetalle.datos_antropometricos.imc)">
                      {{ atletaDetalle.datos_antropometricos.imc }}
                    </span>
                  </div>
                  <!-- Badge rango IMC -->
                  <div class="item-label q-mt-xs">
                    <q-badge v-if="colorIMCDetalle(atletaDetalle.datos_antropometricos.imc) === 'imc-bajo'" color="blue-8" label="Peso bajo" />
                    <q-badge v-else-if="colorIMCDetalle(atletaDetalle.datos_antropometricos.imc) === 'imc-normal'" color="green-8" label="Peso normal" />
                    <q-badge v-else-if="colorIMCDetalle(atletaDetalle.datos_antropometricos.imc) === 'imc-sobrepeso'" color="orange-4" text-color="black" label="Sobrepeso" />
                    <q-badge v-else-if="colorIMCDetalle(atletaDetalle.datos_antropometricos.imc) === 'imc-obesidad'" color="orange-10" label="Obesidad" />
                  </div>

                  <!-- <div class="item-label">
                    <b>IMC:</b>
                    <span class="item-value">{{ imcDetalle }}</span>
                  </div> -->

                  <div class="item-label q-mt-md">
                    <b>Pliegues Cutáneos:</b>
                  </div>
                  <div
                    v-for="(val, key) in atletaDetalle.datos_antropometricos
                      .pliegues_cutaneos || {}"
                    :key="key"
                    class="item-label"
                  >
                    <b>{{ key }}:</b>
                    <span class="item-value">{{ val }} cm</span>
                  </div>
                  <div class="item-label q-mt-md">
                    <b>Perímetros Musculares:</b>
                  </div>
                  <div
                    v-for="(val, key) in atletaDetalle.datos_antropometricos
                      .perimetros_musculares || {}"
                    :key="key"
                    class="item-label"
                  >
                    <b>{{ key }}:</b>
                    <span class="item-value">{{ val }} cm</span>
                  </div>
                </div>
              </q-tab-panel>



              <q-tab-panel name="consumismo">
                <div v-if="Array.isArray(atletaDetalle?.consumismo)">
                  <div
                    v-for="(consumo, idx) in atletaDetalle.consumismo"
                    :key="idx"
                    class="item-card letra-normal no-bg"
                  >
                    <div class="item-label">
                      <b>¿Usa tenis de crossfit?</b>
                      <span class="item-value">{{
                        consumo.tenis_crossfit ? "Sí" : "No"
                      }}</span>
                    </div>
                    <div
                      class="item-label"
                      v-if="
                        Array.isArray(consumo.accesorios) &&
                        consumo.accesorios.length
                      "
                    >
                      <b>Accesorios:</b>
                      <span class="item-value">{{
                        consumo.accesorios.join(", ")
                      }}</span>
                    </div>
                    <div
                      class="item-label"
                      v-if="
                        Array.isArray(consumo.programaciones) &&
                        consumo.programaciones.length
                      "
                    >
                      <b>Programaciones:</b>
                      <span class="item-value">{{
                        consumo.programaciones.join(", ")
                      }}</span>
                    </div>
                  </div>
                </div>
              </q-tab-panel>
              <q-tab-panel name="items">
                <div v-if="Array.isArray(atletaDetalle?.items)">
                  <div
                    v-for="(item, idx) in atletaDetalle.items"
                    :key="idx"
                    class="q-mb-md item-card letra-normal"
                  >
                    <div class="item-label" v-if="item.grupo">
                      <b>Grupo:</b>
                      <span class="item-value">{{ item.grupo }}</span>
                    </div>
                    <div class="item-label" v-if="item.item_id?.descripcion">
                      <b>Ejecuta:</b>
                      <span class="item-value">{{
                        item.item_id.descripcion
                      }}</span>
                    </div>
                    <div
                      class="item-label"
                      v-if="item.valor && item.item_id?.medida"
                    >
                      <b>Cumple:</b>
                      <span class="item-value"
                        >{{ item.valor }} {{ item.item_id.medida }}</span
                      >
                    </div>
                    <div class="item-label" v-if="item.nivel">
                      <b>Nivel:</b>
                      <span class="item-value">{{ item.nivel }}</span>
                    </div>
                    <div class="item-label" v-else-if="item.valor">
                      <b>Valor:</b>
                      <span class="item-value">{{ item.valor }}</span>
                    </div>
                    <div v-if="item.evidencia" class="q-mt-md">
                      <b>Evidencia:</b><br />
                      <img
                        :src="item.evidencia"
                        alt="Evidencia"
                        style="
                          max-width: 180px;
                          border-radius: 8px;
                          margin-top: 5px;
                          box-shadow: 0 1px 5px #0002;
                        "
                      />
                    </div>
                    <q-separator spaced />
                  </div>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              flat
              label="Cerrar"
              color="red"
              v-close-popup
              class="cerrar-btn"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Diálogo crear/editar -->
      <q-dialog v-model="mostrarDialogo">
        <q-card style="min-width: 350px; max-width: 90vw">
          <q-card-section>
            <div class="text-h6">
              {{ editando ? "Editar" : "Nuevo" }} Atleta
            </div>
          </q-card-section>
          <q-card-section>
            <q-form @submit.prevent="guardarCambios">
              <q-input
                v-model="atletaEdita.nombre"
                label="Nombre"
                dense
                required
              />
              <q-input
                v-model="atletaEdita.fecha_nacimiento"
                label="Fecha de nacimiento"
                dense
                type="date"
                required
              />
              <q-input v-model="atletaEdita.correo" label="Correo" dense />
              <q-input v-model="atletaEdita.telefono" label="Teléfono" dense />
              <q-select
                v-model="atletaEdita.sexo"
                :options="sexoOptions"
                label="Sexo"
                dense
                map-options
                emit-value
              />
              <q-expansion-item label="Antropometría" icon="fitness_center">
                <q-input
                  v-model="atletaEdita.datos_antropometricos.estatura_cm"
                  label="Estatura (mt)"
                  dense
                  type="number"
                />
                <q-input
                  v-model="atletaEdita.datos_antropometricos.peso_kg"
                  label="Peso (kg)"
                  dense
                  type="number"
                />

                <!-- <q-input
                  :model-value="imcEdita"
                  label="IMC"
                  dense
                  type="number"
                  readonly
                /> -->

                 <!-- IMC readonly, con color -->
                <div style="display: flex; align-items: center; gap: 8px;">
                  <q-input
                    :model-value="imcEdita"
                    label="IMC" 
                    dense
                    type="number"
                    readonly
                    :class="colorIMCEdita"
                    style="max-width:120px"
                  />
                  <q-badge v-if="colorIMCEdita === 'imc-bajo'" color="blue-8" label="Peso bajo" />
                  <q-badge v-else-if="colorIMCEdita === 'imc-normal'" color="green-8" label="Peso normal" />
                  <q-badge v-else-if="colorIMCEdita === 'imc-sobrepeso'" color="orange-4" text-color="black" label="Sobrepeso" />
                  <q-badge v-else-if="colorIMCEdita === 'imc-obesidad'" color="orange-10" label="Obesidad" />
                </div>
                <q-expansion-item label="Pliegues Cutáneos">
                  <q-input
                    v-for="k in plieguesKeys"
                    :key="k"
                    v-model="
                      atletaEdita.datos_antropometricos.pliegues_cutaneos[k]
                    "
                    :label="k"
                    dense
                    type="number"
                  />
                </q-expansion-item>
                <q-expansion-item label="Perímetros Musculares">
                  <q-input
                    v-for="k in perimetrosKeys"
                    :key="k"
                    v-model="
                      atletaEdita.datos_antropometricos.perimetros_musculares[k]
                    "
                    :label="k"
                    dense
                    type="number"
                  />
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
                    />
                    <q-input
                      v-model="valorItem"
                      :label="`Valor${
                        unidadSeleccionada
                          ? ' (' + unidadSeleccionada + ')'
                          : ''
                      }`"
                      dense
                      type="number"
                      :suffix="unidadSeleccionada"
                      outlined
                      class="valor-responsive q-mb-sm"
                    />
                    <q-btn
                      label="Agregar"
                      color="primary"
                      @click="agregarItem"
                      class="btn-agregar-item"
                    />
                    <div
                      v-for="(item, idx) in atletaEdita.items"
                      :key="idx"
                      class="item-card-display q-mt-sm"
                    >
                      <span class="item-value-text">
                        <b>{{ buscarDescripcion(item.item_id) }}</b> - Valor:
                        <b>{{ item.valor }}</b>
                        <span class="unidad-label">{{
                          buscarUnidad(item.item_id)
                        }}</span>
                      </span>
                      <q-img
                        v-if="item.evidencia"
                        :src="item.evidencia"
                        class="img-evidencia"
                        spinner-color="primary"
                      />
                      <q-btn
                        icon="cloud_upload"
                        size="sm"
                        color="primary"
                        flat
                        @click="$refs['fileEvidencia' + idx][0].click()"
                      />
                      <input
                        :ref="'fileEvidencia' + idx"
                        type="file"
                        accept="image/*"
                        style="display: none"
                        @change="onEvidenciaFileChange($event, idx)"
                      />
                      <q-btn
                        icon="delete"
                        size="xs"
                        color="red"
                        @click="eliminarItem(idx)"
                        flat
                      />
                    </div>
                  </div>
                </q-expansion-item>
              </q-expansion-item>
              <q-expansion-item label="Consumismo" icon="shopping_cart">
                <q-toggle
                  v-model="atletaEdita.consumismo[0].tenis_crossfit"
                  label="¿Usa tenis de crossfit?"
                  left-label
                />
                <q-select
                  v-model="atletaEdita.consumismo[0].accesorios"
                  :options="[
                    'muñequeras',
                    'cinturón',
                    'rodilleras',
                    'calleras',
                    'otros',
                  ]"
                  label="Accesorios"
                  multiple
                  dense
                  use-chips
                  use-input
                  new-value-mode="add"
                  map-options
                />
                <q-select
                  v-model="atletaEdita.consumismo[0].programaciones"
                  :options="['mayhem', 'invictus', 'comptrain', 'otros']"
                  label="Programaciones"
                  multiple
                  dense
                  use-chips
                  use-input
                  new-value-mode="add"
                  map-options
                />
              </q-expansion-item>
            </q-form>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancelar" v-close-popup />
            <q-btn
              flat
              label="Guardar"
              color="primary"
              @click="guardarCambios"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useStoreAtleta } from "../stores/perfilAtleta.js";
import { useStoreUsuarios } from "../stores/usuario.js";
import { useStoreItems } from "../stores/items.js";
import { Notify } from "quasar";
import axios from "axios";

const useAtleta = useStoreAtleta();
const useUsuario = useStoreUsuarios();
const useItems = useStoreItems();
const filtro = ref("");
const mostrarDialogo = ref(false);
const mostrarDetalle = ref(false);
const atletaEdita = ref({});
const atletaDetalle = ref(null);
const editando = ref(false);
const tab = ref("general");

const sexoOptions = [
  { label: "Masculino", value: "M" },
  { label: "Femenino", value: "F" },
  { label: "No especifica", value: "NO_ESPECIFICA" },
];

const plieguesKeys = [
  "biceps",
  "triceps",
  "escapula",
  "abdomen",
  "suprailiaco",
  "pectoral",
  "pierna",
  "pantorrilla",
];
const perimetrosKeys = [
  "pectoral",
  "hombro",
  "cuello",
  "biceps_relajado",
  "biceps_contraido",
  "abdomen",
  "cintura",
  "cadera",
  "muslo_mayor",
  "pantorrilla",
];

const columns = [
  { name: "nombre", label: "Nombre", field: "nombre", align: "left" },
  { name: "edad", label: "Edad", field: "edad", align: "left" },
  { name: "correo", label: "Correo", field: "correo", align: "left" },
  { name: "telefono", label: "Teléfono", field: "telefono", align: "left" },
  { name: "puntos", label: "Puntos", field: "puntos", align: "center" },
  { name: "acciones", label: "Acciones", field: "acciones", align: "center" },
];

// -----------  DEFINICIÓN FUNCION QUE FALTABA  -----------
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
// -------------------------------------------------------
const unidadSeleccionada = computed(() => {
  const item = itemsFiltrados.value.find(
    (i) => i._id === itemSeleccionado.value
  );
  return item?.medida || "";
});
function buscarUnidad(id) {
  const item = useItems.items.find((i) => i._id === id);
  return item ? item.medida : "";
}

const editarAtleta = (row) => {
  atletaEdita.value = JSON.parse(JSON.stringify(row));
  if (!atletaEdita.value.datos_antropometricos) {
    atletaEdita.value.datos_antropometricos = {};
  }
  if (!atletaEdita.value.datos_antropometricos.pliegues_cutaneos) {
    atletaEdita.value.datos_antropometricos.pliegues_cutaneos = {};
  }
  if (!atletaEdita.value.datos_antropometricos.perimetros_musculares) {
    atletaEdita.value.datos_antropometricos.perimetros_musculares = {};
  }
  if (
    !Array.isArray(atletaEdita.value.consumismo) ||
    atletaEdita.value.consumismo.length === 0
  ) {
    atletaEdita.value.consumismo = [
      {
        tenis_crossfit: false,
        accesorios: [],
        programaciones: [],
      },
    ];
  }
  editando.value = true;
  mostrarDialogo.value = true;
};

const crearAtleta = () => {
  atletaEdita.value = {
    usuario_id: useUsuario.usuario._id,
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
    consumismo: [
      {
        tenis_crossfit: false,
        accesorios: [],
        programaciones: [],
      },
    ],
  };
  editando.value = false;
  mostrarDialogo.value = true;
};

const guardarCambios = async () => {
  try {
    parseNumericos(atletaEdita.value.datos_antropometricos);

    if (!editando.value) {
      const ids = atletaEdita.value.items.map((i) => i.item_id?.toString());
      const set = new Set(ids);
      if (set.size !== ids.length) {
        Notify.create({
          type: "negative",
          message: "No se pueden repetir los mismos items en un atleta.",
        });
        return;
      }
      if (typeof limpiarItemsDuplicados === "function") {
        atletaEdita.value.items = limpiarItemsDuplicados(
          atletaEdita.value.items
        );
      }
    }

    if (Array.isArray(atletaEdita.value.items)) {
      atletaEdita.value.items.forEach((item) => {
        if (
          item.valor !== undefined &&
          item.valor !== null &&
          !isNaN(item.valor)
        ) {
          item.valor = Number(item.valor);
        }
      });
    }

    const token = useUsuario.token;
    if (editando.value) {
      await useAtleta.editar(atletaEdita.value._id, atletaEdita.value, token);
      Notify.create({ type: "positive", message: "Atleta actualizado" });
    } else {
      const res = await useAtleta.crear(atletaEdita.value, token);
      if (!res.success) {
        Notify.create({
          type: "negative",
          message: res.msg || "Error al crear atleta",
        });
        return;
      }
      Notify.create({ type: "positive", message: "Atleta creado" });
    }
    mostrarDialogo.value = false;
    await useAtleta.getAll(token);
  } catch (e) {
    Notify.create({
      type: "negative",
      message: e?.response?.data?.msg || e?.message || "Error al guardar",
    });
  }
};

function limpiarItemsDuplicados(items) {
  const mapa = new Map();
  items.forEach((item) => {
    mapa.set(item.item_id, item);
  });
  return Array.from(mapa.values());
}

const borrarAtleta = async (id) => {
  if (confirm("¿Seguro que deseas eliminar este atleta?")) {
    const token = useUsuario.token;
    await useAtleta.eliminar(id, token);
    Notify.create({ type: "positive", message: "Eliminado" });
    await useAtleta.getAll(token);
  }
};

const verDetalle = (row) => {
  atletaDetalle.value = row;
  tab.value = "general";
  mostrarDetalle.value = true;
};

onMounted(async () => {
  const token = useUsuario.token;
  await useAtleta.getAll(token);
  await useItems.getAll(token);
  itemsFiltrados.value = useItems.items;
  mostrarDetalle.value = false;
});

watch(
  () => useAtleta,
  () => {
    const token = useUsuario.token;
    useAtleta.getAll(token);
  },
  { immediate: true, deep: true }
);

// colores imc
// Devuelve la clase según el valor del IMC para el detalle
function colorIMCDetalle(imc) {
  if (imc == null || isNaN(imc)) return ''
  if (imc < 18) return 'imc-bajo'
  if (imc >= 18 && imc <= 25) return 'imc-normal'
  if (imc > 25 && imc <= 30) return 'imc-sobrepeso'
  if (imc > 30) return 'imc-obesidad'
  return ''
}

// Computed para el color de IMC en el formulario de edición
const colorIMCEdita = computed(() => {
  const imc = Number(imcEdita.value)
  if (!imc) return ''
  if (imc < 18) return 'imc-bajo'
  if (imc >= 18 && imc <= 25) return 'imc-normal'
  if (imc > 25 && imc <= 30) return 'imc-sobrepeso'
  if (imc > 30) return 'imc-obesidad'
  return ''
})



// detalle imc

const imcEdita = computed(() => {
  const d = atletaEdita.value?.datos_antropometricos;
  if (!d) return "";
  const peso = Number(d.peso_kg);
  const estatura = Number(d.estatura_cm);
  if (peso > 0 && estatura > 0) {
    return (peso / Math.pow(estatura / 100, 2)).toFixed(2);
  }
  return "";
});

const filtrados = computed(() =>
  Array.isArray(useAtleta.lista)
    ? useAtleta.lista.filter((a) =>
        a.nombre?.toLowerCase().includes(filtro.value.toLowerCase())
      )
    : []
);

const itemBusqueda = ref("");
const itemSeleccionado = ref(null);
const valorItem = ref("");
const itemsFiltrados = ref([]);

function filtrarItems() {
  itemsFiltrados.value = useItems.items.filter((i) =>
    i.descripcion.toLowerCase().includes(itemBusqueda.value.toLowerCase())
  );
}

function agregarItem() {
  if (itemSeleccionado.value && valorItem.value) {
    atletaEdita.value.items = atletaEdita.value.items || [];
    atletaEdita.value.items.push({
      item_id: itemSeleccionado.value,
      valor: valorItem.value,
    });
    itemSeleccionado.value = null;
    valorItem.value = "";
  }
}

function eliminarItem(idx) {
  atletaEdita.value.items.splice(idx, 1);
}

function buscarDescripcion(id) {
  const item = useItems.items.find((i) => i._id === id);
  return item ? item.descripcion : "";
}

const onEvidenciaFileChange = async (e, idx) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const formData = new FormData();
    formData.append("evidencia", file);
    const atletaId = atletaEdita.value._id;
    const itemId =
      atletaEdita.value.items[idx]._id || atletaEdita.value.items[idx].item_id;
    const token = useUsuario.token;
    const url = `https://gim-crossfit.onrender.com/api/atleta/subir-evidencia/${atletaId}/${itemId}`;
    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-token": token,
      },
    });
    atletaEdita.value.items[idx].evidencia = response.data.evidencia;
    Notify.create({ type: "positive", message: "Imagen subida con éxito" });
  } catch (error) {
    Notify.create({
      type: "negative",
      message: error?.response?.data?.msg || error.message,
    });
    console.error("ERROR al subir imagen:", error);
  }
};
</script>



<style scoped>
.tabla-wrapper {
  background: rgba(255, 255, 255, 0.97);
  border-radius: 12px;
  padding: 24px;
  margin: 32px auto;
  max-width: 1200px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
}

.letra-normal {
  font-family: "Roboto", Arial, sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: #222;
}
.item-card {
  background: #f9f9fb;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 18px 20px;
  margin-bottom: 18px;
  transition: box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.item-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.q-mt-md {
  margin-top: 2px;
}
.item-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: #1976d2;
  margin-bottom: 4px;
}
.item-label {
  font-size: 1rem;
  color: #444;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
}
.item-value {
  margin-left: 6px;
  color: #222;
  font-weight: 500;
}
.cerrar-btn {
  background: linear-gradient(90deg, #f44336 0%, #e57373 100%);
  color: #fff !important;
  border-radius: 8px;
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 6px 22px;
  box-shadow: 0 2px 8px rgba(244, 67, 54, 0.08);
  transition: background 0.2s, box-shadow 0.2s;
}
.cerrar-btn:hover {
  background: linear-gradient(90deg, #e53935 0%, #d32f2f 100%);
  box-shadow: 0 4px 16px rgba(244, 67, 54, 0.18);
}
.no-bg {
  background: none !important;
  box-shadow: none !important;
  border-radius: 0 !important;
  padding-left: 0;
  padding-right: 0;
}
@media (max-width: 600px) {
  .item-card {
    padding: 12px 8px;
    font-size: 0.95rem;
  }
  .item-title {
    font-size: 1rem;
  }
  .item-label {
    font-size: 0.95rem;
  }
}


/* estilos botones colores */

.imc-bajo {
  color: #1976d2 !important; /* azul: Quasar blue-8 */
  font-weight: bold;
}
.imc-normal {
  color: #388e3c !important; /* verde: Quasar green-8 */
  font-weight: bold;
}
.imc-sobrepeso {
  color: #ffa726 !important; /* naranja claro: Quasar orange-4 */
  font-weight: bold;
}
.imc-obesidad {
  color: #e65100 !important; /* naranja oscuro: Quasar orange-10 */
  font-weight: bold;
}



/* estilos para items  */
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
  .item-block-wrapper,
  .item-card-display {
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
