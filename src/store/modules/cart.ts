import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";
import store from '@/store';
import { SubTransactionRow } from "@/entities/SubTransactionRow";
import { Product } from "@/entities/Product";

@Module({
	dynamic: true, namespaced: true, store, name: 'CartModule',
})
export default class CartModule extends VuexModule {
	public rows: SubTransactionRow[] = [];

  @Action
	increaseProduct(product: Product, amount: number) {
    if (this.contains(product)) {
      this.context.commit('increaseAmount', {row: this.rows[this.getIndex(product)], amount});
    } else {
      this.addProduct(product, amount);
    }
	}

  @Action
  addProduct(product: Product, amount: number) {
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

  @Action
  decreaseProduct(product: Product, amount: number) {
    if (!this.contains(product)) {
      return;
    }

    const row = this.rows[this.getIndex(product)];

    if (row.amount <= amount) {
      this.removeProduct(product);
    }
    else {
      this.context.commit('decreaseAmount', {row, amount});
    }
  }

  @Action
  removeProduct(product: Product) {
    if (!this.contains(product)) {
      return;
    }

    const index = this.getIndex(product);
    this.context.commit('removeRow', index);
  }

  @Action
  reset(product: Product) {
    this.context.commit('clear');
  }

  @Mutation
  increaseAmount({row, amount}: {row: SubTransactionRow, amount: number}) {
    row.amount += amount;
  }

  @Mutation
  addRow(row: SubTransactionRow) {
    this.rows.push(row);
  }

  @Mutation
  removeRow(index: number) {
    this.rows.splice(index, 1);
  }

  @Mutation
  decreaseAmount({row, amount}: {row: SubTransactionRow, amount: number}) {
    row.amount -= amount;
  }

  @Mutation
  clear() {
    this.rows = [];
  }

  get isEmpty(): boolean {
    return this.rows.length === 0;
  }

  get total(): number {
    let total = 0;

    this.rows.forEach((row: SubTransactionRow) => {
      const rowTotal = row.priceInclVat.getAmount() * row.amount;
      total += rowTotal;
    });

    return total;
  }

  get contains(): (product: Product) => boolean {
    return product => this.getIndex(product) > -1;
  }

  get getIndex(): (product: Product) => number {
    return product => this.rows.findIndex((row) => row.product.id === product.id);
  }
}