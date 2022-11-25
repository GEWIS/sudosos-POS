import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import HomeWrapper from '@/views/HomeWrapper.vue';
import Login from '../views/Login.vue';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
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

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes,
});

export default router;
