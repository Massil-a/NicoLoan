<template>
  <Header />
  <div class="contenu-container">
    <div v-if="!selectedForm" class="form-selection">
      <h1 class="settings-title">Choisissez un formulaire</h1>
      <div class="buttons-container">
        <button @click="selectForm('account')">Paramètres du compte</button>
        <button @click="selectForm('interestRates')">Paramètres des taux d'intérêts</button>
        <button @click="selectForm('notifications')">Paramètres des notifications</button>
        <button @click="selectForm('rgpd')">Conditions d'utilisation & RGPD</button>
      </div>
    </div>

    <div v-else class="settings-form">
      <h1 class="settings-title">{{ formTitles[selectedForm] }}</h1>

      <div v-if="selectedForm === 'account'" class="form-grid">
        <div class="form-group">
          <label for="firstName">Prénom</label>
          <input type="text" id="firstName" v-model="settings.firstName" class="styled-input" autocomplete="off" />
        </div>
        <div class="form-group">
          <label for="lastName">Nom</label>
          <input type="text" id="lastName" v-model="settings.lastName" class="styled-input" autocomplete="off" />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="settings.email" class="styled-input" autocomplete="off" />
        </div>
        <div class="form-group">
          <label for="password">Nouveau mot de passe</label>
          <input type="password" id="password" v-model="settings.password" class="styled-input" autocomplete="new-password" />
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirmer le mot de passe</label>
          <input type="password" id="confirmPassword" v-model="settings.confirmPassword" class="styled-input"
            autocomplete="off" />
        </div>
      </div>

      <div v-if="selectedForm === 'interestRates'" class="form-grid">
        <div class="form-group" v-for="(rate, key) in settings.interestRates" :key="key">
          <label :for="key">Taux d'intérêt {{ key }}</label>
          <input type="number" :id="key" v-model="settings.interestRates[key]" step="0.01" min="0"
            class="styled-input" />
        </div>
      </div>

      <div v-if="selectedForm === 'notifications'" class="form-grid">
        <div class="form-group">
          <label for="alert-late-repayment">Alerte en cas de retard de remboursement</label>
          <input type="checkbox" id="alert-late-repayment" v-model="settings.alertLateRepayment" />
          <hr>
          <label for="display-interest-rates">Afficher les taux d'intérêts</label>
          <input type="checkbox" id="display-interest-rates" v-model="settings.interestRates.displayInterestRate" />
        </div>
      </div>

      <div v-if="selectedForm === 'rgpd'" class="form-grid">
        <div class="rgpd-container">
          <h2>Conditions Générales d'Utilisation</h2>
          <p>Bienvenue sur notre plateforme de gestion des prêts. En accédant à ce site, vous acceptez les présentes
            conditions générales d'utilisation (CGU).</p>
          <h3>1. Objet du site</h3>
          <p>Ce site permet aux utilisateurs d'enregistrer et de gérer les prêts qu'ils accordent à leurs clients.</p>
          <h3>2. Informations personnelles collectées</h3>
          <ul>
            <li>Nom et prénom</li>
            <li>Adresse e-mail</li>
            <li>Numéro de téléphone (si fourni)</li>
            <li>Informations relatives aux prêts et remboursements</li>
          </ul>
          <p>Aucune donnée bancaire ou financière sensible n'est stockée sur notre plateforme.</p>
          <h3>3. Utilisation des données</h3>
          <p>Les données collectées sont utilisées pour :</p>
          <ul>
            <li>La gestion des prêts et remboursements</li>
            <li>L'envoi de notifications de rappels</li>
            <li>L'amélioration des services proposés</li>
          </ul>
          <h3>4. Partage des données</h3>
          <p>Nous ne partageons vos données avec aucun tiers sans votre consentement, sauf obligation légale.</p>
          <h3>5. Sécurité</h3>
          <p>Nous mettons en œuvre des mesures de sécurité adaptées pour protéger vos données contre tout accès non
            autorisé.</p>
          <h3>6. Droits des utilisateurs</h3>
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul>
            <li>Droit d'accès, de rectification et de suppression de vos données</li>
            <li>Droit d'opposition au traitement de vos données</li>
            <li>Droit à la portabilité des données</li>
          </ul>
          <p>Pour exercer vos droits, contactez-nous à support@nicoloan.com.</p>
          <h3>7. Modification des CGU</h3>
          <p>Nous nous réservons le droit de modifier ces conditions à tout moment. Les utilisateurs seront informés des
            mises à jour.</p>
          <h3>8. Contact</h3>
          <p>Pour toute question concernant ces conditions, veuillez nous contacter à contact@nicoloan.com.</p>
        </div>
      </div>

      <div class="buttons-container">
        <button class="return-button" @click="selectedForm = null">Retour</button>
        <button v-if="selectedForm !== 'rgpd'" class="save-button" @click="saveForm">Sauvegarder</button>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/main/Header.vue';
