import {
  Action, Module, Mutation, VuexModule,
} from 'vuex-module-decorators';
import Dinero from 'dinero.js';
import store from '@/store';
import APIHelper from '@/mixins/APIHelper';
import { POSTransaction, Transaction } from '@/entities/Transaction';
import { SubTransactionRow } from '@/entities/SubTransactionRow';
import TransactionTransformer from '@/transformers/TransactionTransformer';
import { Product } from '@/entities/Product';
import { Container } from '@/entities/Container';

@Module({
  dynamic: true, namespaced: true, store, name: 'TransactionModule',
})
export default class TransactionModule extends VuexModule {
  transactions: Transaction[] = [];

  posTransactions: POSTransaction[] = [];

  currentTransaction: Transaction = {} as Transaction;

  @Mutation
  resetTransactions() {
    this.transactions = [];
    this.currentTransaction = {} as Transaction;
    this.posTransactions = [];
  }

  @Mutation
  addProduct({ product, amount } : {product: Product, amount: number}) {
    // First, find if there is already a relevant subtransaction
    let subTrans = this.currentTransaction.subTransactions
      .find((sub) => sub.container.id === (product as any).containerId);
    if (!subTrans) {
      const subTransContainer: Container = {
        owner: product.owner,
        products: [],
        name: '',
        id: (product as any).containerId,
      } as any;
      subTrans = {
        container: subTransContainer,
        subTransactionRows: [],
        price: Dinero({ amount: 0 }),
        to: subTransContainer.owner,
      } as any;
      this.currentTransaction.subTransactions.push(subTrans);
    }

    // Check if there is already a subtransaction for this product
    let subTransRow = subTrans.subTransactionRows
      .find((row) => row.product === product);
    if (subTransRow) {
      subTransRow.amount += amount;
      subTransRow.priceInclVat.add(subTransRow.priceInclVat.multiply(amount));
    } else {
      const price = Dinero({ amount: product.priceInclVat.getAmount() }).multiply(amount);
      subTransRow = {
        product,
        amount,
        price,
      } as any;
      subTrans.subTransactionRows.push(subTransRow);
    }
  }

  @Mutation
  removeProduct(product: Product) {
    this.currentTransaction.subTransactions.forEach((sub, subIndex) => {
      sub.subTransactionRows.forEach((row, rowIndex) => {
        if (row.product === product) {
          sub.subTransactionRows.splice(rowIndex, 1);
        }
        if (sub.subTransactionRows.length === 0) {
          this.currentTransaction.subTransactions.splice(subIndex, 1);
        }
      });
    });
  }

  @Mutation
  setProductAmount({ product, amount } : {product: Product, amount: number}) {
    this.currentTransaction.subTransactions.forEach((sub) => {
      sub.subTransactionRows.forEach((row) => {
        if (row.product === product) {
          row.amount = amount;
        }
      });
    });
  }

  @Mutation
  setCurrentTransaction(transaction: Transaction) {
    this.currentTransaction = transaction;
  }

  @Mutation
  setTransactions(transactions: Transaction[]) {
    this.transactions = transactions;
  }

  @Mutation
  addTransaction(transaction: Transaction) {
    const transactionResponse = APIHelper.postResource('transactions', transaction);
    this.transactions.push(TransactionTransformer.makeTransaction(transactionResponse));
  }

  @Mutation
  removeTransaction(transaction: Transaction) {
    APIHelper.delResource('transactions', transaction);
    const index = this.transactions.findIndex((trns) => trns.id === transaction.id);
    this.transactions.splice(index, 1);
  }

  @Mutation
  updateTransaction(transaction: {}) {
    const response = APIHelper.putResource('transactions', transaction);
    const transactionResponse = TransactionTransformer.makeTransaction(response);
    const index = this.transactions.findIndex((trns) => trns.id === transactionResponse.id);
    this.transactions.splice(index, 1, transactionResponse);
  }

  @Action({
    rawError: Boolean(process.env.VUE_APP_DEBUG_STORES),
  })
  fetchTransactions(force: boolean = false) {
    if (this.transactions.length === 0 || force) {
      const transactionResponse = APIHelper.getResource('transactions') as any;
      const trans = transactionResponse.map((trns) => TransactionTransformer.makeTransaction(trns));
      this.context.commit('setTransactions', trans);
    }
  }

  @Mutation
  addPOSTransaction(transaction: POSTransaction) {
    this.posTransactions.push(transaction);
  }

  @Mutation
  updatePOSTransaction(transaction: POSTransaction) {
    const index = this.posTransactions.findIndex((pos) => pos.id === transaction.id);
    this.posTransactions.splice(index, 1, transaction);
  }

  @Action({
    rawError: Boolean(process.env.VUE_APP_DEBUG_STORES),
  })
  fetchPOSTransactions(posID: number, force: boolean = false) {
    const index = this.posTransactions.findIndex((pos) => pos.id === posID);

    // If the transactions for this POS have not been resolved yet resolve them.
    if (index === -1 || force) {
      const transactionResponse = APIHelper.getResource(`transactionPOS?id=${posID}`) as any;
      const trans = transactionResponse.map((trns) => TransactionTransformer.makeTransaction(trns));

      this.context.commit('addPOSTransaction', {
        id: posID,
        transactions: trans,
      } as POSTransaction);
    }
  }
}
