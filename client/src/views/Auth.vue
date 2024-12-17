<template>
  <Loader />
  <ErrorAlert/>
  <div class="container">
    <div class="info">
      <div class="appname">
        {{ APP_NAME }}
      </div>
    </div>

    <div class="form">
      <Connexion v-if="isLogin" @switchForm="toggleForm" />
      <Inscription v-else @switchForm="toggleForm" />
    </div>
  </div>
</template>

<script>
import { APP_NAME } from '@/config';
import Connexion from '@/components/auth/Connexion.vue';
import Loader from '@/components/utils/Loader.vue';
import Inscription from '@/components/auth/Inscription.vue';
import ErrorAlert from '@/components/utils/ErrorAlert.vue';

export default {
  components: {
    Loader,
    ErrorAlert,
    Connexion,
    Inscription,
  },
  data() {
    return {
      APP_NAME,
      isLogin: true,
    };
  },
  methods: {
    toggleForm() {
      this.isLogin = !this.isLogin;
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  height: 100vh; /* Pour occuper toute la hauteur de la fenêtre */
}

.info {
  flex: 0 0 40%; /* 40% de la largeur pour le texte */
  background-color: var(--primary-color);
  display: flex;
  justify-content: center;
  align-items: center;
}

.form {
  flex: 1; /* Prend le reste de l'espace disponible */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--whiteDarkable);
}

.appname {
  font-size: 88px;
  color: #fff; /* Assurez-vous que le texte soit visible avec un fond sombre */
}
</style>

