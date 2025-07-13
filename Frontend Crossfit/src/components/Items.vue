<template>
  <div style="background-color: white;">
    <div style="margin: 10px;">
      <div style="display:flex; justify-content: space-between; align-items: center;">
        <h2 style="color: orange; margin: 0;">Items</h2>
        <q-btn 
          @click="abrirDialogCrear" 
          color="orange" 
          icon="add" 
          label="CREAR" 
          text-color="white" 
        />
      </div>
      <q-table
        :rows="rows"
        :columns="columns"
        row-key="_id"
        flat
        bordered
        :dense="true"
      >
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props" align="center">
            <q-btn @click="traerDatos(props.row)" color="green" icon="edit" size="sm"></q-btn>
            <q-btn @click="confirmarEliminar(props.row._id)" class="q-ml-sm" color="red" icon="delete" size="sm"></q-btn>
          </q-td>
        </template>
        <template v-slot:body-cell-estado1="props">
          <q-td :props="props" align="center">
            <q-chip
              :color="props.row.estado === 1 ? 'green' : 'red'"
              text-color="white"
              square
              :label="props.row.estado === 1 ? 'Activo' : 'Inactivo'"
            />
          </q-td>
        </template>
      </q-table>
      <q-dialog v-model="fixed" :backdrop-filter="'blur(4px) saturate(150%)'" transition-show="rotate" transition-hide="rotate" persistent>
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ b ? "Editar Items" : "Guardar Items" }}</div>
          </q-card-section>

          <q-separator />

          <q-card-section style="max-height: 50vh" class="scroll">
            <q-input filled v-model="descripcion" label="Descripción" :dense="dense" />
            <q-input filled v-model="medida" label="Medida" :dense="dense" />
            <q-input filled v-model="principianteRef" label="Principiante Ref" type="number" :dense="dense" />
            <q-input filled v-model="intermedioRef" label="Intermedio Ref" type="number" :dense="dense" />
            <q-input filled v-model="avanzadoRef" label="Avanzado Ref" type="number" :dense="dense" />
            <q-input filled v-model="funcion" label="Función (1 = ascendente, 2 = descendente)" type="number" :dense="dense" />
          </q-card-section>
          <!-- Leyenda fuera del cuadro de inputs -->
          <div style="padding: 0 24px 10px 24px; color: #777; font-size: 13px;">
            2: El valor es mejor cuanto menor es (ej: tiempo). 1: Mejor cuanto mayor es (ej: peso)
          </div>
          <q-separator />

          <q-card-actions align="right">
            <q-btn flat label="Cerrar" color="red" v-close-popup @click="cerrar" />
            <q-btn flat label="Guardar" color="primary" @click="crearFicha" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="confirm" persistent :backdrop-filter="'blur(4px) saturate(150%)'" transition-show="rotate" transition-hide="rotate">
        <q-card>
          <q-card-section class="row items-center">
            <span class="q-ml-sm">¿Seguro que quieres eliminar este Item?</span>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="primary" v-close-popup />
            <q-btn @click="eliminarFicha" flat label="Aceptar" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-toggle v-model="isDark" label="Modo Oscuro" />
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, onMounted, ref, watch } from "vue"
import { Notify, useQuasar, Dark } from 'quasar'
import { useStoreItems } from '../stores/items.js'
import { useStoreUsuarios } from '../stores/usuario.js'
const useItems = useStoreItems()
const useUsuario = useStoreUsuarios()
const $q = useQuasar()
const confirm = ref(false)
const fixed = ref(false)
const b = ref(false)
const id = ref("")
const isDark = ref(Dark.isActive)
const rows = ref([])
const dense = ref(true)
const descripcion = ref("")
const medida = ref("")
const principianteRef = ref("")
const intermedioRef = ref("")
const avanzadoRef = ref("")
const funcion = ref("")

watch(isDark, (val) => {
  Dark.set(val)
})

onBeforeMount(async () => {
  await traer()
})

onMounted(async () => {
  const token = useUsuario.token
  await useItems.getAll(token)
  rows.value = Array.isArray(useItems.items) ? useItems.items : []
})

async function traer() {
  const token = useUsuario.token
  const res = await useItems.getAll(token)
  rows.value = Array.isArray(res) ? res : []
}

