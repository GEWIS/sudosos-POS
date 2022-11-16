import {
  VuexModule, Module, Mutation, Action,
} from 'vuex-module-decorators';
import store from '@/store';
import { User } from '@/entities/User';
import { Transaction } from '@/entities/Transaction';
import { getTransactions, getUserTransactions } from '@/api/transactions';

@Module({
  dynamic: true, store, namespaced: true, name: 'SearchModule',
})
export default class SearchModule extends VuexModule {
  searching: boolean = false; // Searching for a product

  userSearching: boolean = false; // Searching for a user

  filterName: string = '';

  filterCategory: number = 0; // Alcoholic drinks as default category

  chargingUser: User = {} as User;

  transactionHistory: Transaction[] = [];

  get isChargingUser() {
    return this.chargingUser !== undefined && this.chargingUser.firstName !== undefined;
  }

  @Mutation
  resetFilterCategory() {
    if ((new Date()).getHours() >= 16) {
      // After 16:00 we can drink beer
      this.filterCategory = 1;
    } else {
      // Before 16:00 we can only drink sodas
      this.filterCategory = 2;
    }
  }

  @Mutation
  resetSearch() {
    this.searching = false;
    this.userSearching = false;
    this.filterName = '';
    this.chargingUser = {} as User;
    this.transactionHistory = [];

    if ((new Date()).getHours() >= 16) {
      // After 16:00 we can drink beer
      this.filterCategory = 1;
    } else {
      // Before 16:00 we can only drink sodas
      this.filterCategory = 2;
    }
  }

  @Mutation
  setUserSearching(userSearching: boolean): void {
    this.userSearching = userSearching;
  }

  @Mutation
  setSearching(searching: boolean): void {
    this.searching = searching;
    // Disable filters when searching
    if (searching) {
      this.filterName = '';
      this.filterCategory = 0;
    } else if ((new Date()).getHours() >= 16) {
      // After 16:00 we can drink beer
      this.filterCategory = 1;
    } else {
      // Before 16:00 we can only drink sodas
      this.filterCategory = 2;
    }
  }

  @Mutation
  setFilterCategory(category: number): void {
    this.searching = false;
    this.filterCategory = category;
  }

  @Mutation
  setChargingUser(user: User) {
    this.chargingUser = user;
  }

  @Mutation
  clearChargingUser() {
    this.chargingUser = {} as User;
  }

  @Mutation
  setTransactionHistory(transactions: Transaction[]) {
    this.transactionHistory = transactions;
  }

  @Action({
    rawError: Boolean(process.env.VUE_APP_DEBUG_STORES),
  })
  updateSearching(searching: boolean) {
    this.context.commit('setSearching', searching);
  }

  @Action({
    rawError: Boolean(process.env.VUE_APP_DEBUG_STORES),
  })
  updateUserSearching(searching: boolean) {
    this.context.commit('setUserSearching', searching);
  }

  @Action({
    rawError: Boolean(process.env.VUE_APP_DEBUG_STORES),
  })
  updateFilterName(name: string) {
    this.context.commit('setFilterName', name);
  }

  @Action({
    rawError: Boolean(process.env.VUE_APP_DEBUG_STORES),
  })
  updateFilterCategory(category: number) {
    this.context.commit('setFilterCategory', category);
  }

  @Action({
    rawError: Boolean(process.env.VUE_APP_DEBUG_STORES),
  })
  updateChargingUser(user: User) {
    this.context.commit('setChargingUser', user);
    this.fetchTransactionHistory();
  }

  @Action({
    rawError: Boolean(process.env.VUE_APP_DEBUG_STORES),
  })
  removeChargingUser() {
    this.context.commit('clearChargingUser');
    this.fetchTransactionHistory();
  }

  @Action({
    rawError: (process.env.VUE_APP_DEBUG_STORES === 'true'),
  })
  fetchTransactionHistory() {
    let id;
    if (this.chargingUser !== undefined && this.chargingUser.id !== undefined
      && this.context.rootState.PointOfSaleModule.pointOfSale
      && !this.context.rootState.PointOfSaleModule.pointOfSale.useAuthentication
    ) {
      id = this.chargingUser.id;
    } else if (this.context.rootState.PointOfSaleModule.pointOfSale
      && this.context.rootState.PointOfSaleModule.pointOfSale.useAuthentication
    ) {
      id = this.context.rootState.UserModule.user.id;
    }
    if (id) {
      getUserTransactions(id, {}, 5, 0)
        .then((transactions) => {
          this.context.commit('setTransactionHistory', transactions.records);
        });
    } else {
      this.context.commit('setTransactionHistory', []);
    }
  }
}
