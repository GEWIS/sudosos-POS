<template>
  <b-row class="checkout-button"
    :class="{'checking-out': checkingOut, 'unfinished': unfinished}"
    @click="buttonClicked">
    <font-awesome-icon icon="lock" v-if="unfinished" />
    <p v-if="unfinished">Charge someone</p>
    <p v-else>{{ buttonText }}</p>
  </b-row>
</template>
<script lang="ts">
import { PointOfSale } from '@/entities/PointOfSale';
import { SubTransactionRow } from '@/entities/SubTransactionRow';
import { Container } from '@/entities/Container';
import { User } from '@/entities/User';
import UserModule from '@/store/modules/user';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { postTransaction } from '@/api/transactions';
import SearchModule from '@/store/modules/search';

@Component
export default class CheckoutButton extends Vue {
  @Prop() openPickMember: Function;

  private countdown: number = 3;

  private buttonText: string = 'Checkout';

  private checkingOut: boolean = false;

  private timeout: number = 0;

  private borrelModeCheckout: boolean = false;

  userState = getModule(UserModule);

  searchState = getModule(SearchModule);

  organMemberSelected(selectedMember: User) {
    this.finishTransaction(selectedMember, this.searchState.chargingUser, true);
    this.borrelModeCheckout = false;

    // TODO: Unclear that the searchState is reset after the transaction is finished
    if(this.userState.willAutomaticRestart) {
      this.searchState.setUserSearching(true);
    }
  }

  get unfinished(): boolean {
    return this.userState.isInBorrelMode && !this.searchState.isChargingUser;
  }

  checkout() {
    if (this.countdown > 0) {
      this.buttonText = this.countdown.toString();
      this.timeout = window.setTimeout(() => {
        this.countdown -= 1;
        this.checkout();
      }, 1000);
    } else {
      this.buttonText = 'Transaction done';
      const { user } = this.userState;
      const { chargingUser } = this.searchState;
      this.finishTransaction(user, chargingUser);
    }
  }

  static getContainerForRow(row: any, pos: PointOfSale) {
    const productId = row.product.id;
    let rowContainer = {};

    (pos.containers as Container[]).forEach((container) => {
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
      delete row.price;
      // Find if there is a subtransaction for this container
      const transactionIndex = subTransactions
        .findIndex((sub) => sub.container === row.product.id);
      if (transactionIndex > -1) {
        subTransactions[transactionIndex].subTransactionRows.push(row);
      } else {
        const container = CheckoutButton.getContainerForRow(row, pos);
        const sub = {
          to: pos.owner.id,
          container,
          subTransactionRows: [row],
        };
        subTransactions.push(sub);
      }

      row.totalPriceInclVat = {
        amount: row.product.price.getAmount(),
        precision: row.product.price.getPrecision(),
        currency: row.product.price.getCurrency(),
      };
      row.totalPriceInclVat.amount *= row.amount;
    });

    // Calculate transaction price
    subTransactions.forEach((sub) => {
      sub.totalPriceInclVat = {
        amount: sub.subTransactionRows
          .reduce((total, row) => total + row.totalPriceInclVat.amount, 0),
        currency: 'EUR',
        precision: 2,
      };
    });

    return subTransactions;
  }

  async finishTransaction(user: User, chargingUser: User, borrelMode = false) {
    const { rows, pointOfSale } = this.$parent.$parent as any;

    const subTransactions = CheckoutButton.makeSubTransactions(rows, user, pointOfSale);

    let chargingId = 0;

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
      .reduce((total, sub) => total + sub.totalPriceInclVat.amount, 0);

    (transaction as any).totalPriceInclVat = {
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

    try {
      await postTransaction(transaction);
      this.searchState.reset();
      (this.$parent.$parent as any).rows = [];

      if (!borrelMode) {
        this.userState.reset();
        this.$router.push('/');
      }
      else if(this.userState.willAutomaticRestart) {
        this.searchState.setUserSearching(true);
      }
    } catch (error: any) {
      // TODO: Catch error
    }
  }

  isBorrelModeCheckout() {
    return this.borrelModeCheckout;
  }

  clearBorrelModeCheckout() {
    this.borrelModeCheckout = false;
  }

  buttonClicked() {
    // Borrelmode checkout
    if (this.userState.isInBorrelMode && !this.searchState.isChargingUser) {
      return;
    } else if (this.userState.isInBorrelMode) {
      this.openPickMember();
    } else if (this.checkingOut) {
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
@import "@/styles/global/variables.scss";

.checkout-button {
  cursor: pointer;
  height: $nav-height;
  background-color: #93e78e;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: $border-radius;

  svg {
    color: #525659;
    width: 24px;
    height: 24px;
    margin-right: 6px;
  }

  &.unfinished {
    background-color: lightgray;
  }

  &.checking-out {
    background-color: #ed5a5a;
    animation: checkout-background 1s 3;

    p {
      color: white;
    }
  }
  p {
    font-size: 26px;
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