function traerDatos(datos) {
  id.value = datos._id
  descripcion.value = datos.descripcion
  medida.value = datos.medida
  principianteRef.value = datos.principianteRef
  intermedioRef.value = datos.intermedioRef
  avanzadoRef.value = datos.avanzadoRef
  funcion.value = datos.funcion
  fixed.value = true
  b.value = true
}

function cerrar() {
  b.value = false
  descripcion.value = ""
  medida.value = ""
  principianteRef.value = ""
  intermedioRef.value = ""
  avanzadoRef.value = ""
  funcion.value = ""
}

function abrirDialogCrear() {
  b.value = false
  descripcion.value = ""
  medida.value = ""
  principianteRef.value = ""
  intermedioRef.value = ""
  avanzadoRef.value = ""
  funcion.value = ""
  fixed.value = true
}

function confirmarEliminar(itemId) {
  id.value = itemId
  confirm.value = true
}

async function crearFicha() {
  // Validar que no se repita descripción
  const yaExiste = rows.value.some(item =>
    item.descripcion.trim().toLowerCase() === descripcion.value.trim().toLowerCase()
  )
  if (!b.value && yaExiste) {
    Notify.create({ type: 'negative', message: 'Ya existe un item con esa descripción.' })
    return
  }

  if (b.value === true) {
    // Editar
    const res = await editarFicha()
    if (res?.success) {
      Notify.create({ type: 'positive', message: 'Item editado con éxito.' })
      await traer()
      fixed.value = false
    } else {
      Notify.create({ type: 'negative', message: res?.msg || 'Error al editar item.' })
      fixed.value = true
    }
  } else {
    // Crear
    if (useItems.crear) {
      const token = useUsuario.token
      let data = {
        descripcion: descripcion.value,
        medida: medida.value,
        principianteRef: principianteRef.value,
        intermedioRef: intermedioRef.value,
        avanzadoRef: avanzadoRef.value,
        funcion: funcion.value
      }
      let res = await useItems.crear(data, token)
      if (res?.success) {
        Notify.create({ type: 'positive', message: 'Item creado con éxito.' })
        await traer()
        fixed.value = false
      } else {
        Notify.create({ type: 'negative', message: res?.msg || 'Error al crear item.' })
        fixed.value = true
      }
    }
  }
}

async function editarFicha() {
  if (useItems.editar) {
    let res = await useItems.editar(id.value,{
      descripcion: descripcion.value, 
      medida: medida.value, 
      principianteRef: principianteRef.value, 
      intermedioRef: intermedioRef.value, 
      avanzadoRef: avanzadoRef.value, 
      funcion: funcion.value 
    })
    await traer()
    return res
  }
}

async function eliminarFicha() {
  if (useItems.eliminar && id.value) {
    const token = useUsuario.token
    const res = await useItems.eliminar(id.value, token)
    if(res?.success){
      Notify.create({ type: 'positive', message: 'Item eliminado correctamente.' })
      await traer()
      confirm.value = false
    } else {
      Notify.create({ type: 'negative', message: res?.msg || 'Error al eliminar item.' })
    }
  }
}

const columns = ref([
  { name: 'descripcion', label: 'Descripción', field: 'descripcion', align: 'center', sortable: true },
  { name: 'medida', label: 'Medida', field: 'medida', align: 'center', sortable: true },
  { name: 'principianteRef', label: 'Principiante Ref', field: 'principianteRef', align: 'center', sortable: true },
  { name: 'intermedioRef', label: 'Intermedio Ref', field: 'intermedioRef', align: 'center', sortable: true },
  { name: 'avanzadoRef', label: 'Avanzado Ref', field: 'avanzadoRef', align: 'center', sortable: true },
  { name: 'funcion', label: 'Función', field: 'funcion', align: 'center', sortable: true },
  { name: 'opciones', label: 'Opciones', align: 'center' }
])
</script>




<style scoped>
.q-btn {
  border-radius: 5px;
  font-size: 14px;
}

.q-table {
  border: 1px solid #ddd;
  background-color: white;
}

.q-td {
  padding: 8px;
}

.q-th, .q-td {
  text-align: center;
}

.q-chip {
  font-size: 12px;
  text-transform: uppercase;
}

.q-toolbar-title {
  font-size: 24px;
  font-weight: bold;
}

h2 {
  font-size: 24px;
  color: #3a9a42;
}
</style>
