<template>
  <div class="not-found">
    <h1>404</h1>
    <p>Oups ! La page que vous recherchez n'existe pas.</p>
    <router-link to="/" class="home-button">Retour à l'accueil</router-link>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--whiteDarkable);
  color: var(--blackText);
  text-align: center;
}

.not-found h1 {
  font-size: 10rem;
  margin: 0;
  color: var(--primary-color-dark);
}

.not-found p {
  font-size: 1.5rem;
  margin: 20px 0;
}

.home-button {
  padding: 10px 20px;
  font-size: 1rem;
  color: var(--whiteDarkable);
  background-color: var(--primary-color);
  border: none;
  border-radius: 5px;
  text-decoration: none;
  box-shadow: var(--box-shadow);
  transition: background-color 0.3s ease;
}

.home-button:hover {
  background-color: var(--primary-color-dark);
}
</style>
