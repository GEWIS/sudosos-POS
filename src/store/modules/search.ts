import {
  VuexModule, Module, Mutation, Action,
} from 'vuex-module-decorators';
import store from '@/store';
import { User } from '@/entities/User';
import { Transaction } from '@/entities/Transaction';
import { getUserTransactions } from '@/api/transactions';

/**
 * The module that controls the search.
 */
@Module({
  dynamic: true, store, namespaced: true, name: 'SearchModule',
  })
export default class SearchModule extends VuexModule {
  /**
   * Whether the user is searching for a product.
   */
  public searching: boolean = false;

  /**
   * Whether the user is searching for a user.
   */
  public userSearching: boolean = false;

  /**
   * The category to filter by. Alcoholic drinks are set as default.
   */
  public filterCategory: number = 0;

  /**
   * The user that is currently being charged.
   */
  public chargingUser: User = {} as User;

  /**
   * The transaction history of the charging user.
   */
  public transactionHistory: Transaction[] = [];

  /**
   * COMPUTED. Whether the user is currently charging another user.
   */
  get isChargingUser() {
    return this.chargingUser !== undefined && this.chargingUser.firstName !== undefined;
  }

  /**
   * MUTATION. Resets the filter category to the default, if the time is after 16:00.
   */
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

  /**
   * ACTION. Resets the search module. This will also reset the filter
   * category.
   */
  @Action
  reset() {
    this.context.commit('setSearching', false);
    this.context.commit('setUserSearching', false);
    this.context.commit('clearChargingUser');
    this.context.commit('setTransactionHistory', []);
    this.context.commit('resetFilterCategory');
  }

  /**
   * MUTATION. Sets if the user is searching for users.
   * @param {boolean} userSearching Whether the user is searching for users.
   */
  @Mutation
  setUserSearching(userSearching: boolean): void {
    this.userSearching = userSearching;
  }

  /**
   * MUTATION. Sets if the user is searching for a product.
   * @param {boolean} searching Whether the user is searching for a product.
   */
  @Mutation
  setSearching(searching: boolean): void {
    this.searching = searching;
  }

  /**
   * MUTATION. Sets the filter category. This will also disable searching for a
   * product.
   * @param {number} category The category to filter by.
   */
  @Mutation
  setFilterCategory(category: number): void {
    this.searching = false;
    this.filterCategory = category;
  }

  /**
   * MUTATION. Sets the user that is currently being charged.
   * @param {User} user The user that is currently being charged.
   */
  @Mutation
  setChargingUser(user: User) {
    this.chargingUser = user;
  }

  /**
   * MUTATION. Clears the user that is currently being charged.
   */
  @Mutation
  clearChargingUser() {
    this.chargingUser = {} as User;
  }

  /**
   * MUTATION. Sets the transaction history of the current user.
   * @param {Transaction[]} transactions The transaction history of the current
   * user.
   */
  @Mutation
  setTransactionHistory(transactions: Transaction[]) {
    this.transactionHistory = transactions;
  }

  /**
   * ACTION. Updates if the user is searching for a product.
   * @param {boolean} searching Whether the user is searching for a product.
   */
  @Action({
    rawError: Boolean(process.env.VUE_APP_DEBUG_STORES),
    })
  updateSearching(searching: boolean) {
    this.context.commit('setSearching', searching);
  }

  /**
   * ACTION. Updates if the user is searching for a user.
   * @param {boolean} searching Whether the user is searching for a user.
   */
  @Action({
    rawError: Boolean(process.env.VUE_APP_DEBUG_STORES),
    })
  updateUserSearching(searching: boolean) {
    this.context.commit('setUserSearching', searching);
  }

  /**
   * ACTION. Update the filter name.
   * @param {string} name The name to filter by.
   */
  @Action({
    rawError: Boolean(process.env.VUE_APP_DEBUG_STORES),
    })
  updateFilterName(name: string) {
    this.context.commit('setFilterName', name);
  }

  /**
   * ACTION. Updates the filter category.
   * @param {number} category The category to filter by.
   */
  @Action({
    rawError: Boolean(process.env.VUE_APP_DEBUG_STORES),
    })
  updateFilterCategory(category: number) {
    this.context.commit('setFilterCategory', category);
  }

  /**
   * Update the user that is currently being charged.
   * @param {User} user The user that is currently being charged.
   */
  @Action({
    rawError: Boolean(process.env.VUE_APP_DEBUG_STORES),
    })
  updateChargingUser(user: User) {
    this.context.commit('setChargingUser', user);
    this.context.dispatch('fetchTransactionHistory');
  }

  /**
   * ACTION. Removes the user that is currently being charged.
   * @param {User} user The user that is currently being charged.
   */
  @Action({
    rawError: Boolean(process.env.VUE_APP_DEBUG_STORES),
    })
  removeChargingUser() {
    this.context.commit('clearChargingUser');
    this.context.dispatch('fetchTransactionHistory');
  }

  /**
   * ACTION. Fetches the transaction history of the current user.
   */
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
      getUserTransactions(id, {}, 8, 0)
        .then((transactions) => {
          this.context.commit('setTransactionHistory', transactions.records);
        });
      this.context.dispatch('UserModule/fetchBalance', id, { root: true });
    } else {
      this.context.commit('setTransactionHistory', []);
    }
  }
}
