<template>
    <Header />
    <div class="contenu-container">
      <button class="return-button" @click="goToLoans">Retour</button>
      IL FAUT TRIERRRRRRRRRRRRRRRRRRRRR
      <RepaymentsTable :Own="true" />
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
