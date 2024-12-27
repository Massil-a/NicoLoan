<template>
  <Header />
  new loan et pas new client
</template>

<script>
import Header from '@/components/main/Header.vue';
import { API_URL } from '@/config';
import VueCookies from 'vue-cookies'

export default {
  components: {
    Header,
  },
}
</script>