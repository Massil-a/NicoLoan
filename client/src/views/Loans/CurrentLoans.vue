<template>
  <Header />
  <div class="contenu-container">
    <LaonsTable :UserId="UserId" />
  </div>
</template>

<script>
import Header from '@/components/main/Header.vue';
import LaonsTable from '@/components/Loans/LoansTable.vue';

export default {
  components: {
    Header,
    LaonsTable,
  },
  data() {
    return {
      UserId: JSON.parse(localStorage.getItem('nl_user')).id,
    };
  },
};
</script>
