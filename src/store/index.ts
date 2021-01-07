import Vue from 'vue';
import Vuex from 'vuex';
import SearchState from '@/store/search';
import ProductsState from '@/store/product';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    searchState: SearchState,
    productsState: ProductsState,
  },
});
