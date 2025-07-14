<template>

  <!-- <main class="main-content fondo-gym">
    <router-view />
  </main> -->
  <footer v-if="!store.token" class="footer">
    <div class="container p-3">
      <div class="footer-row">
        <div class="footer-col">
          <h6>Síganos en Nuestra Redes</h6>
          <div class="footer-social">
            <a href="https://www.facebook.com/Trainerscol/" target="_blank"><i class="bi bi-facebook"></i></a>
            <a href="https://www.instagram.com/trainerscolsoc?igshid=1tt2rd726w4dz" target="_blank"><i class="bi bi-instagram"></i></a>
            <a href="https://www.youtube.com/channel/UCSlxXNEJxW1c1gtZ8Y-4QRA" target="_blank"><i class="bi bi-youtube"></i></a>
          </div>
        </div>
        <div class="footer-col">
          <p><i class="bi bi-geo-alt-fill"></i> Calle 12 N° 10 - 48, Socorro, Santander, Colombia</p>
          <p><i class="bi bi-globe"></i>
            <a href="https://trainerscol.com/" target="_blank">https://trainerscol.com</a>
          </p>
          <p class="copyright">© 2024 Copyright: Trainers Col Socorro</p>
        </div>
        <div class="footer-col">
          <h6>Contacto</h6>
          <p><i class="bi bi-telephone-fill"></i> 310 3660846</p>
          <p><i class="bi bi-envelope-at-fill"></i> trainerscolsoc@gmail.com</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
import { useStoreUsuarios } from './stores/usuario'
const store = useStoreUsuarios()
</script>

<style scoped>
.footer {
  background-color: #000;
  color: #fff;
  text-align: center;
  padding: 34px 0 16px 0;
  width: 100%;
  margin-top: auto;
  position: relative;
}
.footer-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: stretch;
  gap: 18px;
}
.footer-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 180px;
  padding: 8px 6px;
  flex: 1 1 0;
  max-width: 340px;
  margin-bottom: 0;
}
.footer h6 {
  color: #fff;
  font-weight: bold;
  margin-bottom: 10px;
  letter-spacing: 1px;
  margin-top: 0;
}
.footer p,
.footer a {
  color: #fdfefe;
  margin: 6px 0;
  word-break: break-word;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
}
.footer a:hover {
  color: #f8601d;
  text-decoration: underline;
}
.footer-social {
  display: flex;
  flex-direction: row;
  gap: 18px;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
}
.footer-social a {
  color: #f8601d;
  font-size: 32px;
  transition: color 0.2s;
}
.footer-social a:hover {
  color: #fff;
}
.footer p.copyright {
  font-size: 13px;
  font-weight: 400;
  margin-top: 10px;
  color: #ccc;
}

/* RESPONSIVIDAD */

/* Tablet y menos: apilar columnas */
@media (max-width: 900px) {
  .footer-row {
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  .footer-col {
    max-width: 100%;
    min-width: 0;
    padding: 4px 0;
  }
}

/* Mobile normal */
@media (max-width: 600px) {
  .footer {
    padding: 16px 4px 10px 4px;
    font-size: 13px;
  }
  .footer h6 {
    font-size: 15px;
  }
  .footer-social a {
    font-size: 26px;
  }
}

/* EXTRA: Ultra compacto para <400px (teléfonos muy pequeños) */
@media (max-width: 420px) {
  .footer {
    padding: 11px 1px 6px 1px;
    font-size: 12.5px;
  }
  .footer-col {
    padding: 3px 0 !important;
    font-size: 12.5px;
    min-width: 0;
    max-width: 100vw;
  }
  .footer h6 {
    font-size: 14px;
    margin-bottom: 6px;
  }
  .footer-social {
    gap: 9px;
  }
  .footer-social a {
    font-size: 21px;
  }
  .footer p, .footer a {
    font-size: 12.5px;
    word-break: break-word;
    margin: 3px 0;
  }
  .footer p.copyright {
    font-size: 11px;
  }
}

/* Opcional: para que el contenido central nunca se salga en ningún móvil */
.main-content, .container {
  max-width: 100vw !important;
  overflow-x: hidden;
}
</style>
