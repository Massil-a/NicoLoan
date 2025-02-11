<template>
  <Header />
  <div class="contenu-container">
    <!-- Formulaire de Paramètres -->
    <div class="settings-form">
      <h1 class="settings-title">Paramètres</h1>

      <div class="settings-grid">
        <!-- À gauche : Options activables -->
        <div class="options-column">
          <div class="form-group">
            <label for="display-interest-rate">Afficher les taux d'intérêt</label>
            <div class="checkbox-wrapper">
              <input
                type="checkbox"
                id="display-interest-rate"
                v-model="settings.displayInterestRate"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="alert-late-repayment">Alerte en cas de retard de remboursement</label>
            <div class="checkbox-wrapper">
              <input
                type="checkbox"
                id="alert-late-repayment"
                v-model="settings.alertLateRepayment"
              />
            </div>
          </div>
        </div>

        <!-- À droite : Taux d'intérêt -->
        <div class="rates-column">
          <div class="form-group">
            <label for="green-rate">Taux d'intérêt Green</label>
            <input
              type="number"
              id="green-rate"
              v-model="settings.interestRateGreen"
              step="0.01"
              min="0"
            />
          </div>
          
          <div class="form-group">
            <label for="orange-rate">Taux d'intérêt Orange</label>
            <input
              type="number"
              id="orange-rate"
              v-model="settings.interestRateOrange"
              step="0.01"
              min="0"
            />
          </div>

          <div class="form-group">
            <label for="red-rate">Taux d'intérêt Red</label>
            <input
              type="number"
              id="red-rate"
              v-model="settings.interestRateRed"
              step="0.01"
              min="0"
            />
          </div>
        </div>
      </div>

      <!-- Boutons en bas -->
      <div class="buttons-container">
        <button class="return-button" @click="goBack">Retour</button>
        <button class="save-button" @click="saveSettings">Sauvegarder</button>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/main/Header.vue';

export default {
  components: {
    Header,
  },
  data() {
    return {
      settings: {
        interestRateGreen: null,
        interestRateOrange: null,
        interestRateRed: null,
        displayInterestRate: false,
        alertLateRepayment: false,
      },
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    saveSettings() {
      console.log('Paramètres à sauvegarder :', this.settings);
    },
  },
};
</script>

<style scoped>
.contenu-container {
  padding-top: 100px; /* Ajout du padding-top de 100px */
  max-width: 1000px;
  margin: 0 auto;
}

.settings-form {
  background-color: var(--whiteDarkable);
  padding: 20px;
  border-radius: 10px;
  box-shadow: var(--box-shadow);
}

.settings-title {
  text-align: center;
  font-size: 28px;
  color: var(--blackText);
  margin-bottom: 30px;
}

.settings-grid {
  display: flex;
  justify-content: space-between;
  gap: 30px;
}

.options-column,
.rates-column {
  flex: 1;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

.form-group input[type="number"] {
  width: 100%;
  padding: 12px; /* Agrandir la taille des champs */
  border: 1px solid #ddd;
  border-radius: 5px;
}

.checkbox-wrapper {
  display: inline-flex;
  align-items: center;
  margin-left: 10px;
}

.buttons-container {
  display: flex;
  gap: 20px; /* Espacement entre les boutons */
  margin-top: 30px; /* Espacement avant les boutons */
}

.return-button,
.save-button {
  padding: 12px 30px;
  background-color: var(--primary-color);
  color: var(--whiteDarkable);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.return-button:hover,
.save-button:hover {
  background-color: var(--primary-color-dark);
}

.save-button:disabled,
.return-button:disabled {
  background-color: #ccc;
}
</style>
