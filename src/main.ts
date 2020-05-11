import Vue from 'vue';
import VueI18n from 'vue-i18n';
import BootstrapVue from 'bootstrap-vue';
import dinero, { Currency } from 'dinero.js';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome';
import {
  faBeer, faCoffee, faCookieBite, faTicketAlt, faEllipsisH,
} from '@fortawesome/free-solid-svg-icons';
import App from './App.vue';
import router from './router';
import store from './store';
import languages from '@/locales';

import 'bootstrap';

import './styles/global/_main.scss';

library.add(faBeer, faCoffee, faCookieBite, faTicketAlt, faEllipsisH);

// Default settings for Dinero
dinero.defaultCurrency = 'EUR' as Currency;
dinero.defaultPrecision = 2;

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('font-awesome-layers', FontAwesomeLayers);
Vue.component('font-awesome-layers-text', FontAwesomeLayersText);

Vue.use(VueI18n);
Vue.use(BootstrapVue);

const messages = Object.assign(languages);

const i18n = new VueI18n({
  locale: 'nl',
  fallbackLocale: 'en',
  messages,
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app');
