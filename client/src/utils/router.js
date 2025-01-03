import { createRouter, createWebHistory } from 'vue-router';
import VueCookies from 'vue-cookies'

import Auth from '@/views/Auth.vue';
import Index from '@/views/Index.vue';
import NotFoundPage from '@/views/NotFoundPage.vue';

import Loans from '@/views/Loans.vue';
import NewLoan from '@/views/Loans/NewLoan.vue';
import CurrentLoans from '@/views/Loans/CurrentLoans.vue';

import Clients from '@/views/Clients.vue';
import NewClient from '@/views/Clients/NewClient.vue'
import ClientInformation from '@/views/Clients/ClientInformation.vue';

import Repayments from '@/views/Repayments.vue';


const routes = [
  {
    path: '/',
    name: 'Auth',
    component: Auth,
  },
  {
    path: '/Index',
    name: 'Index',
    component: Index,
  },
  {
    path: '/Loans',
    name: 'Loans',
    component: Loans,
  },
  {
    path: '/Clients',
    name: 'Clients',
    component: Clients,
  },
  {
    path: '/CurrentLoans',
    name: 'CurrentLoans',
    component: CurrentLoans,
  },
  {
    path: '/NewLoan',
    name: 'NewLoan',
    component: NewLoan,
  },
  {
    path: '/NewClient',
    name: 'NewClient',
    component: NewClient,
  },
  {
    path: '/ClientInformation/:page',
    name: 'ClientInformation',
    component: ClientInformation,
    props: true
  },
  {
    path: '/Repayments',
    name: 'Repayments',
    component: Repayments,
    props: true
  },
  {
    path: '/:pathMatch(.*)*', // c'est un catch-all route, pour toutes les routes non définies
    name: 'NotFound',
    component: NotFoundPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = VueCookies.get('nl_auth_token');

  if (!token && to.name !== 'Auth') {
    // Redirige vers la page Auth si non connecté et essayant d'accéder à autre chose que Auth
    next({ name: 'Auth' });
  } else if (token && to.name === 'Auth') {
    // Redirige vers Index si connecté et essayant d'accéder à Auth
    next({ name: 'Index' });
  } else {
    next();
  }
});

export default router;