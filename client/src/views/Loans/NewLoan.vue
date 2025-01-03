<template>
  <Header />
  <div class="contenu-container">
    <div class="form-container">
      <form @submit.prevent="submitForm">
        <div class="wrapper">
          <div class="loan-info">
            <div class="form-section">
              <h2>Informations sur le prêt</h2>
              <div class="form-group" style="position: relative;">
                <label for="loanName">Nom du Prêt</label>
                <input type="text" id="loanName" v-model="loan.loanName" required />
              </div>
              <div class="form-group" style="position: relative;">
                <label for="clientTag">ClientTag</label>
                <input 
                  type="text" 
                  id="clientTag" 
                  v-model="searchQuery" 
                  @focus="displayChoices" 
                  @blur="hideChoices" 
                  @input="filterTags" 
                  required 
                />
                <ul v-if="showChoices" class="choices-list">
                  <li 
                    v-for="tag in filteredTags" 
                    :key="tag" 
                    @click="selectTag(tag)"
                  >
                    {{ tag }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="loan-amount">
            <div class="form-section">
              <h2>Montant</h2>
              <div class="form-group">
                <label for="totalAmount">Montant Total</label>
                <input type="number" id="totalAmount" v-model="loan.totalAmount" required />
              </div>
              <div class="form-group">
                <label for="monthlyPayment">Montant par mois</label>
                <input type="number" id="monthlyPayment" v-model="loan.monthlyPayment" required />
              </div>
            </div>
          </div>

          <div class="loan-dates">
            <div class="form-section">
              <h2>Dates</h2>
              <div class="form-group">
                <label for="startedAt">Date de Début</label>
                <input type="date" id="startedAt" v-model="loan.startedAt" required />
              </div>
              <div class="form-group">
                <label for="dueDate">Date de Fin</label>
                <input 
                  type="date" 
                  id="dueDate" 
                  v-model="loan.dueDate" 
                  required 
                  @change="calculateDurationMonths" 
                />
              </div>
              <div class="form-group">
                <label for="durationMonths">Durée (en mois)</label>
                <input type="text" id="durationMonths" v-model="loan.durationMonths" disabled />
              </div>
            </div>
          </div>
        </div>
        <button type="button" class="submit-button" @click="goToLoans">Annuler</button>
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
        loanName: '',
        clientTag: '',
        totalAmount: 0,
        monthlyPayment: 0,
        startedAt: new Date().toISOString().split('T')[0],
        dueDate: '',
        durationMonths: '',
      },
      clientTags: [],
      filteredTags: [],
      showChoices: false,
      searchQuery: '',
    };
  },
  mounted() {
    this.getAllTags();
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
    calculateDurationMonths() {
      const start = new Date(this.loan.startedAt);
      const end = new Date(this.loan.dueDate);
      const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      this.loan.durationMonths = months;
    },
    async getAllTags() {
      try {
        const response = await fetch(`${API_URL}/clients/getAllTags`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': await VueCookies.get('nl_auth_token'),
          }
        });

        if (!response.ok) {
          const e = await response.json();
          throw new Error(`${e.message} (${e.errorCode})`);
        }

        const data = await response.json();
        this.clientTags = Array.from(new Set(data.tags.map(tag => tag.clientTag)));
        this.filteredTags = [...this.clientTags];
      } catch (err) {
        console.error(err);
      }
    },
    displayChoices() {
      this.showChoices = true;
    },
    hideChoices() {
      setTimeout(() => {
        this.showChoices = false;
      }, 200);
    },
    selectTag(tag) {
      this.loan.clientTag = tag;
      this.searchQuery = tag;
      this.showChoices = false;
    },
    filterTags() {
      const query = this.searchQuery.toLowerCase();
      this.filteredTags = this.clientTags.filter(tag => tag.toLowerCase().includes(query));
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
  margin-top: 120px;
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
  position: relative;
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

.choices-list {
  list-style: none;
  margin: 0;
  padding: 0;
  position: absolute;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  max-height: 150px;
  overflow-y: auto;
  z-index: 10;
  width: calc(100% - 20px);
  top: calc(100% + 5px);
  left: 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.choices-list li {
  padding: 10px;
  cursor: pointer;
}

.choices-list li:hover {
  background-color: #f0f0f0;
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
