<template>
  <div class="auth-form-container">
    <form @submit.prevent="Connexion">
      <h2 class="auth-form-title">Connexion</h2>
      <div class="auth-form-group">
        <label for="email" class="auth-form-label">Email:</label>
        <input type="email" id="email" v-model="email" class="auth-form-input" required />
      </div>
      <div class="auth-form-group">
        <label for="password" class="auth-form-label">Mot de passe:</label>
        <div class="password-container">
          <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" class="auth-form-input"
            required />
          <span @click="togglePasswordVisibility" class="toggle-password">
            👁️
          </span>
        </div>
      </div>
      <button type="submit" class="auth-form-button">Se connecter</button>
      <p class="auth-form-switch">
        Pas encore de compte ? <a @click="switchToSignup">S'inscrire</a>
      </p>
    </form>
  </div>
</template>

<script>
import { API_URL } from '@/config';
import VueCookies from 'vue-cookies';

export default {
  data() {
    return {
      email: '',
      password: '',
      showPassword: false
    };
  },
  methods: {
    async Connexion() {
      try {
        this.$store.dispatch('setLoading', true);
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        });

        if (!response.ok) {
          const e = await response.json()
          throw new Error(`${e.message} ( ${e.errorCode} )`);
        }

        const data = await response.json();

        localStorage.setItem('nl_user', JSON.stringify(
          {
            id: data.user.id,
            email: data.user.email,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            updatedAt: data.user.updatedAt,
            role: data.user.idRole,
            settings: {
              interestRates: {
                displayinterestRate: data.user.settings.displayinterestRate ?? null,
                Green: data.user.settings.interestRateGreen ?? null,
                Orange: data.user.settings.interestRateOrange ?? null,
                Red: data.user.settings.interestRateRed ?? null
              },
              alertLateRepayment: data.user.settings.alertLateRepayment ?? null
            }
          }
        ).toString());

        VueCookies.set('nl_auth_token', data.token, '2h');

        this.$router.push({ name: 'Index' });
      } catch (err) {
        console.error(err)
        this.$store.dispatch('setErrorMessage', err.message);
      } finally {
        this.$store.dispatch('setLoading', false);
      }
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    switchToSignup() {
      this.$emit('switchForm');
    }
  }
};
</script>
