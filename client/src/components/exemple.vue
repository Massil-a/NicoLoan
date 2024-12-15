<template>
  <ul>
    <li v-for="user in users" :key="user.id" :class="user.idRole == 0 ? 'admin' : 'user'">
      Le nom est <span>{{ user.firstName }}</span> <span>{{ user.lastName }}</span>
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      users: []
    };
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      // On définit l'état de chargement à true
      this.$store.dispatch('setLoading', true);

      try {
        const response = await fetch('http://localhost:9360/api/auth/getUsers');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des utilisateurs');
        }
        const data = await response.json();
        this.users = data;
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      } finally {
        // Une fois la requête terminée (qu'elle soit réussie ou échouée), on cache l'écran de chargement
        this.$store.dispatch('setLoading', false);
      }
    }
  }
};
</script>