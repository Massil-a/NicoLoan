import { createRouter, createWebHistory } from 'vue-router';
import Index from '@/views/Index.vue';
import Auth from '@/views/Auth.vue';
import NotFoundPage from '@/views/NotFoundPage.vue';
import Loans from '@/views/Loans.vue';

import VueCookies from 'vue-cookies'

const routes = [
  {
    path: '/',
    name: 'Auth',
    component: Auth,
  },
  {
    path: '/index',
    name: 'Index',
    component: Index,
  },
  {
    path: '/prets',
    name: 'Loans',
    component: Loans,
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