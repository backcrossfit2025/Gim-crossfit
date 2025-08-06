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
        <div class="text-h5 text-bold q-mb-xs">
          ¡Bienvenido a nuestros Gym Crossfit!
        </div>
        <div class="text-subtitle2 text-grey-7 q-mb-md">
          Crea tu cuenta para comenzar
        </div>
      </q-card-section>
      <q-card-section>
        <q-input
          v-model="nombre"
          label="Nombre"
          filled
          dense
          :rules="[(val) => !!val || 'Campo requerido']"
          class="q-mb-md"
        />
        <q-input
          v-model="email"
          label="Email"
          filled
          dense
          class="q-mb-md"
          :rules="[(val) => !!val || 'Campo requerido']"
        />
<q-input
  v-model="password"
  :type="isPasswordVisible ? 'text' : 'password'"
  label="Contraseña"
  filled
  dense
  class="q-mb-md"
  :rules="[val => val.length >= 8 || 'Mínimo 8 caracteres']"
>
  <template #append>
    <q-icon
      :name="isPasswordVisible ? 'visibility_off' : 'visibility'"
      class="cursor-pointer"
      @click="togglePasswordVisibility"
    />
  </template>
</q-input>

        <div class="q-mb-md q-mt-sm text-caption text-grey-8 autorizacion-box">
          <q-checkbox
            v-model="autorizacionDatos"
            color="primary"
            size="md"
            :rules="[
              (val) =>
                val || 'Debes autorizar el tratamiento de datos personales',
            ]"
          >
            <span>
              Autorizo el
              <strong>tratamiento de mis datos personales</strong> conforme a la
              Ley 1581 de 2012.
            </span>
          </q-checkbox>
        </div>
      </q-card-section>
      <q-card-actions align="right" class="q-pt-none">
        <q-btn flat label="Cancelar" color="negative" @click="close" />
        <q-btn
          :disable="loading"
          label="Registrar"
          color="primary"
          @click="register"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import { useStoreUsuarios } from "../stores/usuario.js";
import { Notify } from "quasar";

const props = defineProps({ show: Boolean });
const emit = defineEmits(["close", "registered"]);

const show = ref(props.show);
watch(
  () => props.show,
  (val) => (show.value = val)
);

const nombre = ref("");
const email = ref("");
const password = ref("");
const loading = ref(false);
const useUsuarios = useStoreUsuarios();
const autorizacionDatos = ref(false);

function close() {
  emit("close");
}

async function register() {
  if (
    !nombre.value ||
    !email.value ||
    password.value.length < 8 ||
    !autorizacionDatos.value
  ) {
    Notify.create({
      type: "negative",
      message:
        "Completa todos los campos y autoriza el tratamiento de datos personales.",
    });
    return;
  }

  loading.value = true;

  const res = await useUsuarios.agregar({
    nombre: nombre.value,
    email: email.value,
    password: password.value,
    rol: "cliente",
    autorizacion_datos_personales: autorizacionDatos.value, // ✅ Aquí lo enviamos
  });

  loading.value = false;

  if (res.success) {
    Notify.create({
      type: "positive",
      message: "Usuario registrado correctamente. Ahora puedes iniciar sesión.",
    });
    close();
  } else {
    Notify.create({
      type: "negative",
      message: res.msg || "Error al registrar.",
    });
  }
}

// vista contraseña
const isPasswordVisible = ref(false)
const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}

</script>

<style scoped>
.register-card {
  max-width: 400px;
  border-radius: 22px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
  background: #fff;
  padding: 0 8px 8px 8px;
  border: 1.5px solid #765c5cff;
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

/* estilos boton check */
.autorizacion-box {
  background-color: #f8f8f8;
  border-radius: 10px;
  padding: 12px;
  border: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 1.4;
}

@media (max-width: 400px) {
  .register-card {
    width: 90vw;
  }

  .autorizacion-box {
    font-size: 13px;
    padding: 10px;
  }
}
</style>
