import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import BootstrapVueNext from 'bootstrap-vue-next';
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

// Import the BootstrapVue style
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';
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

// Create the i18n instance using the imported messages
const messages = Object.assign(languages);
const i18n = createI18n({
  legacy: false,
  locale: 'nl',
  fallbackLocale: 'en',
  messages,
});

// Create the Vue instance
const app = createApp(App);

// Use plugins
app.use(i18n);
app.use(BootstrapVueNext);
app.use(router);
app.use(store);

// Register components for the FontAwesome library
app.component('font-awesome-icon', FontAwesomeIcon);
app.component('font-awesome-layers', FontAwesomeLayers);
app.component('font-awesome-layers-text', FontAwesomeLayersText);

app.mount('#app');
