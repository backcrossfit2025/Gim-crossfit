<template>
  <q-dialog v-model="show">
    <q-card class="register-card">
      <q-card-section class="text-center q-pb-none">
        <q-avatar size="64px" class="q-mb-sm">
          <img src="../assets/logo_3.png" alt="Logo Crossfit" />
        </q-avatar>
        <!-- <q-avatar size="80px" class="q-mb-sm" color="orange" text-color="white">
  <img src="/ruta/del/gif_crossfit.gif" alt="CrossFit" style="object-fit:cover;width:100%;height:100%;" />
</q-avatar> -->
        <div class="text-h5 text-bold q-mb-xs">¡Bienvenido a nuestros Gym Crossfit!</div>
        <div class="text-subtitle2 text-grey-7 q-mb-md">Crea tu cuenta para comenzar</div>
      </q-card-section>
      <q-card-section>
        <q-input v-model="nombre" label="Nombre" filled dense :rules="[val => !!val || 'Campo requerido']" class="q-mb-md" />
        <q-input v-model="email" label="Email" filled dense class="q-mb-md" :rules="[val => !!val || 'Campo requerido']" />
        <q-input v-model="password" label="Contraseña" type="password" filled dense class="q-mb-md" :rules="[val => val.length >= 8 || 'Mínimo 8 caracteres']" />
      </q-card-section>
      <q-card-actions align="right" class="q-pt-none">
        <q-btn flat label="Cancelar" color="negative" @click="close" />
        <q-btn :disable="loading" label="Registrar" color="primary" @click="register" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useStoreUsuarios } from '../stores/usuario.js'
import { Notify } from 'quasar'

const props = defineProps({ show: Boolean })
const emit = defineEmits(['close', 'registered'])

const show = ref(props.show)
watch(() => props.show, val => show.value = val)

const nombre = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const useUsuarios = useStoreUsuarios()

function close() {
  emit('close')
}

async function register() {
  if (!nombre.value || !email.value || password.value.length < 8) return
  loading.value = true
  const res = await useUsuarios.agregar({
    nombre: nombre.value,
    email: email.value,
    password: password.value,
    rol: 'cliente'
  })
  loading.value = false
  if (res.success) {
    Notify.create({ type: 'positive', message: 'Usuario registrado correctamente. Ahora puedes iniciar sesión.' })
    close()
  } else {
    Notify.create({ type: 'negative', message: res.msg || 'Error al registrar.' })
  }
}
</script>

<style scoped>
.register-card {
  max-width: 400px;
  border-radius: 22px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
  background: #fff;
  padding: 0 8px 8px 8px;
  border: 1.5px solid #765C5CFF;
  transition: box-shadow 0.2s;
  border-radius: 22px;
}
.register-card:hover {
  box-shadow: 0 12px 36px 0 rgba(31, 38, 135, 0.22);
}
.q-card-section {
  padding-left: 24px !important;
  padding-right: 24px !important;
}
.q-card-actions {
  padding-right: 24px !important;
  padding-bottom: 16px !important;
}
.q-avatar {
  margin-bottom: 8px;
}
.text-h5 {
  letter-spacing: 0.5px;
}
</style>