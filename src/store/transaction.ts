import {
  VuexModule, Module, Mutation, Action,
} from 'vuex-module-decorators';
import { Transaction } from '@/entities/Transaction';
import { User, UserType } from '@/entities/User';
import { SubTransaction } from '@/entities/SubTransaction';
import { SubTransactionRow } from '@/entities/SubTransactionRow';
import { Product } from '@/entities/Product';
import { ProductCategory } from '@/entities/ProductCategory';
import { Container } from '@/entities/Container';

@Module({ namespaced: true, name: 'TransactionState' })
class TransactionState extends VuexModule implements Transaction {
  private transactionCreator: User = {
    id: 1,
    gewisID: 1,
    name: 'TestUser',
    active: true,
    saldo: 4646,
    type: UserType.MEMBER,
  }

  private bacContainer: Container = {
    id: 1,
    version: 1,
    name: 'BAC container',
    owner: this.transactionCreator,
    productIDs: [1, 2, 5],
  }

  private athenaContainer: Container = {
    id: 2,
    version: 2,
    name: 'Athena container',
    owner: this.transactionCreator,
    productIDs: [3, 4],
  }

  private sjaarzenContainer: Container = {
    id: 3,
    version: 1,
    name: 'Sjaarzencontainer',
    owner: this.transactionCreator,
    productIDs: [6],
  }

  private containers: Container[] = [
    this.bacContainer,
    this.athenaContainer,
    this.sjaarzenContainer,
  ];

  from: User = this.transactionCreator;

  createdBy: User = this.transactionCreator;

  subTransactions: SubTransaction[] = [];


  @Mutation
  public addProduct({ product, amount } : { product: Product, amount: number}) {
    const container: Container|any = this.containers
      .find(con => con.productIDs.includes(product.id));

    const sub: SubTransaction|undefined = this.subTransactions
      .find(trans => trans.container === container);

    // If there is a subtransaction for this container, find it and add the product
    // Else: create the subtransaction
    const newRow: SubTransactionRow = {
      product,
      amount,
      price: product.price,
    };
    if (sub) {
      const existing = sub.subTransactionRows.find(row => row.product === product);
      // If a subtransactionrow with this product exists, increase the amount
      // Else add a new row
      if (existing) {
        existing.amount += amount;
      } else {
        sub.subTransactionRows.push(newRow);
      }
    } else {
      const subTrans: SubTransaction = {
        to: this.transactionCreator,
        container,
        subTransactionRows: [newRow],
      };
      this.subTransactions.push(subTrans);
    }
  }
}
export default TransactionState;
