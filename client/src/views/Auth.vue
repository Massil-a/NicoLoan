<template>
  <Loader />
  <ErrorAlert/>
  <div class="appname">
    {{ APP_NAME }}
  </div>
  <br><br><br>
  <div class="container">
    <Connexion v-if="isLogin" @switchForm="toggleForm" />
    <Inscription v-else @switchForm="toggleForm" />
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
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: var(--whiteDarkable);
}

.appname {
  display: flex;
  justify-content: center;
  font-size: 88px;
}
</style>
