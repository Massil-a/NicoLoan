<template>
  <div class="auth-form-container">
    <form @submit.prevent="Inscription">
      <h2 class="auth-form-title">Inscription</h2>
      <div class="auth-form-group">
        <label for="firstName" class="auth-form-label">Prénom:</label>
        <input type="text" id="firstName" v-model="firstName" class="auth-form-input" required />
      </div>
      <div class="auth-form-group">
        <label for="lastName" class="auth-form-label">Nom:</label>
        <input type="text" id="lastName" v-model="lastName" class="auth-form-input" required />
      </div>
      <div class="auth-form-group">
        <label for="email" class="auth-form-label">Email:</label>
        <input type="email" id="email" v-model="email" class="auth-form-input" required />
      </div>
      <div class="auth-form-group">
        <label for="password" class="auth-form-label">Mot de passe:</label>
        <div class="password-container">
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model="password"
            class="auth-form-input"
            required
          />
          <span @click="togglePasswordVisibility" class="toggle-password">
            👁️
          </span>
        </div>
      </div>
      <div class="auth-form-group">
        <label for="confirmPassword" class="auth-form-label">Confirmer mot de passe:</label>
        <div class="password-container">
          <input
            :type="showConfirmPassword ? 'text' : 'password'"
            id="confirmPassword"
            v-model="confirmPassword"
            class="auth-form-input"
            required
          />
          <span @click="toggleConfirmPasswordVisibility" class="toggle-password">
            👁️
          </span>
        </div>
      </div>
      <div class="auth-form-group terms">
        <input type="checkbox" id="terms" v-model="terms" class="auth-form-checkbox" required />
        <label for="terms" class="auth-form-label">
          J'accepte les <a href="#" @click.prevent="openConditionsModal">conditions d'utilisation</a>
        </label>
      </div>
      <button type="submit" class="auth-form-button">S'inscrire</button>
      <p class="auth-form-switch">
        Déjà un compte ? <a @click="switchToLogin">Se connecter</a>
      </p>
    </form>

    <!-- Modal pour les conditions d'utilisation -->
    <div v-if="showModal" class="modal" @click.self="closeConditionsModal">
      <div class="modal-content">
        <!-- Croisillon en haut à gauche -->
        <span class="close" @click="closeConditionsModal">&times;</span>
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
    </div>
  </div>
</template>

<script>
import { API_URL } from '@/config';

export default {
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
      showPassword: false,
      showConfirmPassword: false,
      showModal: false,  // Contrôle l'affichage de la modale
    };
  },
  methods: {
    // Ouvre la modale des conditions d'utilisation
    openConditionsModal() {
      this.showModal = true;
    },
    // Ferme la modale des conditions d'utilisation
    closeConditionsModal() {
      this.showModal = false;
    },
    async Inscription() {
      try {
        this.$store.dispatch('setLoading', true);
        
        if(this.password!==this.confirmPassword){
          throw new Error('Mots de passes différents!');
        }

        const response = await fetch(`${API_URL}/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            password: this.password
          })
        });

        if (!response.ok) {
          const e = await response.json()
          throw new Error(`${e.message} (${e.errorCode})`);
        }

        const data = await response.json();
        this.$store.dispatch('setErrorMessage', "Utilisateur bien créé !");
        this.switchToLogin()
      } catch (err) {
        this.$store.dispatch('setErrorMessage', err.message);
      } finally {
        this.$store.dispatch('setLoading', false);
      }
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    switchToLogin() {
      this.$emit('switchForm');
    }
  }
};
</script>

<style scoped>
/* Style pour la modale */
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  max-width: 600px;
  max-height: 80%;
  overflow-y: auto;
  position: relative; /* Positionner la croix dans le coin */
}

.close {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 30px;
  font-weight: bold;
  cursor: pointer;
}

.rgpd-container {
  /* Le style de ton texte des conditions */
  max-height: 60vh;
  overflow-y: auto;
}
</style>