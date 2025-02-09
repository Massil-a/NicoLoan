<template>
  <div class="main-container">
      <Header />
  </div>
</template>

<script>
import VueCookies from 'vue-cookies'
import Header from '@/components/main/Header.vue';
import { API_URL } from '@/config';

export default {
  components: {
      Header,
  }
}
</script>