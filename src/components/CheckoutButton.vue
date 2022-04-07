<template>
  <b-row class="checkout-button"
    :class="{'checking-out': checkingOut}"
    @click="buttonClicked">
    <p>{{ buttonText }}</p>
  </b-row>
</template>
<script lang="ts">
import { PointOfSale } from '@/entities/PointOfSale';
import { SubTransaction } from '@/entities/SubTransaction';
import { SubTransactionRow } from '@/entities/SubTransactionRow';
import { Transaction } from '@/entities/Transaction';
import { User } from '@/entities/User';
import UserModule from '@/store/modules/user';
import SubTransactionTransformer from '@/transformers/SubTransactionTransformer';
import TransactionTransformer from '@/transformers/TransactionTransformer';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { postTransaction } from '@/api/transactions';
import SearchModule from '@/store/modules/search';

@Component
export default class CheckoutButton extends Vue {
  private countdown: number = 3;

  private buttonText: string = 'Checkout';

  private checkingOut: boolean = false;

  private timeout: number = 0;

  userState = getModule(UserModule);

  searchState = getModule(SearchModule);

  checkout() {
    if (this.countdown > 0) {
      this.buttonText = this.countdown.toString();
      this.timeout = window.setTimeout(() => {
        this.countdown -= 1;
        this.checkout();
      }, 1000);
    } else {
      this.buttonText = 'Transaction done';
      this.finishTransaction();
    }
  }

  static getContainerForRow(row: any, pos: PointOfSale) {
    const productId = row.product.id;
    let rowContainer = {};

    pos.containers.forEach((container) => {
      if (container.products.findIndex((product) => product.id === productId) > -1) {
        rowContainer = {
          id: container.id,
          revision: container.revision,
        };
      }
    });
    return rowContainer;
  }

  static makeSubTransactions(rows: SubTransactionRow[], user: User, pos: any) {
    const subTransactions: any[] = [];
    rows.forEach((row) => {
      // Find if there is a subtransaction for this container
      const transactionIndex = subTransactions
        .findIndex((sub) => sub.container === row.product.id);
      if (transactionIndex > -1) {
        subTransactions[transactionIndex].subTransactionRows.push(row);
      } else {
        const container = CheckoutButton.getContainerForRow(row, pos);
        console.log(container);
        const sub = {
          to: pos.owner.id,
          container,
          subTransactionRows: [row],
        };
        subTransactions.push(sub);
      }
      row.price.amount *= row.amount;
    });

    // Calculate transaction price
    subTransactions.forEach((sub) => {
      console.log(sub);
      sub.price = {
        amount: sub.subTransactionRows
          .reduce((total, row) => total + row.price.amount, 0),
        currency: 'EUR',
        precision: 2,
      };
    });
    return subTransactions;
  }

  async finishTransaction() {
    const { rows, pointOfSale } = this.$parent.$parent;
    const { user } = this.userState;
    const { chargingUser } = this.searchState;

    const subTransactions = CheckoutButton.makeSubTransactions(rows, user, pointOfSale);

    let chargingId = 0;
    console.log(chargingUser.firstName);
    if (chargingUser.firstName !== undefined) {
      chargingId = chargingUser.id;
      this.searchState.clearChargingUser();
    } else {
      chargingId = user.id;
    }

    const transaction = {
      from: chargingId,
      createdBy: user.id,
      pointOfSale: {
        id: pointOfSale.id,
        revision: pointOfSale.revision,
      },
      subTransactions,
    };
    const price = transaction.subTransactions
      .reduce((total, sub) => total + sub.price.amount, 0);
    transaction.price = {
      amount: price,
      currency: 'EUR',
      precision: 2,
    };

    transaction.subTransactions.forEach((trans) => {
      trans.subTransactionRows.forEach((row) => {
        row.product = {
          id: row.product.id,
          revision: row.product.revision,
        };
      });
    });
    const transactionResponse = await postTransaction(transaction);
    this.userState.reset();
    this.searchState.reset();
    this.$router.push('/login');
  }

  buttonClicked() {
    if (this.checkingOut) {
      clearTimeout(this.timeout);
      this.countdown = 3;
      this.buttonText = 'Checkout';
      this.checkingOut = false;
    } else {
      this.checkingOut = true;
      this.checkout();
    }
  }
}
</script>
<style lang="scss" scoped>
  .checkout-button {
    cursor: pointer;
    height: 12%;
    background-color: #93e78e;
    display: flex;
    justify-content: center;
    align-items: center;

    &.checking-out {
      background-color: #ed5a5a;
      animation: checkout-background 1s 3;

      p {
        color: white;
      }
    }
    p {
      font-size: 2rem;
      color: #525659;
      font-weight: 700;
      margin: 0;
    }

    @keyframes checkout-background {
      from { background-color: #ed5a5a;}
      to { background-color: #F40000;}
    }
  }
</style>
