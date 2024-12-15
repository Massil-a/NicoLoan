<template>
  <Loader/>
  <Header/>
  <div class="index">
    <h1>Bienvenue sur votre tableau de bord, {{ firstName }} {{ lastName}} !</h1>
    <p>Vous êtes connecté.</p>
  </div>
</template>

<script>
import Loader from '@/components/utils/Loader.vue';
import Header from '@/components/main/Header.vue';

export default {
  components: {
    Loader,
    Header,
  },
  data(){
    return {
      firstName : '',
      lastName: '',
    }
  },
  created(){
    const user = JSON.parse(localStorage.getItem('nl_user'));
    if(user){
      this.firstName = user.firstName;
      this.lastName = user.lastName;
    }
  }
}
</script>

<style scoped>
.index {
  text-align: center;
  margin-top: 50px;
}
</style>