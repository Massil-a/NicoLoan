<template>
  <div v-if="errorMessage" class="error-overlay">
    <div class="error-content">
      <p>{{ errorMessage }}</p>
      <button @click="closeAlert">Fermer</button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['errorMessage'])
  },
  methods: {
    closeAlert() {
      this.$store.dispatch('setErrorMessage', ''); // Réinitialiser le message d'erreur
    }
  }
};
</script>

<style scoped>
.error-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); /* Fond semi-transparent */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Assure que l'alerte est au-dessus de tout */
}

.error-content {
  color: white;
  background: rgba(33, 33, 33, 0.9);
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  text-align: center;
  max-width: 400px;
  width: 80%;
}

.error-content p {
  margin: 0 0 20px;
  font-size: 18px;
  line-height: 1.4;
}

.error-content button {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.error-content button:hover {
  background-color: #d32f2f;
}
</style>
