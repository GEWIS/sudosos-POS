import Vue from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import HomeWrapper from '@/views/HomeWrapper.vue';
import Login from '../views/Login.vue';

const routes: any[] = [
  {
    path: '/home',
    name: 'home',
    component: HomeWrapper,
  },
  {
    path: '/',
    name: 'login',
    component: Login,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
