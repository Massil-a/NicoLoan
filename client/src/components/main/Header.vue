<template>
  <header class="header-container">
    <div class="logo">
      <img src="@/assets/logo.jpg" alt="app Logo" class="logo-img" />
      <span class="logo-text">{{ APP_NAME }}</span>
    </div>
    <nav class="nav-links">
      <ul>
        <li><a href="/" class="nav-link" id="accueil">Accueil</a></li>
        <li><a href="/Clients" class="nav-link" id="clients">Clients</a></li>
        <li><a href="/Loans" class="nav-link" id="loans">Prêts</a></li>
        <li><a href="/Repayments" class="nav-link" id="repayments">Remboursements</a></li>
        <li><a href="/Contact" class="nav-link" id="contact">Contact</a></li>
        <li><a href="/Settings" class="nav-link" id="settings">Paramètres</a></li>
        <li @click="signOut"><a class="nav-link">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="sign-out-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2h4a2 2 0 012 2v1"
            />
          </svg></a></li>
      </ul>
    </nav>
  </header>
</template>

<script>
import { API_URL, APP_NAME } from '@/config';
import VueCookies from 'vue-cookies'

export default {
  name: 'Header',
  data() { 
    return {
      APP_NAME: APP_NAME,
      apiUrl: API_URL,
    }
  },
  methods: {
    async signOut() {
      try {
        this.$store.dispatch('setLoading', true);
        localStorage.removeItem('nl_user');
        VueCookies.remove('nl_auth_token');
        this.$router.push({ name: 'Auth' });
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
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 50px;
  background-color: var(--primary-color);
  color: var(--whiteDarkable);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%; /* Prend toute la largeur */
  position: absolute;
  top: 0;
  left: 0;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-img {
  height: 40px;
  margin-right: 10px;
}

.logo-text {
  font-size: 28px;
  font-weight: bold;
}

.nav-links ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
}

.nav-links li {
  margin-left: 30px;
}

.nav-links .nav-link {
  color: var(--whiteDarkable);
  text-decoration: none;
  font-size: 18px;
  transition: color 0.3s ease;
}

.nav-links .nav-link:hover {
  color: var(--primary-color-dark);
}
/* Sign out icon */
.sign-out-icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
  transition: transform 0.3s;
}

.sign-out-icon:hover {
  transform: scale(1.1);
}
</style>