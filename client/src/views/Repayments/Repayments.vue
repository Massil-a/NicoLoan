<template>
  <div>
    <Header />
    <div class="dashboard">
      <Card 
        iconPath="plus-circle.svg" 
        title="Nouveau remboursement" 
        subtitle="Recensez un nouveau remboursement" 
        redirectPath="NewRepayment" 
      />
      <Card 
        iconPath="current-repayments.svg" 
        title="Remboursements récents" 
        subtitle="Remboursement des prêts en cours" 
        redirectPath="CurrentRepayments" 
      />
      <Card 
        iconPath="completed-repayments.svg" 
        title="Remboursements clôturés" 
        subtitle="Remboursement concernant les prêts clôs" 
        redirectPath="ClosedRepayments" 
      />
    </div>
  </div>
</template>

<script>
import Header from '@/components/main/Header.vue';
import Card from '@/components/main/Card.vue';

export default {
  components: {
    Header,
    Card,
  },
};
</script>

<style scoped>
.dashboard {  
  display: flex;
  flex-wrap: wrap;
  gap: 50px;
  padding: 20px;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
</style>