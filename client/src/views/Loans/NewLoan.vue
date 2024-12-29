<template>
  <Header />
  <div class="contenu-container">
    <div class="form-container">
      <form @submit.prevent="submitForm">
        <div class="wrapper">
          <!-- 1ere Partie : Informations sur le prêt -->
          <div class="loan-info">
            <div class="form-section">
              <h2>Informations sur le prêt</h2>
              <div class="form-group">
                <label for="loanName">Nom du Prêt</label>
                <input type="text" id="loanName" v-model="loan.name" required />
              </div>
              <div class="form-group">
                <label for="clientTag">ClientTag</label>
                <input type="text" id="clientTag" v-model="loan.clientTag" required />
              </div>
            </div>
          </div>

          <!-- 2eme Partie : Montant -->
          <div class="loan-amount">
            <div class="form-section">
              <h2>Montant</h2>
              <div class="form-group">
                <label for="totalAmount">Montant Total</label>
                <input type="number" id="totalAmount" v-model="loan.totalAmount" required />
              </div>
            </div>
          </div>

          <!-- 3eme Partie : Dates -->
          <div class="loan-dates">
            <div class="form-section">
              <h2>Dates</h2>
              <div class="form-group">
                <label for="startDate">Date de Début</label>
                <input type="date" id="startDate" v-model="loan.startDate" required />
              </div>
              <div class="form-group">
                <label for="endDate">Date de Fin</label>
                <input type="date" id="endDate" v-model="loan.endDate" required @change="calculateDuration" />
              </div>
              <div class="form-group">
                <label for="duration">Durée (en mois)</label>
                <input type="text" id="duration" v-model="loan.duration" disabled />
              </div>
            </div>
          </div>
        </div>
        <button type="button" class="submit-button" @click="goToLoans()">Annuler</button>
        <button type="submit" class="submit-button">Enregistrer</button>
      </form>
    </div>
  </div>
</template>

<script>
import Header from '@/components/main/Header.vue';
import { API_URL } from '@/config';
import VueCookies from 'vue-cookies';

export default {
  components: {
    Header,
  },
  data() {
    return {
      loan: {
        name: '',
        clientTag: '',
        totalAmount: 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        duration: '',
      },
    };
  },
  methods: {
    async submitForm() {
      try {
        this.$store.dispatch('setLoading', true);
        const response = await fetch(`${API_URL}/loans/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': await VueCookies.get('nl_auth_token'),
          },
          body: JSON.stringify(this.loan),
        });

        if (!response.ok) {
          const e = await response.json();
          throw new Error(`${e.message} (${e.errorCode})`);
        }

        const data = await response.json();
        this.$router.push({ name: 'Loans' });
      } catch (err) {
        console.error(err);
      } finally {
        this.$store.dispatch('setLoading', false);
      }
    },
    goToLoans() {
      this.$router.push('Loans');
    },
    calculateDuration() {
      const start = new Date(this.loan.startDate);
      const end = new Date(this.loan.endDate);
      const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      this.loan.duration = months;
    },
  },
};
</script>

<style scoped>
.form-container {
  margin: 20px;
  padding: 20px;
  background-color: var(--whiteDarkable);
  border-radius: 10px;
  box-shadow: var(--box-shadow);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 80%;
  margin-top:120px;
}

.wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  gap: 20px;
}

.loan-info, .loan-amount, .loan-dates {
  flex: 1;
}

.form-section {
  margin-bottom: 20px;
  padding: 10px;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

label {
  margin-bottom: 5px;
  font-weight: bold;
  color: var(--blackText);
}

input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 100%;
  box-sizing: border-box;
}

.submit-button {
  padding: 10px;
  margin-right: 20px;
  background-color: var(--primary-color);
  color: var(--whiteDarkable);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.submit-button:hover {
  background-color: var(--primary-color-dark);
}
</style>