import { API_URL } from '@/config';
import VueCookies from 'vue-cookies'

export default {
  components: {
    Header,
  },
  data() {
    return {
      selectedForm: null,
      formTitles: {
        account: 'Paramètres du compte',
        interestRates: 'Paramètres des taux d\'intérêts',
        notifications: 'Paramètres des notifications',
        rgpd: 'Conditions d\'utilisation & RGPD'
      },
      settings: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        interestRates: {
          displayInterestRate: false,
          Green: null,
          Orange: null,
          Red: null
        },
        alertLateRepayment: false
      }
    };
  },
  methods: {
    selectForm(form) {
      this.selectedForm = form;
      this.loadSettings();
    },
    async loadSettings() {
      try {
        this.$store.dispatch('setLoading', true);
        const response = await fetch(`${API_URL}/settings/get`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': VueCookies.get('nl_auth_token'),
          }
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }

        const data = await response.json();
        const userInfo = JSON.parse(localStorage.getItem('nl_user'))

        this.settings = {
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          email: userInfo.email,
          password: '',
          confirmPassword: '',
          interestRates: {
            displayInterestRate: data.record.displayInterestRate ?? null,
            Green: data.record.interestRateGreen ?? null,
            Orange: data.record.interestRateOrange ?? null,
            Red: data.record.interestRateRed ?? null
          },
          alertLateRepayment: data.record.alertLateRepayment ?? null
        }
      } catch (err) {
        this.$store.dispatch('setErrorMessage', err.message);
      } finally {
        this.$store.dispatch('setLoading', false);
      }
    },
    async saveForm() {
      try {
        this.$store.dispatch('setLoading', true);
        if (this.settings.confirmPassword != this.settings.password) { this.$store.dispatch('setErrorMessage', "Les mots de passes doivent être similaires."); return; }

        const response = await fetch(`${API_URL}/settings/set`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': VueCookies.get('nl_auth_token'),
          },
          body: JSON.stringify({
            settings: this.settings
          })
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }

        const data = await response.json();
        const act_infos = JSON.parse(localStorage.getItem('nl_user'))
        console.log(act_infos)
        localStorage.setItem('nl_user', JSON.stringify({
          id: act_infos.id,
          email: data.newUser.email,
          firstName: data.newUser.firstName,
          lastName: data.newUser.lastName,
          idRole: act_infos.role,
          updatedAt: act_infos.updatedAt,
          settings: {
            interestRates: {
              displayInterestRate: data.newSettings.displayInterestRate ?? null,
              Green: data.newSettings.interestRateGreen ?? null,
              Orange: data.newSettings.interestRateOrange ?? null,
              Red: data.newSettings.interestRateRed ?? null
            },
            alertLateRepayment: data.newSettings.alertLateRepayment ?? null
          }
        }).toString())

        this.$router.push('/')

      } catch (err) {
        this.$store.dispatch('setErrorMessage', err.message);
      } finally {
        this.$store.dispatch('setLoading', false);
      }
    }
  }
};
</script>

<style scoped>
.contenu-container {
  padding-top: 100px;
  max-width: 1000px;
  margin: 0 auto;
}

.form-selection {
  text-align: center;
}

.settings-form {
  background-color: var(--whiteDarkable);
  padding: 30px;
  border-radius: 10px;
  box-shadow: var(--box-shadow);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-between;
  width: 100%;
}

.form-group {
  flex: 1;
  min-width: 300px;
}

.styled-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}

.buttons-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

button {
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  background-color: var(--primary-color);
  color: var(--whiteDarkable);
}

button:hover {
  background-color: var(--primary-color-dark);
}

.rgpd-container {
  background-color: var(--whiteDarkable);
  padding: 20px;
  border-radius: 10px;
  box-shadow: var(--box-shadow);
  width: 100%;
  text-align: center;
}
</style>
