import {
  Action, Module, Mutation, VuexModule,
} from 'vuex-module-decorators';
import { PointOfSale } from '@/entities/PointOfSale';
import store from '@/store';
import { getPointOfSale } from '@/api/pointOfSale';
import { User } from '@/entities/User';
import { getOrganMembers } from '@/api/users';
import { ProductCategory } from '@/entities/ProductCategory';
import { getProductCategories } from '@/api/productCategories';
import { ProductInContainer } from '@/entities/Product';
import { Container } from '@/entities/Container';

/**
 * The module that controls the point of sale.
 */
@Module({
  dynamic: true, namespaced: true, store, name: 'PointOfSaleModule',
  })
export default class PointOfSaleModule extends VuexModule {
  /**
   * The point of sale that is currently being viewed.
   */
  public pointOfSale: PointOfSale = {} as PointOfSale;

  /**
   * The categories of products that are available.
   */
  public categories: ProductCategory[] = [];

  /**
   * The owners of the point of sale.
   */
  public pointOfSaleOwners: User[] = [];

  /**
   * MUTATION. Resets the point of sale.
   */
  @Mutation
  reset() {
    this.pointOfSale = {} as PointOfSale;
  }

  /**
   * MUTATION. Sets the point of sale.
   * @param {PointOfSale} pointOfSale The point of sale to set.
   */
  @Mutation
  setPointOfSale(pointOfSale: PointOfSale) {
    this.pointOfSale = pointOfSale;
  }

  /**
   * MUTATION. Sets the owners of the point of sale to the sorted given array.
   * @param {User[]} owners The owners to set.
   */
  @Mutation
  setOwners(owners: User[]) {
    this.pointOfSaleOwners = owners.sort((a, b) => a.id - b.id);
  }

  /**
   * MUTATION. Sets the categories of products to the sorted given array.
   * @param {ProductCategory[]} categories The categories to set.
   */
  @Mutation
  setCategories(categories: ProductCategory[]) {
    this.categories = categories.sort((a, b) => a.id - b.id);
  }

  /**
   * ACTION. Refreshes this point of sale.
   */
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

  /**
   * ACTION. Fetches the point of sale with the given id.
   * @param {number} id The id of the point of sale to fetch.
   */
  @Action({
    rawError: (process.env.VUE_APP_DEBUG_STORES === 'true'),
    })
  fetchPointOfSale(id: number) {
    getProductCategories().then((response) => {
      this.context.commit('setCategories', response.records);
    });
    getPointOfSale(id).then((pointOfSale) => {
      this.context.commit('setPointOfSale', pointOfSale);
      this.context.dispatch('SearchModule/reset', null, { root: true });
      this.context.dispatch('SearchModule/fetchTransactionHistory', null, { root: true }).then();
      getOrganMembers(pointOfSale.owner.id).then((response) => {
        this.context.commit('setOwners', response);
      });
    });
  }

  /**
   * COMPUTED. Returns all categories that have products in them.
   */
  get usedCategories(): ProductCategory[] {
    const ids = new Set(this.allProducts.map((p) => p.category.id));
    return this.categories.filter((c) => ids.has(c.id));
  }

  /**
   * COMPUTED. Returns all products in the point of sale.
   */
  get allProducts(): ProductInContainer[] {
    const products: ProductInContainer[] = [];
    if (this.pointOfSale.containers) {
      this.pointOfSale.containers.forEach((con) => {
        const containerId = con.id;
        (con as any as Container).products.forEach((prod: ProductInContainer) => {
          prod.containerId = containerId;
          products.push(prod);
        });
      });
    }

    return products;
  }
}
