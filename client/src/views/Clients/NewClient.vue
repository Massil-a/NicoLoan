<template>
  <Header />
  <div class="card">
    <form @submit.prevent="submitForm" autocomplete="off">
      <div class="form-group">
        <label for="firstName">Prénom:</label>
        <input type="text" id="firstName" v-model="client.firstName" autocomplete="new-first-name" maxlength="30" required />
      </div>
      <div class="form-group">
        <label for="lastName">Nom:</label>
        <input type="text" id="lastName" v-model="client.lastName" autocomplete="new-last-name" maxlength="30" required />
      </div>
      <div class="form-group">
        <label for="clientTag">Tag Client:</label>
        <input type="text" id="clientTag" v-model="client.clientTag" autocomplete="new-client-tag" maxlength="7" required />
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="client.email" autocomplete="new-email" maxlength="150" required />
      </div>
      <div class="form-group">
        <label for="phone">Téléphone:</label>
        <input type="tel" id="phone" v-model="client.phone" autocomplete="new-phone" maxlength="20" required />
      </div>
      <button type="button" @click="goToClients()">Annuler</button>
      <button type="submit">Enregistrer</button>
    </form>
  </div>

  <Notification v-if="notificationMessage" :message="notificationMessage" :color="notificationColor" />
</template>

<script>
import Header from '@/components/main/Header.vue';
import { API_URL } from '@/config';
import VueCookies from 'vue-cookies';
import Notification from '@/components/utils/Notification.vue';

export default {
  components: {
    Header,
    Notification,
  },
  data() {
    return {
      client: {
        firstName: '',
        lastName: '',
        clientTag: '',
        email: '',
        phone: '',
      },
      notificationMessage: '',
      notificationColor: '',
    };
  },
  methods: {
    async submitForm() {
      try {
        this.$store.dispatch('setLoading', true);
        const response = await fetch(`${API_URL}/clients/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': await VueCookies.get("nl_auth_token")
          },
          body: JSON.stringify({
            firstName: this.client.firstName,
            lastName: this.client.lastName,
            clientTag: this.client.clientTag,
            email: this.client.email,
            phone: this.client.phone,
          }),
        });

        if (!response.ok) {
          const e = await response.json();
          throw new Error(`${e.message} ( ${e.errorCode} )`);
        }

        const data = await response.json();

        // Afficher la notification de succès
        this.notificationMessage = 'Client ajouté avec succès !';
        this.notificationColor = 'success';

        this.$router.push({ name: 'Clients' });
      } catch (err) {
        this.notificationMessage = `Erreur : ${err.message}`;
        this.notificationColor = 'error';
        this.$store.dispatch('setErrorMessage', err.message);
      } finally {
        this.$store.dispatch('setLoading', false);
      }
    },
    goToClients() {
      this.$router.push("Clients");
    }
  },
};
</script>

<style scoped>
.card {
  background-color: var(--whiteDarkable);
  box-shadow: var(--box-shadow);
  color: var(--blackText);
  padding: 20px;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  width: 300px;
  text-align: center;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  background-color: var(--primary-color);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 10px;
}

button:hover {
  background-color: var(--primary-color-dark);
}
</style>