<template>
  <div style="background-color: white;">
    <div style="margin: 10px;">
      <div style="display:flex; justify-content: space-between; align-items: center;">
        <h2 style="color: orange; margin: 0;">Usuarios</h2>
        <q-btn 
          @click="abrirDialogCrear" 
          color="orange" 
          icon="add" 
          label="CREAR" 
          text-color="white" 
        />
      </div>
      <q-table
        title=""
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
            <q-btn
              v-if="props.row.estado==0"
              @click="cambiarEstado(props.row)"
              class="q-ml-sm"
              color="red"
              icon="cancel"
              size="sm"
              :loading="loadingId === props.row._id && loadingEstado"
              :disable="loadingId === props.row._id && loadingEstado"
            />
            <q-btn
              v-else
              @click="cambiarEstado(props.row)"
              class="q-ml-sm"
              color="green"
              icon="check_circle"
              size="sm"
              :loading="loadingId === props.row._id && loadingEstado"
              :disable="loadingId === props.row._id && loadingEstado"
            />
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
            <div class="text-h6">{{ b ? "Editar Usuario" : "Guardar Usuario" }}</div>
          </q-card-section>

          <q-separator />

          <q-card-section style="max-height: 50vh" class="scroll">
            <q-input filled v-model="ema" label="Email usuario" :dense="dense" />
            <q-input filled v-model="nom" label="Nombre usuario" :dense="dense" />
            <q-input v-if="!b" filled v-model="password" label="Contraseña" :dense="dense" type="password" />
          </q-card-section>

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
            <span class="q-ml-sm">Seguro Quieres Eliminar el usuario</span>
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
import { onBeforeMount, ref, watch } from "vue"
import { Notify, useQuasar, Dark } from 'quasar'
import { useStoreUsuarios } from '../stores/usuario.js'

const useUsuario = useStoreUsuarios();
const $q = useQuasar();
const confirm = ref(false);
const fixed = ref(false);
const ema = ref("");
const nom = ref("");
const password = ref("");
const b = ref(false);
const id = ref("");
const isDark = ref(Dark.isActive);
const rows = ref([]);
const dense = ref(true);
const loadingEstado = ref(false);
const loadingId = ref(null); // <-- Para saber qué botón está cargando

watch(isDark, (val) => {
  Dark.set(val)
})

onBeforeMount(async () => {
  await traer()
})

async function traer() {
  const res = await useUsuario.getAll()
  if (Array.isArray(res)) {
    rows.value = res
  } else if (res && res.data) {
    rows.value = res.data
  } else {
    rows.value = []
  }
}

function traerDatos(datos) {
  id.value = datos._id
  fixed.value = true
  b.value = true
  ema.value = datos.email
  nom.value = datos.nombre
}

function cerrar() {
  b.value = false
  ema.value = ""
  nom.value = ""
  password.value = ""
}

function abrirDialogCrear() {
  b.value = false
  ema.value = ""
  nom.value = ""
  password.value = ""
  fixed.value = true
}

// Cambiar estado (activar/desactivar) con spinner y espera de 2s
async function cambiarEstado(user) {
  if (loadingEstado.value) return // Bloquea clicks múltiples
  loadingEstado.value = true
  loadingId.value = user._id
  let res
  if (user.estado == 0) {
    res = await useUsuario.activarUsuario(user._id)
    if (res.success) {
      Notify.create({ type: 'positive', message: 'Usuario activado correctamente.' })
    } else {
      Notify.create({ type: 'negative', message: res.msg || 'Error al activar usuario.' })
    }
  } else {
    res = await useUsuario.desactivarUsuario(user._id)
    if (res.success) {
      Notify.create({ type: 'warning', message: 'Usuario desactivado correctamente.' })
    } else {
      Notify.create({ type: 'negative', message: res.msg || 'Error al desactivar usuario.' })
    }
  }
  await traer()
  setTimeout(() => {
    loadingEstado.value = false
    loadingId.value = null
  }, 2000) // Espera 2 segundos antes de permitir otro click
};


async function crearFicha() {
  if (b.value === true) {
    // Validación: que el correo no esté repetido (al editar)
    const correoExistente = rows.value.find(u => u.email === ema.value && u._id !== id.value)
    if (correoExistente) {
      Notify.create({ type: 'negative', message: 'El correo ya está registrado en otro usuario.' })
      return
    }
    // Editar
    const res = await editarFicha()
    if (res?.success) {
      Notify.create({ type: 'positive', message: 'Usuario editado con éxito.' })
      await traer()
      fixed.value = false
    } else {
      Notify.create({ type: 'negative', message: res?.msg || 'Error al editar usuario.' })
      fixed.value = true
    }
  } else {
    // Validación: que el correo no esté repetido (al crear)
    const correoExistente = rows.value.find(u => u.email === ema.value)
    if (correoExistente) {
      Notify.create({ type: 'negative', message: 'El correo ya está registrado.' })
      return
    }
    // Crear
    if (useUsuario.agregar) {
      let res = await useUsuario.agregar({
        email: ema.value,
        nombre: nom.value,
        password: password.value,
        rol: "cliente"
      })
      if (res?.success) {
        Notify.create({ type: 'positive', message: 'Usuario creado con éxito.' })
        await traer()
        fixed.value = false
      } else {
        Notify.create({ type: 'negative', message: res?.msg || 'Error al crear usuario.' })
        fixed.value = true
      }
    }
  }
}

async function editarFicha() {
  if (useUsuario.editar) {
    let res = await useUsuario.editar(id.value,{
      nombre: nom.value,
      email: ema.value, 
      rol: "cliente" 
    })
    return res
  }
}

async function eliminarFicha() {
  if (useUsuario.eliminarUsuario && id.value) {
    await useUsuario.eliminarUsuario(id.value)
    await traer()
    confirm.value = false
  }
}

const columns = ref([
  {
    name: 'nombre1', required: true, label: 'Nombre usuario',
    align: 'center',
    field: "nombre",
    sortable: true
  },
  { name: 'codigo1', align: 'center', label: 'Email', field: 'email', sortable: true },
  { name: 'estado1', align: 'center', label: 'Estado', field: 'estado', sortable: true },
  { name: 'rol', align: 'center', label: 'Rol', field: 'rol', sortable: true },
  { name: 'opciones', label: 'Opciones', align: 'center' },
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
