import {
  VuexModule, Module, Mutation, Action,
} from 'vuex-module-decorators';
import store from '@/store';
import { User } from '@/entities/User';

@Module({
  dynamic: true, store, namespaced: true, name: 'SearchModule',
})
export default class SearchModule extends VuexModule {
  searching: boolean = false; // Searching for a product

  userSearching: boolean = false; // Searching for a user

  filterName: string = '';

  filterCategory: number = 0; // Alcoholic drinks as default category

  chargingUser: User = {} as User;

  get isChargingUser() {
    return this.chargingUser !== undefined && this.chargingUser.firstName !== undefined;
  }

  @Mutation
  reset() {
    this.searching = false;
    this.userSearching = false;
    this.filterName = '';
    this.filterCategory = 1;
    this.chargingUser = {} as User;
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
    } else {
      this.filterCategory = 1;
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
}
