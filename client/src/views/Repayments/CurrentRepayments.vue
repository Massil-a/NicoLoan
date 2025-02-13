<template>
  <Header />
  <div class="contenu-container">
    <div class="content-container-wrapper">
      <button type="button" class="retour-button" @click="goToLoans">Retour</button>
      <RepaymentsTable :Own="true" />
    </div>
  </div>
</template>

<script>
import Header from '@/components/main/Header.vue';
import RepaymentsTable from '@/components/Repayments/RepaymentsTable.vue';

export default {
  components: {
    Header,
    RepaymentsTable,
  },
  methods: {
    goToLoans() {
      this.$router.push('Repayments');
    },
  },
};
</script>
