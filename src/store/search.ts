import {
  VuexModule, Module, Mutation, Action,
} from 'vuex-module-decorators';
import { User } from '@/entities/User';

@Module({ namespaced: true, name: 'SearchState' })
class SearchState extends VuexModule {
  searching: boolean = false;

  filterName: string = '';

  filterCategory: string = '';

  userSearching: boolean = false;

  chargingUser: User|null = null;

  @Mutation
  public setUserSearching(searching: boolean) {
    this.userSearching = searching;
  }

  @Mutation
  public setChargingUser(user: User) {
    this.chargingUser = user;
    this.userSearching = false;
  }

  @Mutation
  public setSearching(searching: boolean): void {
    this.searching = searching;
    // Disable filters when searching
    if (searching) {
      this.filterName = '';
      this.filterCategory = '';
    }
  }

  @Mutation
  public setFilterName(name: string): void {
    this.searching = false;
    const categoryMap: any = {
      beer: 'beer',
      coffee: 'drink',
      'cookie-bite': 'food',
      'ticket-alt': 'ticket',
    };
    this.filterName = name;
    this.filterCategory = categoryMap[name];
  }
}
export default SearchState;
