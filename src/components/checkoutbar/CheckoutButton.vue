<template>
  <b-row class="checkout-button"
    :class="{'checking-out': isCheckingOut, 'unfinished': unfinished || transactionProcessing}"
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
import {
  Component, Prop, Vue,
} from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { postTransaction } from '@/api/transactions';
import SearchModule from '@/store/modules/search';
import PointOfSaleModule from '@/store/modules/point-of-sale';
import CartModule from '@/store/modules/cart';

/**
 * Component that handles the checkout button.
 */
@Component
export default class CheckoutButton extends Vue {
  /**
   * A function that forces the user to pick a member. This is a required prop
   * of this component.
   */
  @Prop() openPickMember!: Function;

  /**
   * The number of seconds that the checkout waits before it completes the purchase.
   */
  private countdown: number = 3;

  /**
   * The text that is on the checkout button.
   */
  public buttonText: string = 'Checkout';

  /**
   * The countdown timer that is used to count down the seconds before the checkout
   * completes.
   */
  private timeout: number = 0;

  /**
   * If a transaction is processing.
   */
  public transactionProcessing: boolean = false;

  private userState = getModule(UserModule);

  private searchState = getModule(SearchModule);

  private pointOfSaleState = getModule(PointOfSaleModule);

  private cartState = getModule(CartModule);

  /**
   * If the user is currently checking out.
   */
  get isCheckingOut(): boolean {
    return this.cartState.checkingOut;
  }

  /**
   * If in borrelmode checkout this function will finish the transaction for the
   * selected member of current user.
   * @param {User} selectedMember The member that is selected.
   */
  organMemberSelected(selectedMember: User) {
    this.finishTransaction(selectedMember, this.searchState.chargingUser, true);
  }

  /**
   * If the user can check out and thus has no unfinished options that need to
   * be set.
   */
  get unfinished(): boolean {
    return !this.pointOfSaleState.pointOfSale.useAuthentication && !this.searchState.isChargingUser;
  }

  /**
   * If the checkout button is pressed this function will be called. If the countdown
   * is higher than 0 it will start the countdown. If the countdown is 0 it will
   * finish the transaction.
   */
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

  /**
   * Gets the container for the specified row and the specified pos.
   * @param {SubTransactionRow} row The row to get the container for.
   * @param {PointOfSale} pos The pos to get the container for.
   * @returns {Object} The container for the specified row and pos.
   */
  static getContainerForRow(row: SubTransactionRow, pos: PointOfSale) {
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

  /**
   * Makes the sub transaction model for the specified rows, user and pos.
   * @param {SubTransactionRow[]} rows The rows to make the sub transaction model for.
   * @param {User} user The user to make the sub transaction model for.
   * @param {PointOfSale} pos The pos to make the sub transaction model for.
   * @returns {Object} The sub transaction model for the specified rows, user and pos.
   */
  makeSubTransactions(rows: SubTransactionRow[], user: User, pos: any) {
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

  /**
   * Finish the transaction for the specified user and charging user. If the pos
   * is not in borrelmode, this function will log out the user.
   * @param {User} user The user to finish the transaction for.
   * @param {User} chargingUser The charging user to finish the transaction for.
   * @param {boolean} borrelMode If the transaction is in borrelmode.
   */
  async finishTransaction(user: User, chargingUser: User, borrelMode = false) {
    this.transactionProcessing = true;

    const { pointOfSale } = this.pointOfSaleState;
    const subTransactions = this.makeSubTransactions(this.cartState.rows, user, pointOfSale);
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
      this.cartState.clear();

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

  /**
   * A listener for if the checkout button is pressed. If the pos is in
   * borrelmode and no-one is charged it will do nothing. If the pos is in
   * borrelmode and someone is charged it will ask for member to be picked. If a
   * normal user is logged it will play a timer and checkout. Lastly, if the pos
   * is in borrelmode, someone is charged and a member is selected it will
   * checkout immediately.
   */
  buttonClicked() {
    // Borrelmode checkout
    // if (!this.pointOfSaleState.pointOfSale.useAuthentication &&
    // !this.searchState.isChargingUser) {

    /* } else */
    if (!this.pointOfSaleState.pointOfSale.useAuthentication) {
      this.openPickMember();
    } else if (this.cartState.checkingOut) {
      clearTimeout(this.timeout);
      this.countdown = 3;
      this.buttonText = 'Checkout';
      this.cartState.setCheckingOut(false);
    } else {
      this.cartState.setCheckingOut(true);
      this.checkout();
    }
  }
}
</script>
<style lang="scss" scoped>
.checkout-button {
  cursor: pointer;
  height: $top-bottom-height;
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
    font-size: $font-size+4px;
    font-weight: 700;
    margin: 0;
  }

  @keyframes checkout-background {
    from { background-color: #ed5a5a;}
    to { background-color: #F40000;}
  }
}
</style>
