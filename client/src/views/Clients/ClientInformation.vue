<template>
  <Header />
  <div class="contenu-container">
    <div class="form-container">
      <form>
        <div class="wrapper">
          <div class="info-container">
            <div class="form-section">
              <h2>Informations de contact</h2>
              <div class="form-row">
                <div class="form-group">
                  <label for="firstName">Prénom</label>
                  <input type="text" id="firstName" v-model="client.firstName" maxlength="30" required />
                </div>
                <div class="form-group">
                  <label for="lastName">Nom</label>
                  <input type="text" id="lastName" v-model="client.lastName" maxlength="30" required />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="email">Email</label>
                  <input type="email" id="email" v-model="client.email" maxlength="150" required />
                </div>
                <div class="form-group">
                  <label for="phone">Téléphone</label>
                  <input type="text" id="phone" v-model="client.phone" maxlength="20" required />
                </div>
              </div>
              <div class="form-group">
                <label for="clientTag">Tag Client</label>
                <input type="text" id="clientTag" v-model="client.clientTag" maxlength="7" required />
              </div>
            </div>
            <div class="form-section">
              <!-- TODO : bah faut créer les champs en bases etc (penser à rajouter le champ "Société" peut-être ?) -->
               <!-- TODO : Penser à l'autocomplétion faut que ce soit "new-adresse" des trucs comme ça - voir NewClient -->
              <h2>Informations supplémentaires</h2>
              <div class="form-row">
                <div class="form-group">
                  <label for="raison_sociale">Raison Sociale</label>
                  <input type="text" id="raison_sociale" v-model="client.raison_sociale" disabled />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="societe">Société</label>
                  <input type="text" id="societe" v-model="client.societe" disabled />
                </div>
                <div class="form-group">
                  <label for="plafond">Plafond</label>
                  <input type="text" id="plafond" v-model="client.plafond" disabled />
                </div>
              </div>
            </div>
          </div>
          <div class="loan-container">
            <div class="form-section">
              <h2>Prêts associés</h2>
              <LoansTable :ClientTag="page" />
              <!-- TODO : QUAND le tableau est trop grand ça dépasse en bas c'est bizarre -->
            </div>
          </div>
        </div>
        <button type="button" class="submit-button" @click="goToClients()">Annuler</button>
        <button type="button" class="submit-button" @click="saveForm()">Enregistrer</button>
        <button type="button" class="submit-button" style="background-color:red" @click="deleteClient()">Supprimer le client</button>
      </form>
    </div>
  </div>
</template>

<script>
import Header from '@/components/main/Header.vue';
import LoansTable from '@/components/Loans/LoansTable.vue';

import { API_URL } from '@/config';
import VueCookies from 'vue-cookies';

export default {
  components: {
    Header,
    LoansTable
  },
  props: {
    page: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      client: {
        id: '',
        clientTag: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        userId: '',
        createdAt: '',
        updatedAt: '',
        name: '',
        raison_sociale: '',
        societe: '',
        plafond: '',
      },
    };
  },
  mounted() {
    this.getClient();
  },
  methods: {
    async getClient() {
      try {
        this.$store.dispatch('setLoading', true);

        const response = await fetch(`${API_URL}/clients/client/${this.page}`, {
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
        this.client = data.client[0];
      } catch (err) {
        this.$store.dispatch('setErrorMessage', err.message);
      } finally {
        this.$store.dispatch('setLoading', false);
      }
    },
    goToClients() {
      this.$router.go(-1);
    },
    async saveForm() {
      try {
        console.log(this.client)
        this.$store.dispatch('setLoading', true);
        const response = await fetch(`${API_URL}/clients/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': VueCookies.get('nl_auth_token'),
          },
          body: JSON.stringify({
            id: this.client.id,
            firstName: this.client.firstName,
            lastName: this.client.lastName,
            email: this.client.email,
            phone: this.client.phone,
            clientTag: this.client.clientTag,
            updatedAt: new Date().toISOString()
          })
        });

        if (!response.ok) {
          const e = await response.json();
          throw new Error(`${e.message} (${e.errorCode})`);
        }
        const data = response.json();
        this.$router.push('/Clients')

      } catch (err) {
        this.$store.dispatch('setErrorMessage', err.message);
      } finally {
        this.$store.dispatch('setLoading', false);
      }
    },
    async deleteClient() {
      try {
        this.$store.dispatch('setLoading', true);

        const response = await fetch(`${API_URL}/clients/delete/${this.page}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': VueCookies.get('nl_auth_token'),
          },
        });

        if (!response.ok) {
          const e = await response.json();
          throw new Error(`${e.message} (${e.errorCode})`);
        }

        this.$router.push('/Clients');

      } catch (err) {
        this.$store.dispatch('setErrorMessage', err.message);
      } finally {
        this.$store.dispatch('setLoading', false);
      }
    },
    goToClients() {
      this.$router.go(-1);
    }
  },
};
</script>

<style scoped>
.form-container {
  margin: 20px;
  padding: 20px;
  padding-left: 50px;
  background-color: var(--whiteDarkable);
  border-radius: 10px;
  box-shadow: var(--box-shadow);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 200%;
}

.wrapper {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
  gap: 120px;
}

.form-section {
  margin-bottom: 20px;
  padding: 10px;
  width: 100%;
}

.form-row {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  flex: 1;
  margin-right: 10px;
}

.form-group:last-child {
  margin-right: 0;
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
