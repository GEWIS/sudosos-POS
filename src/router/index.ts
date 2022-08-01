import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';
import ProductOverview from '../views/ProductOverview.vue';
import Login from '../views/Login.vue';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: '/productOverview',
    name: 'productOverview',
    component: ProductOverview,
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
