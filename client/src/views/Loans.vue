<template>
  <div>
    <Loader/>
    <Header/>
    <div class="dashboard">
      <div class="card" @click="goToLoans('current')">
        <img src="@/assets/icons/current-loan.svg" alt="Current Loans" class="card-icon"/>
        <h2>Prêts en cours</h2>
        <p>Consultez les prêts actuellement actifs</p>
      </div>
      <div class="card" @click="goToLoans('completed')">
        <img src="@/assets/icons/completed-loan.svg" alt="Completed Loans" class="card-icon"/>
        <h2>Prêts terminés</h2>
        <p>Consultez les prêts qui sont terminés</p>
      </div>
      <!-- Ajoutez d'autres cartes ici si nécessaire -->
    </div>
  </div>
</template>

<script>
import Loader from '@/components/utils/Loader.vue';
import Header from '@/components/main/Header.vue';

export default {
  components: {
    Header,
    Loader,
  },
  methods: {
    goToLoans(status) {
      // Naviguer vers une autre vue en fonction du statut
      this.$router.push({ name: 'Loans', params: { status } });
    }
  }
};
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-wrap: wrap;
  gap: 50px;
  padding: 20px;
}

.card {
  background-color: var(--whiteDarkable);
  box-shadow: var(--box-shadow);
  color: var(--blackText);
  padding: 20px;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  width: 300px; /* Ajustez la largeur selon vos besoins */
  text-align: center;
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.15);
}

.card h2 {
  margin: 0;
  color: var(--primary-color);
}

.card p {
  margin: 10px 0 0 0;
  color: var(--blackText);
  opacity: 0.7;
  font-size: 0.9em;
}

.card-icon {
  width: 40px;
  height: 40px;
  margin-bottom: 10px;
}
</style>
