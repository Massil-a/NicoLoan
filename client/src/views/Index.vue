<template>
  <Loader/>
  <Header/>
  <div class="index">
    <h1>Bienvenue sur votre tableau de bord !</h1>
    <p>Vous êtes connecté.</p>
  </div>
</template>

<script>
import Loader from '@/components/utils/Loader.vue';
import Header from '@/components/main/Header.vue';

export default {
  components: {
    Loader,
    Header,
  }
}
</script>

<style scoped>
.index {
  text-align: center;
  margin-top: 50px;
}
</style>