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
	increaseProduct({product, amount}: {product: Product, amount: number}) {
    if (this.contains(product)) {
      this.context.commit('increaseAmount', {row: this.rows[this.getIndex(product)], amount});
    } else {
      this.context.dispatch('addProduct', {product, amount});
    }
	}

  @Action
  addProduct({product, amount}: {product: Product, amount: number}) {
    if (this.contains(product)) {
      return;
    }

    const row = {
      product,
      amount,
      priceInclVat: product.priceInclVat,
    } as SubTransactionRow;

    console.log(row);

    this.context.commit('addRow', row);
  }

  @Action
  decreaseProduct({product, amount}: {product: Product, amount: number}) {
    if (!this.contains(product)) {
      return;
    }

    const row = this.rows[this.getIndex(product)];

    if (row.amount <= amount) {
      this.context.dispatch('removeProduct', product);
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
  reset() {
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
      console.log(rowTotal, row);
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