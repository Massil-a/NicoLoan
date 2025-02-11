<template>
    <div class="main-container">
        <Header />
        <div class="button-container" :class="clients.length ? 'bottom-left' : 'center-middle'">
            <Card 
                iconPath="plus-circle.svg" 
                title="Nouveau client" 
                subtitle="Enregistrez un nouveau client" 
                redirectPath="NewClient" 
            />
        </div>
        <div class="clients-container">
            <div v-for="client in clients" :key="client.id">
                <ClientCard 
                    :clientTag="client.clientTag" 
                    :title="`${client.firstName} ${client.lastName}`" 
                    :description="`${client.email}\n${client.phone}`"
                    :page="client.clientTag"
                />
            </div>
        </div>
    </div>
</template>

<script>
import VueCookies from 'vue-cookies'
import Header from '@/components/main/Header.vue';
import ClientCard from '@/components/Clients/ClientCard.vue';
import Card from '@/components/main/Card.vue';
import { API_URL } from '@/config';

export default {
    components: {
        Header,
        ClientCard,
        Card,
    },
    data() {
        return {
            clients: []
        };
    },
    mounted() {
        this.getClients();
    },
    methods: {
        async getClients() {
            try {
                this.loading = true;
                this.$store.dispatch('setLoading', true);

                const response = await fetch(`${API_URL}/clients/myClients`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': VueCookies.get('nl_auth_token'),
                    }
                });

                if (!response.ok) {
                    const e = await response.json();
                    throw new Error(`${e.message} ( ${e.errorCode} )`);
                }

                const data = await response.json();
                this.clients = data.clients;
            } catch (err) {
                this.$store.dispatch('setErrorMessage', err.message);
            } finally {
                this.loading = false;
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

<style>
.main-container {
    position: relative;
    height: 100vh;
    overflow: hidden; /* Évite les barres de défilement globales */
}

.button-container {
    position: absolute;
    z-index: 999;
}

.bottom-left {
    bottom: 10px;
    left: 3.5%;
    transform: translateX(-10%);
}

.center-middle {
    bottom: 40%;
    left: 50%;
    transform: translateX(-50%);
}

.clients-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center; /* Centre les cartes horizontalement */
    gap: 20px; /* Espacement entre les cartes */
    padding: 20px;
    margin-top: 100px; /* Ajoute de l'espace sous le header */
    height: calc(100vh - 130px); /* Hauteur disponible après le header et le bouton */
    overflow-y: auto; /* Permet le défilement vertical si nécessaire */
}

.client-card {
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    flex: 1 1 calc(25% - 40px); /* Ajuste la largeur des cartes */
    max-width: 300px; /* Limite la largeur maximale des cartes */
    box-sizing: border-box;
    padding: 20px;
    text-align: center; /* Centre le texte à l'intérieur des cartes */
}

.client-card h3, .client-card h4, .client-card p {
    margin: 0 0 10px;
}

.client-card p {
    white-space: pre-line; /* Gère les sauts de ligne dans le texte */
}
</style>
