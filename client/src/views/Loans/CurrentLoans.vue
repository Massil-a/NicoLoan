<template>
  <Header />
  <div class="contenu-container">
    <button type="button" class="submit-button" @click="goToLoans">Retour</button>
    <LaonsTable :Own="true" />
     <!-- TODO : il faut initialiser le bouton "créer aussi" -->
      <!-- TODO : il faut aussi que dans la table (donc la il faut taffer dans le componetn) 
        je puisse dupliquer, supprimer, modifier un écriture 
      -->
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
