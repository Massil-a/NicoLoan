<template>
  <Loader />
  <ErrorAlert/>
  <RouterView/>
</template>

<script>
import { RouterView } from 'vue-router';
import Loader from '@/components/utils/Loader.vue';
import ErrorAlert from '@/components/utils/ErrorAlert.vue';

export default {
  components: {
    Loader,
    RouterView,
    ErrorAlert
  }
};
</script>