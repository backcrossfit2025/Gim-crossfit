<script setup>
import { computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import Login from "./Login.vue";
import Usuarios from "./Usuarios.vue";
import PerfilAtleta from "./PerfilAtleta.vue";
import { useStoreUsuarios } from "../stores/usuario.js";
import { useStoreAtleta } from "../stores/perfilAtleta.js"

const store = useStoreUsuarios();
const useAtleta = useStoreAtleta();
const router = useRouter();
const route = useRoute();
const mostrarModalLogin = ref(false);
const drawerOpen = ref(true);
const isMobile = ref(window.innerWidth < 650) // Cambiado a 650px
const soloPropio = route.meta.soloPropio || false;

// Computed para saber si está logueado y el rol
const estaLogueado = computed(() => !!store.token);
const rolUsuario = computed(() => store.usuario?.rol || null);
const drawerWidth = computed(() => isMobile.value ? 120 : 220);

function cerrarSesion() {
  store.logout();
  router.push("/");
}

function handleResize() {
  isMobile.value = window.innerWidth < 650; // Cambiado a 650px
  if (isMobile.value) {
    drawerOpen.value = false;
  } else {
    drawerOpen.value = true;
  }
}

window.addEventListener('resize', handleResize);
handleResize();
</script>

<template>
  
  <q-layout view="lHh Lpr lFf">
    <!-- Botón hamburguesa solo en móvil (ahora < 650px) -->
    <q-btn
      v-if="estaLogueado && rolUsuario === 'administrador' && isMobile"
      icon="menu"
      color="orange"
      class="q-mx-md q-mt-md"
      @click="drawerOpen = true"
      style="position: fixed; top: 16px; left: 16px; z-index: 2001;"
    />
    <!-- Sidebar solo para administradores logueados -->
    <q-drawer
      v-if="estaLogueado && rolUsuario === 'administrador'"
      v-model="drawerOpen"
      side="left"
      :width="drawerWidth"
      :behavior="isMobile ? 'overlay' : 'desktop'"
      class="bg-dark text-white admin-sidebar"
      bordered
    >

      <q-list>
        <q-item clickable v-ripple to="/usuarios" tag="router-link" class="sidebar-toronja-item">
          <q-item-section avatar>
            <q-icon name="people" />
          </q-item-section>
          <q-item-section>Usuarios</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/atletas" tag="router-link" class="sidebar-toronja-item">
          <q-item-section avatar>
            <q-icon name="fitness_center" />
          </q-item-section>
          <q-item-section>Perfil Atleta</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/items" tag="router-link" class="sidebar-toronja-item">
          <q-item-section avatar>
           <q-icon name="inventory_2" />
          </q-item-section>
          <q-item-section>Items</q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="cerrarSesion">
          <q-item-section avatar>
            <q-icon name="logout" color="orange" />
          </q-item-section>
          <q-item-section style="color: #E27A54FF; font-weight: 600;">Cerrar sesión</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>


    <!-- Tu navbar y resto del contenido -->
    <q-page-container>
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark header-navbar">
        <div class="container-fluid header-flex">
          
          <a class="navbar-brand header-brand">
            <img src="../assets/logo_2.png" alt="Logo" class="logo-img" />
            <h4 class="navbar-quote">
              {{ estaLogueado && rolUsuario === 'cliente'
                ? '“Prohibido rendirse, trainers col.”'
                : '"Prohibido rendirse, Respira hondo y sigue."' }}
            </h4>
          </a>
          <div class="collapse navbar-collapse" id="navbarNavDropdown">
            <ul class="navbar-nav ms-auto"></ul>
            <div class="d-flex align-items-center ms-2">
              <button
                v-if="store.token"
                @click="cerrarSesion"
                class="logout-btn ms-2"
              >
                Cerrar sesión
              </button>
              <i
                v-else
                class="bi bi-person-circle login-icon ms-3"
                @click="mostrarModalLogin = true"
              />
              <q-dialog v-model="mostrarModalLogin" persistent>
<q-card style="min-width:350px;max-width:90vw; border-radius:35px;">
                  <q-card-section>
                    <Login @close="mostrarModalLogin = false" />
                  </q-card-section>
                </q-card>
              </q-dialog>
            </div>
            
          </div>
        </div>
        <div class="content" style="width: 100%;">
        <q-btn
            v-if="estaLogueado && rolUsuario === 'cliente'"
            color="deep-orange"
            icon="person"
            label="Mi Perfil"
            @click="router.push('/mi-perfil')"
          />
          <img
            v-if="estaLogueado && rolUsuario === 'cliente'"
            src="../assets/foto_user.jpg"
            alt="Trainers Col"
            class="img-fluid full-screen-img"
            style="width: 100%; object-fit: cover;"
          />
          <img
            v-else
            src="../assets/foto_1.jpg"
            alt="Trainers Col"
            class="img-fluid full-screen-img"
            style="width: 100%; object-fit: cover;"
          />
        </div>
        <!-- <div class="page-content-superpuesto">
            <router-view />
</div> -->
      </nav>
  
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.header-navbar .container-fluid.header-flex {
  display: flex;
  align-items: center;
  gap: 40px;
  padding: 10px 24px;
  justify-content: space-between;
}

.header-brand {
  display: flex;
  align-items: center;
}

.admin-sidebar {
  font-size: 1.1rem;
}

.logo-img {
  width: 320px;
  max-width: 80vw;
  height: auto;
  display: block;
}

.login-icon {
  cursor: pointer;
  color: #fdfefe;
  font-size: 60px;
  transition: color 0.2s;
}

.login-icon:hover {
  color: #f8601d;
}

.logout-btn {
  background: linear-gradient(90deg, #C88F75FF 0%, #9F5634FF 100%);
  color: #fff;
  border: none;
  border-radius: 25px;
  padding: 8px 24px;
  font-weight: 300;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(248, 87, 166, 0.15);
  cursor: pointer;
  transition: background 0.3s, transform 0.2s, box-shadow 0.2s;
  outline: none;
}

.logout-btn:hover {
  background: linear-gradient(90deg, #CE8F68FF 0%, #CB9583FF 100%);
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 4px 16px rgba(248, 87, 166, 0.25);
}

.navbar-quote {
  font-family: "Bebas Neue", "Oswald", Arial, sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #BF8B6DE2;
  margin: 0.5rem 0 0 0;
  letter-spacing: 1px;
  text-align: center;
  line-height: 1.2;
  max-width: 100%;
  word-break: break-word;
}

/* Responsividad */
@media (max-width: 1200px) and (min-width: 900px) {
  .page-content-superpuesto {
    margin-top: -350px;
    padding: 5vw 2vw 4vw 2vw;
    min-height: 55vh;
    margin-top: -650px !important;
  }
}

@media (max-width: 900px) and (min-width: 600px) {
  .header-navbar .container-fluid.header-flex {
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 10px 8px;
    width: 100%;
  }
  .header-brand {
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  .navbar-quote {
    text-align: center;
    width: 100%;
  }
  .logout-btn {
    margin: 12px auto 0 auto;
    display: block;
    float: none;
  }
}

@media (max-width: 900px) {
  .navbar-quote {
    font-size: 1.5rem;
  }
  .admin-sidebar {
    font-size: 1rem;
    padding-top: 10px;
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
  }
  
  .admin-sidebar .q-icon {
    font-size: 1.4rem;
  }
}

@media (max-width: 650px) {
  .admin-sidebar {
    font-size: 0.97rem;
    padding-top: 6px;
    border-radius: 0 10px 10px 0;
    min-height: 100dvh;
    box-shadow: 1px 0 12px 0 rgba(0,0,0,0.15);
  }
  .admin-sidebar .q-list {
    padding-top: 4px;
    padding-bottom: 4px;
  }
  .admin-sidebar .q-item {
    margin: 3px 3px;
    font-size: 0.99em;
  }
  .admin-sidebar .q-icon {
    font-size: 1.2rem;
  }
}

@media (max-width: 600px) {
  .header-navbar .container-fluid.header-flex {
    gap: 10px;
    padding: 10px 4px;
  }
  .logo-img {
    width: 140px;
    max-width: 60vw;
  }
  .login-icon {
    font-size: 42px;
  }
  .navbar-quote {
    font-size: 1.1rem;
    padding: 0 8px;
  }
}

.content {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  padding: 0;
  margin: 0;
}

.full-screen-img {
  width: 100%;
  height:100%;
  object-fit: cover;
  display: block;
}

.page-content-superpuesto[data-v-c3ceb15a]
 {
    /* position: relative; */
    width: 100%;
    margin: 0 auto;
    margin-top: -830px;
    /* min-height: 55vh; */
    background: rgba(255, 255, 255, 0.96);
    border-radius: 16px 16px 0 0;
    box-shadow: 0 4px 28px rgba(0, 0, 0, 0.10);
    padding: 2vw 1vw 3vw 1vw;

    transition: width 0.2s, margin 0.2s;
    z-index: 10;
}

/* .page-content-superpuesto {
    width: 100%;
  margin: 0 auto;
  margin-top: -643px;
  background: rgba(255,255,255,0.96);
  border-radius: 16px 16px 0 0;
  box-shadow: 0 4px 28px rgba(0,0,0,0.10);
  padding: 2vw 1vw 3vw 1vw;
  transition: width 0.2s, margin 0.2s;
  z-index: 10;
} */

/* Sidebar Quasar */
.admin-sidebar .q-list {
  padding-top: 10px;
  padding-bottom: 10px;
}

.admin-sidebar .q-item {
  margin: 4px 8px;
  border-radius: 10px;
  transition: background 0.18s, color 0.18s;
}



.admin-sidebar .q-item-section {
  font-weight: 500;
  font-size: 1em;
}

.admin-sidebar .q-icon {
  color: #FF9800 !important; /* naranja */
  font-size: 1.7rem;
  transition: color 0.2s;
}

.admin-sidebar .q-item:hover .q-icon,
.admin-sidebar .q-item:focus .q-icon {
  color: #fff !important;
}

/* Animación sidebar overlay */
.q-drawer--overlay .admin-sidebar {
  animation: slideInSidebar 0.23s cubic-bezier(.39,.19,.53,1.22);
}
@keyframes slideInSidebar {
  from { transform: translateX(-50px); opacity: 0.5;}
  to { transform: translateX(0); opacity: 1;}
}

.admin-sidebar .sidebar-toronja-item.router-link-exact-active,
.admin-sidebar .sidebar-toronja-item:focus,
.admin-sidebar .sidebar-toronja-item:hover {
  background: linear-gradient(90deg, #C88F75FF 0%, #9F5634FF 100%) !important;
  color: #fff !important;
}
.admin-sidebar .sidebar-toronja-item.router-link-exact-active .q-icon,
.admin-sidebar .sidebar-toronja-item:focus .q-icon,
.admin-sidebar .sidebar-toronja-item:hover .q-icon {
  color: #fff !important;
}


/* menos de 400px */
@media (max-width: 430px) {
  .header-navbar .container-fluid.header-flex {
    flex-direction: column;
    gap: 4px;
    padding: 4px 2px;
  }
  .logo-img {
    width: 90px !important;
    max-width: 38vw !important;
  }
  .navbar-quote {
    font-size: 0.78rem !important;
    padding: 0 3px;
    line-height: 1.1;
  }
  .logout-btn {
    font-size: 0.95rem;
    padding: 7px 13px;
    border-radius: 19px;
  }
  .login-icon {
    font-size: 32px !important;
  }
  .admin-sidebar {
    font-size: 0.85rem !important;
    padding-top: 2px;
    min-width: 98px !important;
  }
  .page-content-superpuesto {
    margin-top: -565px !important;
    border-radius: 12px 12px 0 0;
    /* min-height: 50vh; */
    /* padding: 1vw 0.5vw 2vw 0.5vw; */
  }
  .content {
    height: 35vh !important;
  }
  .full-screen-img {
    min-height: 740px !important;
    max-height: 220px;
    object-fit: cover;
  }
  /* Sidebar compacta */
  .admin-sidebar .q-item,
  .admin-sidebar .q-item-section {
    font-size: 0.90em !important;
    padding: 2px 0;
  }
}
/* boton hamburguesa */
@media (max-width: 430px) {
  .q-btn[icon="menu"] {
    width: 34px !important;
    height: 34px !important;
    min-width: 30px;
    font-size: 22px !important;
    padding: 0;
    border-radius: 10px;
  }
}


</style>
