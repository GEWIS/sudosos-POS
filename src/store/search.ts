import {
  VuexModule, Module, Mutation, Action,
} from 'vuex-module-decorators';

@Module({ namespaced: true, name: 'SearchState' })
class SearchState extends VuexModule {
  searching: boolean = false;

  filterName: string = '';

  filterCategory: string = '';

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
