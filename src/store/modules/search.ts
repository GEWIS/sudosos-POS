import {
  VuexModule, Module, Mutation, Action,
} from 'vuex-module-decorators';
import store from '@/store';
import { User } from '@/entities/User';

@Module({ dynamic: true, store, name: 'SearchModule' })
export default class SearchModule extends VuexModule {
  searching: boolean = false;

  filterName: string = '';

  filterCategory: string = '';

  chargingUser: User = {} as User;

  @Mutation
  setSearching(searching: boolean): void {
    this.searching = searching;
    // Disable filters when searching
    if (searching) {
      this.filterName = '';
      this.filterCategory = '';
    }
  }

  @Mutation
  setFilterName(name: string): void {
    this.searching = false;
    const categoryMap: any = {
      beer: 'alcoholic drink',
      coffee: 'drink',
      'cookie-bite': 'food',
      'ticket-alt': 'ticket',
    };
    this.filterName = name;
    this.filterCategory = categoryMap[name];
  }

  @Mutation
  setChargingUser(user: User) {
    this.chargingUser = user;
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
  updateFilterName(name: string) {
    this.context.commit('setFilterName', name);
  }
}
