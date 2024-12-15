<template>
  <Loader />
  <RouterView/>
</template>

<script>
import { RouterView } from 'vue-router';
import Loader from '@/components/utils/Loader.vue';

export default {
  components: {
    Loader,
    RouterView
  }
};
</script>