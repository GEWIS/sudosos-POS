import {
  Action, Module, Mutation, VuexModule,
} from 'vuex-module-decorators';
import store from '@/store';
import { SubTransactionRow } from '@/entities/SubTransactionRow';
import { Product } from '@/entities/Product';

/**
 * The module that controls the cart.
 */
@Module({
  dynamic: true, namespaced: true, store, name: 'CartModule',
  })
export default class CartModule extends VuexModule {
  /**
   * The rows of products in the cart.
   */
  public rows: SubTransactionRow[] = [];

  /**
   * Whether the cart is currently checking out.
   */
  public checkingOut: boolean = false;

  /**
   * ACTION. Increases the given product in the cart by the given amount.
   * @param {Product} {product} The product to increase.
   * @param {number} {amount} The amount to increase the product by.
   */
  @Action
  increaseProduct({ product, amount }: {product: Product, amount: number}) {
    if (this.contains(product)) {
      this.context.commit('increaseAmount', { row: this.rows[this.getIndex(product)], amount });
    } else {
      this.context.dispatch('addProduct', { product, amount });
    }
  }

  /**
   * ACTION. Adds the given product to the cart with the given starting amount.
   * @param {Product} {product} The product to add.
   * @param {number} {amount} The amount to add the product with.
   */
  @Action
  addProduct({ product, amount }: {product: Product, amount: number}) {
    if (this.contains(product)) {
      return;
    }

    const row = {
      product,
      amount,
      priceInclVat: product.priceInclVat,
    } as SubTransactionRow;

    this.context.commit('addRow', row);
  }

  /**
   * ACTION. Decreases the given product in the cart by the given amount.
   * @param {Product} {product} The product to decrease.
   * @param {number} {amount} The amount to decrease the product by.
   */
  @Action
  decreaseProduct({ product, amount }: {product: Product, amount: number}) {
    if (!this.contains(product)) {
      return;
    }

    const row = this.rows[this.getIndex(product)];

    if (row.amount <= amount) {
      this.context.dispatch('removeProduct', product);
    } else {
      this.context.commit('decreaseAmount', { row, amount });
    }
  }

  /**
   * ACTION. Removes the given product from the cart.
   * @param {Product} product The product to remove.
   */
  @Action
  removeProduct(product: Product) {
    if (!this.contains(product)) {
      return;
    }

    const index = this.getIndex(product);
    this.context.commit('removeRow', index);
  }

  /**
   * ACTION. Resets the cart.
   */
  @Action
  reset() {
    this.context.commit('clear');
  }

  /**
   * MUTATION. Increases the given row's amount by the given amount.
   * @param {SubTransactionRow} {row} The row to increase.
   * @param {number} {amount} The amount to increase the row by.
   */
  @Mutation
  increaseAmount({ row, amount }: {row: SubTransactionRow, amount: number}) {
    row.amount += amount;
  }

  /**
   * MUTATION. Sets the checking out state.
   * @param {boolean} checkingOut The new checking out state.
   */
  @Mutation
  setCheckingOut(checkingOut: boolean) {
    this.checkingOut = checkingOut;
  }

  /**
   * MUTATION. Adds the given row to the cart.
   * @param {SubTransactionRow} row The row to add.
   */
  @Mutation
  addRow(row: SubTransactionRow) {
    this.rows.push(row);
  }

  /**
   * MUTATION. Removes the row at the given index from the cart.
   * @param {number} index The index of the row to remove.
   */
  @Mutation
  removeRow(index: number) {
    this.rows.splice(index, 1);
  }

  /**
   * MUTATION. Decreases the given row's amount by the given amount.
   * @param {SubTransactionRow} {row} The row to decrease.
   * @param {number} {amount} The amount to decrease the row by.
   */
  @Mutation
  decreaseAmount({ row, amount }: {row: SubTransactionRow, amount: number}) {
    row.amount -= amount;
  }

  /**
   * MUTATION. Clears the cart and resets the checking out state.
   */
  @Mutation
  clear() {
    this.rows = [];
    this.checkingOut = false;
  }

  /**
   * COMPUTED. Whether the cart is empty.
   */
  get isEmpty(): boolean {
    return this.rows.length === 0;
  }

  /**
   * COMPUTED. The total cost of the products in the cart.
   */
  get total(): number {
    let total = 0;

    this.rows.forEach((row: SubTransactionRow) => {
      const rowTotal = row.priceInclVat.getAmount() * row.amount;
      total += rowTotal;
    });

    return total;
  }

  /**
   * COMPUTED. A function that returns whether the given product is in the cart.
   */
  get contains(): (product: Product) => boolean {
    return (product) => this.getIndex(product) > -1;
  }

  /**
   * COMPUTED. A function that returns the index of the given product in the cart.
   */
  get getIndex(): (product: Product) => number {
    return (product) => this.rows.findIndex((row) => row.product.id === product.id);
  }
}
