<template>
  <div>
    <Header />
    <div class="dashboard">
      <Card 
        iconPath="plus-circle.svg" 
        title="Nouveau prêt" 
        subtitle="Ajoutez un prêt à la liste" 
        redirectPath="NewLoan" 
      />
      <Card 
        iconPath="current-loan.svg" 
        title="Prêts en cours" 
        subtitle="Consultez les prêts actifs" 
        redirectPath="CurrentLoans" 
      />
      <Card 
        iconPath="completed-loans.svg" 
        title="Prêts clôs" 
        subtitle="Nostalgique ?" 
        redirectPath="ClosedLoans"
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