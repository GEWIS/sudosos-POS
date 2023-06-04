import Vue from 'vue';
import VueI18n from 'vue-i18n';
import BootstrapVue from 'bootstrap-vue';
import dinero, { Currency } from 'dinero.js';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome';
import {
  faBeer,
  faCoffee,
  faCookieBite,
  faTicketAlt,
  faEllipsisH,
  faSearch,
  faUser,
  faWallet,
  faSignOutAlt,
  faUserFriends,
  faLock,
  faAngleDown,
  faExclamationTriangle,
  faStop, faBaby,
} from '@fortawesome/free-solid-svg-icons';
import languages from '@/locales';
import App from './App.vue';
import router from './router';
import store from './store';

import 'bootstrap';

// Import the BootstrapVue style
import './styles/global/_main.scss';

// Add all icons to the library
library.add(
  faBeer,
  faCoffee,
  faCookieBite,
  faTicketAlt,
  faEllipsisH,
  faSearch,
  faUser,
  faWallet,
  faSignOutAlt,
  faUserFriends,
  faLock,
  faAngleDown,
  faExclamationTriangle,
  faStop,
  faBaby,
);

// Default settings for Dinero
dinero.defaultCurrency = 'EUR' as Currency;
dinero.defaultPrecision = 2;

// Register components for the FontAwesome library
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('font-awesome-layers', FontAwesomeLayers);
Vue.component('font-awesome-layers-text', FontAwesomeLayersText);

// Register plugins
Vue.use(VueI18n);
Vue.use(BootstrapVue);

// Create the i18n instance using the imported messages
const messages = Object.assign(languages);
const i18n = new VueI18n({
  locale: 'nl',
  fallbackLocale: 'en',
  messages,
});

Vue.config.productionTip = false;

// Create the Vue instance
new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
