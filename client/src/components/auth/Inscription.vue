<template>
  <ErrorAlert/>
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
        <label for="terms" class="auth-form-label">J'accepte les conditions d'utilisation</label>
      </div>
      <button type="submit" class="auth-form-button">S'inscrire</button>
      <p class="auth-form-switch">
        Déjà un compte ? <a @click="switchToLogin">Se connecter</a>
      </p>
    </form>
  </div>
</template>

<script>
import { API_URL } from '@/config';
import ErrorAlert from '@/components/utils/ErrorAlert.vue';

export default {
  components : {
    ErrorAlert,
  },
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
    };
  },
  methods: {
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
