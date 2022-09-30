<template>
  <b-row class="checkout-button"
    :class="{'checking-out': checkingOut, 'unfinished': unfinished || transactionProcessing}"
    @click="buttonClicked">
    <font-awesome-icon icon="lock" v-if="unfinished" />
    <b-spinner class="loading-spinner" v-if="transactionProcessing" />
    <p v-if="unfinished">Charge someone</p>
    <p v-else-if="transactionProcessing">Processing...</p>
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
import PointOfSaleModule from '@/store/modules/point-of-sale';

@Component
export default class CheckoutButton extends Vue {
  @Prop() openPickMember: Function;

  private countdown: number = 3;

  private buttonText: string = 'Checkout';

  private checkingOut: boolean = false;

  private timeout: number = 0;

  private borrelModeCheckout: boolean = false;

  private transactionProcessing: boolean = false;

  private userState = getModule(UserModule);

  private searchState = getModule(SearchModule);

  private pointOfSaleState = getModule(PointOfSaleModule);

  organMemberSelected(selectedMember: User) {
    this.finishTransaction(selectedMember, this.searchState.chargingUser, true);
    this.borrelModeCheckout = false;
  }

  get unfinished(): boolean {
    return !this.pointOfSaleState.pointOfSale.useAuthentication && !this.searchState.isChargingUser;
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
          owner: container.owner,
        };
      }
    });

    return rowContainer;
  }

  static makeSubTransactions(rows: SubTransactionRow[], user: User, pos: any) {
    const subTransactions: any[] = [];

    rows.forEach((originalRow: SubTransactionRow) => {
      const row: SubTransactionRow = { ...originalRow };
      delete row.priceInclVat;
      // Find if there is a subtransaction for this container
      const transactionIndex = subTransactions
        .findIndex((sub) => sub.container === row.product.id);
      if (transactionIndex > -1) {
        subTransactions[transactionIndex].subTransactionRows.push(row);
      } else {
        const container = CheckoutButton.getContainerForRow(row, pos) as any;
        const to = container.owner.id;
        delete container.owner;
        const sub = {
          to,
          container,
          subTransactionRows: [row],
        };
        subTransactions.push(sub);
      }

      row.totalPriceInclVat = {
        amount: row.product.priceInclVat.getAmount(),
        precision: row.product.priceInclVat.getPrecision(),
        currency: row.product.priceInclVat.getCurrency(),
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
    this.transactionProcessing = true;
    const rows = [
      ...(this.$parent.$parent as any).rows,
    ];
    console.log(rows, (this.$parent.$parent as any).rows);
    const { pointOfSale } = this.pointOfSaleState;

    const subTransactions = CheckoutButton.makeSubTransactions(rows, user, pointOfSale);
    console.log(rows, (this.$parent.$parent as any).rows);

    let chargingId = 0;

    if (chargingUser.firstName !== undefined) {
      chargingId = chargingUser.id;
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
    } catch (error: any) {
      this.$bvModal.show('modal-transaction-failed');
    } finally {
      if (this.pointOfSaleState.pointOfSale.useAuthentication) {
        const sound = new Audio('./sounds/rct-cash.wav');
        sound.play();
      }
      this.transactionProcessing = false;
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
    if (!this.pointOfSaleState.pointOfSale.useAuthentication && !this.searchState.isChargingUser) {

    } else if (!this.pointOfSaleState.pointOfSale.useAuthentication) {
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
  color: #525659;

  svg {
    width: 24px;
    height: 24px;
    margin-right: 6px;
  }

  .loading-spinner {
    margin-right: 0.5rem;
    width: 1.5rem;
    height: 1.5rem;
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
    font-weight: 700;
    margin: 0;
  }

  @keyframes checkout-background {
    from { background-color: #ed5a5a;}
    to { background-color: #F40000;}
  }
}
</style>
