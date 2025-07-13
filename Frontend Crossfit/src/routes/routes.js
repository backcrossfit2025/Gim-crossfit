import Home from "../components/Home.vue";
import Items from "../components/Items.vue";
import ResetPassword from "../components/ResetPassword.vue";
import PerfilAtleta from "../components/PerfilAtleta.vue";
import Usuarios from "../components/Usuarios.vue";
import perfilAtletaCliente from "../components/perfilAtletaCliente.vue";
import { useStoreUsuarios } from "../stores/usuario.js";
import { createRouter, createWebHashHistory } from "vue-router";
import { Notify } from "quasar";

const routes = [
  { path: "/", component: Home },
  { path: "/home", component: Home },
  { path: "/items", component: Items, meta: { requiereAuth: true, roles: ['administrador'] }  },
  { path: "/reset-password", component: ResetPassword },
  { path: "/atletas", component: PerfilAtleta, meta: { requiereAuth: true, roles: ['administrador'] } },
  { path: "/usuarios", component: Usuarios, meta: { requiereAuth: true, roles: ['administrador'] } },
  // SOLO el cliente puede entrar a su perfil:
  { path: "/mi-perfil", component: perfilAtletaCliente, meta: { requiereAuth: true, roles: ['cliente'] } }
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});


// <---  GUARD --
router.beforeEach((to, from, next) => {
  const usuarioStore = useStoreUsuarios();

  if (to.meta.requiereAuth && !usuarioStore.token) {
    return next('/home');
  }

  if (to.meta.roles && !to.meta.roles.includes(usuarioStore.rol)) {
    Notify.create({ color: 'negative', message: 'No autorizado' });
    return next('/home');
  }

  next();
});
