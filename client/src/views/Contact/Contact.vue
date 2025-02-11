<template>
  <div class="main-container">
    <Header />
    <div class="contact-container">
      <h1 class="contact-title">Contactez-nous sur les réseaux</h1>
      <div class="cards-container">
        <!-- Card pour X -->
        <div class="contact-card" @click="goTo('https://x.com/zidaneofficial_?lang=fr')">
          <img src="@/assets/contacts/x.avif" alt="Logo X" class="contact-card-logo" />
          <div class="contact-card-info">
            <h2 class="contact-card-title">Suivez-nous sur X</h2>
            <p class="contact-card-description">Recevez des mises à jour instantanées et contactez-nous directement sur notre profil X.</p>
          </div>
        </div>

        <!-- Card pour Discord -->
        <div class="contact-card" @click="goTo('https://discord.gg/jrNfpjqAcp')">
          <img src="@/assets/contacts/discord.png" alt="Logo Discord" class="contact-card-logo" />
          <div class="contact-card-info">
            <h2 class="contact-card-title">Rejoignez-nous sur Discord</h2>
            <p class="contact-card-description">Discutez avec notre équipe et d'autres membres de la communauté sur Discord.</p>
          </div>
        </div>

        <!-- Card pour Gmail -->
        <div class="contact-card" @click="goTo('mailto:nicoloan@gmail.com')">
          <img src="@/assets/contacts/gmail.webp" alt="Logo Gmail" class="contact-card-logo" />
          <div class="contact-card-info">
            <h2 class="contact-card-title">Envoyez-nous un email</h2>
            <p class="contact-card-description">Si vous avez des questions ou des problèmes à rapporter, envoyez-nous un email à tout moment.</p>
          </div>
        </div>

        <!-- Card pour LinkedIn -->
        <div class="contact-card" @click="goTo('https://fr.linkedin.com/')">
          <img src="@/assets/contacts/linkedin.jpg" alt="Logo LinkedIn" class="contact-card-logo" />
          <div class="contact-card-info">
            <h2 class="contact-card-title">Contactez-nous sur LinkedIn</h2>
            <p class="contact-card-description">Connectez-vous avec nous pour des opportunités professionnelles sur LinkedIn.</p>
          </div>
        </div>
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
  methods: {
    goTo(url) {
      window.open(url, '_blank');
    }
  }
}
</script>

<style scoped>
.contact-container {
  padding: 50px 20px;
  max-width: 1200px;
  padding-top: 100px;
  margin: 0 auto;
}

.contact-title {
  text-align: center;
  font-size: 32px;
  color: var(--blackText);
  margin-bottom: 40px;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.contact-card {
  width: 280px;
  background-color: var(--whiteDarkable);
  border-radius: 10px;
  box-shadow: var(--box-shadow);
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.contact-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.contact-card-logo {
  width: 60px;
  height: 60px;
  object-fit: contain;
  margin: 20px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.contact-card-info {
  padding: 20px;
  text-align: center;
}

.contact-card-title {
  font-size: 20px;
  color: var(--blackText);
  margin: 15px 0;
}

.contact-card-description {
  color: var(--blackText);
  font-size: 16px;
}

@media (max-width: 768px) {
  .cards-container {
    flex-direction: column;
    align-items: center;
  }
}
</style>
