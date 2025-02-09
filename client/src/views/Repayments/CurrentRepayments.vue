<template>
  <Header />
  <div class="contenu-container">
    <LoansTable :Own="true" />
    <RepaymentsTable :Own="true" />
    <button type="button" class="submit-button" @click="goToLoans">Annuler</button>
  </div>
</template>

<script>
import Header from '@/components/main/Header.vue';
import LoansTable from '@/components/Loans/LoansTable.vue';
import RepaymentsTable from '@/components/Repayments/RepaymentsTable.vue';

export default {
  components: {
    Header,
    LoansTable,
    RepaymentsTable,
  },
  methods: {
    goToLoans() {
      this.$router.push('Loans');
    },
  },
};
</script>
