<template>
    <Header />
    <Loader />
    <ErrorAlert />
    <div>
        <div v-for="client in clients" :key="client.id">
            <ClientCard 
                :number="client.id" 
                :title="client.title" 
                :description="client.description"
                :size="client.size"
            />
        </div>
    </div>
</template>

<script>
import VueCookies from 'vue-cookies'
import ErrorAlert from '@/components/utils/ErrorAlert.vue';
import Loader from '@/components/utils/Loader.vue';
import Header from '@/components/main/Header.vue';
import ClientCard from '@/components/Clients/ClientCard.vue';

export default {
    components: {
        Header,
        Loader,
        ClientCard,
        ErrorAlert,
    },
    data() {
        return {
            clients: []      // To store the client data
        };
    },
    computed: {
        async getClients() {
            try {
                this.loading = true;
                this.$store.dispatch('setLoading', true);

                const response = await fetch(`${API_URL}/clients/login`, {
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
        }
    },
    mounted() {
        this.getClients();
    },
    methods: {
        togglePasswordVisibility() {
            this.showPassword = !this.showPassword;
        },
        switchToSignup() {
            this.$emit('switchForm');
        }
    }
};
</script>