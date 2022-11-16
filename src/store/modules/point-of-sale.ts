import {
  Action, getModule, Module, Mutation, VuexModule,
} from 'vuex-module-decorators';
import { PointOfSale } from '@/entities/PointOfSale';
import store from '@/store';
import { getPointOfSale } from '@/api/pointOfSale';
import { User } from '@/entities/User';
import { getOrganMembers } from '@/api/users';
import { ProductCategory } from '@/entities/ProductCategory';
import { getProductCategories } from '@/api/productCategories';

@Module({
  dynamic: true, namespaced: true, store, name: 'PointOfSaleModule',
})
export default class PointOfSaleModule extends VuexModule {
  pointOfSale: PointOfSale = {} as PointOfSale;

  categories: ProductCategory[] = [];

  pointOfSaleOwners: User[] = [];

  @Mutation
  reset() {
    this.pointOfSale = {} as PointOfSale;
  }

  @Mutation
  setPointOfSale(pointOfSale: PointOfSale) {
    this.pointOfSale = pointOfSale;
  }

  @Mutation
  setOwners(owners: User[]) {
    this.pointOfSaleOwners = owners.sort((a, b) => a.id - b.id);
  }

  @Mutation
  setCategories(categories: ProductCategory[]) {
    this.categories = categories.sort((a, b) => a.id - b.id);
  }

  @Action({
    rawError: (process.env.VUE_APP_DEBUG_STORES === 'true'),
  })
  refreshPointOfSale() {
    const posId = this.pointOfSale.id;
    getProductCategories().then((response) => {
      this.context.commit('setCategories', response.records);
    });
    getPointOfSale(posId).then((pointOfSale) => {
      this.context.commit('setPointOfSale', pointOfSale);
      getOrganMembers(pointOfSale.owner.id).then((response) => {
        this.context.commit('setOwners', response);
      });
    });
  }

  @Action({
    rawError: (process.env.VUE_APP_DEBUG_STORES === 'true'),
  })
  fetchPointOfSale(id: number) {
    getProductCategories().then((response) => {
      this.context.commit('setCategories', response.records);
    });
    getPointOfSale(id).then((pointOfSale) => {
      this.context.commit('setPointOfSale', pointOfSale);
      this.context.commit('SearchModule/resetSearch', null, { root: true });
      this.context.commit('TransactionModule/resetTransactions', null, { root: true });
      this.context.dispatch('SearchModule/fetchTransactionHistory', null, { root: true }).then();
      getOrganMembers(pointOfSale.owner.id).then((response) => {
        this.context.commit('setOwners', response);
      });
    });
  }
}
