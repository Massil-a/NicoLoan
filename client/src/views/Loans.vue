<template>
  <div>
    <Loader />
    <Header />
    <div class="dashboard">
      <Card 
        iconPath="current-loan.svg" 
        title="Prêts en cours" 
        subtitle="Consultez les prêts actuellement actifs" 
        :redirectPath="'CurrentLoans'" 
      />
      <Card 
        iconPath="completed-loan.svg" 
        title="Prêts terminés" 
        subtitle="Consultez les prêts qui sont terminés" 
        :redirectPath="'CompletedLoans'" 
      />
    </div>
  </div>
</template>

<script>
import Loader from '@/components/utils/Loader.vue';
import Header from '@/components/main/Header.vue';
import Card from '@/components/main/Card.vue';

export default {
  components: {
    Header,
    Loader,
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
}
</style>
