<template>
  <Header />
  <div class="contenu-container">
    <div class="form-container">
      <form @submit.prevent="submitForm">
        <div class="form-section">
          <h2>Ajouter un Remboursement</h2>
          <div class="form-group">
            <label for="clientTag">ClientTag</label>
            <input type="text" id="clientTag" v-model="searchQuery" @focus="displayChoices" @blur="hideChoices"
              @input="filterTags" required autocomplete="off" />
            <ul v-if="showChoices" class="choices-list">
              <li v-for="tag in filteredTags" :key="tag" @click="selectTag(tag)">
                {{ tag }}
              </li>
            </ul>
          </div>
          <div class="form-group">
            <label for="loanName">Nom du Prêt</label>
            <input type="text" id="loanName" v-model="searchLoanQuery" @focus="displayLoanChoices"
              @blur="hideLoanChoices" @input="filterLoans" required autocomplete="off" />
            <ul v-if="showLoanChoices" class="choices-list">
              <li v-for="loan in filteredLoans" :key="loan" @click="selectLoan(loan)">
                {{ loan }}
              </li>
            </ul>
          </div>
          <div class="form-group">
            <label for="amountPaid">Montant Remboursé</label>
            <input type="number" id="amountPaid" v-model="repayment.amountPaid" required />
          </div>
          <div class="form-group">
            <label for="paymentDate">Date du Paiement</label>
            <input type="date" id="paymentDate" v-model="repayment.paymentDate" required />
          </div>
          <button type="button" class="submit-button" @click="goToRepayments">Annuler</button>
          <button type="submit" class="submit-button" @click="enregistrerNewRepayement">Enregistrer</button>
        </div>
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
      repayment: {
        loanName: '',
        clientTag: '',
        amountPaid: 0,
        paymentDate: new Date().toISOString().split('T')[0],
      },
      loans: [],
      clientLoans: [],
      filteredLoans: [],
      showLoanChoices: false,
      searchLoanQuery: '',
      clientTags: [],
      filteredTags: [],
      showChoices: false,
      searchQuery: '',
    };
  },
  mounted() {
    this.getAllTags();
    this.getAllLoans();
  },
  methods: {
    async getAllLoans() {
      try {
        this.$store.dispatch('setLoading', true);
        const response = await fetch(`${API_URL}/loans/getByUser`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': VueCookies.get('nl_auth_token'),
          },
        });

        if (!response.ok) {
          const e = await response.json();
          throw new Error(`${e.message} (${e.errorCode})`);
        }

        const data = await response.json();
        this.loans = data.record.map(row => ({
          loanName: row.loanName,
          clientId: row.clientId
        }));
      } catch (err) {
        this.$store.dispatch('setErrorMessage', err.message);
      } finally {
        this.$store.dispatch('setLoading', false);
      }
    },
    goToRepayments() {
      this.$router.push('Repayments');
    },
    async getAllLoans() {
      try {
        this.$store.dispatch('setLoading', true);
        const response = await fetch(`${API_URL}/loans/getByUser`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': VueCookies.get('nl_auth_token'),
          },
        });

        if (!response.ok) {
          const e = await response.json();
          throw new Error(`${e.message} (${e.errorCode})`);
        }

        const data = await response.json();
        this.loans = data.record.map(row => ({
          loanName: row.loanName,
          clientId: row.clientId
        }));

        // Initialiser filteredLoans à vide pour éviter d'afficher tous les prêts au début
        this.filteredLoans = [];
      } catch (err) {
        this.$store.dispatch('setErrorMessage', err.message);
      } finally {
        this.$store.dispatch('setLoading', false);
      }
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
        this.clientTags = data.tags.map(tag => ({
          id: tag.id,  
          clientTag: tag.clientTag  
        }));
        this.filteredTags = this.clientTags.map(tag => tag.clientTag);
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
      this.repayment.clientTag = tag;
      this.searchQuery = tag;
      this.showChoices = false;

      // Trouver le client correspondant
      const client = this.clientTags.find(c => c.clientTag === tag);

      if (client && client.id !== undefined) {
        const clientId = client.id;

        this.repayment.clientId = clientId; // Stocker l'ID du client sélectionné

        // Filtrer les prêts du client sélectionné
        this.clientLoans = this.loans.filter(loan => loan.clientId === clientId);
        this.filteredLoans = this.clientLoans.map(loan => loan.loanName);
      } else {
        console.warn("Aucun client trouvé ou ID invalide !");
        this.clientLoans = [];
        this.filteredLoans = [];
      }
    },
    filterTags() {
      const query = this.searchQuery.toLowerCase();
      this.filteredTags = this.clientTags
        .filter(tag => tag.clientTag.toLowerCase().includes(query))
        .map(tag => tag.clientTag);
    },
    displayLoanChoices() {
      if (this.repayment.clientTag) {
        this.showLoanChoices = true;
      }
    },
    hideLoanChoices() {
      setTimeout(() => {
        this.showLoanChoices = false;
      }, 200);
    },
    selectLoan(loan) {
      this.repayment.loanName = loan;
      this.searchLoanQuery = loan;
      this.showLoanChoices = false;
      // Associer le clientId au prêt sélectionné
      const selectedLoan = this.clientLoans.find(l => l.loanName === loan);
      if (selectedLoan) {
        this.repayment.clientId = selectedLoan.clientId;
      }
    },
    filterLoans() {
      const query = this.searchLoanQuery.toLowerCase();
      this.filteredLoans = this.clientLoans
        .filter(loan => loan.loanName.toLowerCase().includes(query))
        .map(loan => loan.loanName);
    },
    async enregistrerNewRepayement() {
      try {        
        this.$store.dispatch('setLoading', true);
        const response = await fetch(`${API_URL}/repayments/add`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': await VueCookies.get('nl_auth_token'),
            },
            body: JSON.stringify({
              repayment: this.repayment
            })
          });

          if (!response.ok) {
            const e = await response.json();
            throw new Error(`${e.message} (${e.errorCode ?? response.status})`);
          }
          
          this.$router.push('/Repayments');
      } catch (err) {
        this.$store.dispatch('setErrorMessage', err.message);
      } finally {
        this.$store.dispatch('setLoading', false);
      }
    }
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
  width: 80%;
  margin-top: 120px;
}

.form-section {
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  position: relative
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
