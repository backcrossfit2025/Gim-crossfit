<script setup>
import { useStoreUsuarios } from "../stores/usuario.js";
import { computed } from "vue";
const userStore = useStoreUsuarios();

const estaLogueado = computed(() => !!userStore.token)
const rolUsuario = computed(() => userStore.usuario?.rol);
</script>

<template>
  <div>
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

<style scoped>
.main-content {
  min-height: 100vh;
  /* background: url('../assets/foto_1.jpg') no-repeat center center; */
  background-size: cover;
}
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
}
.social-buttons a:hover {
  opacity: 0.8;
}
@media (max-width: 576px) {
  .social-buttons {
    top: auto;
    bottom: 10px;
    right: 10px;
    /* flex-direction: row; */
  }
  .social-buttons a {
    margin: 0 5px;
  }
}
</style>
