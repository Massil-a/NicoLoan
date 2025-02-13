<template>
  <Header />
  <div class="contenu-container">
    <div class="content-container-wrapper">
      <button type="button" class="retour-button" @click="goToLoans">Retour</button>
    <LaonsTable :Own="true" />
  </div>
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
  methods:{
    goToLoans() {
      this.$router.push('Loans');
    },
  }
};
</script>

