import { createStore } from 'vuex';

const store = createStore({
  state: {
    isLoading: false, // État global pour savoir si une requête est en cours
    errorMessage: '' // État global du message d'erreur
  },
  mutations: {
    setLoading(state, payload) {
      state.isLoading = payload; // Mettre à jour l'état de loading
    },
    setErrorMessage(state, payload) {
      state.errorMessage = payload; // Mettre à jour le message d'erreur
    }
  },
  actions: {
    setLoading({ commit }, payload) {
      commit('setLoading', payload); // Appeler la mutation pour modifier l'état
    },
    setErrorMessage({ commit }, payload) {
      commit('setErrorMessage', payload); // Appeler la mutation pour modifier le message d'erreur
    }
  }
});

export default store;
