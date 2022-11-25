<template>
  <div class="checkoutbar box">
    <b-row class="order-for">
      <b-col class="for-text">
          Order for
      </b-col>
      <b-col class="user-button" @click="$emit('openUserSearch')">
        <div v-if="!searchState.isChargingUser && !pointOfSaleState.pointOfSale.useAuthentication">
          no one
        </div>
        <div v-else-if="!searchState.isChargingUser">
          {{ userState.user.firstName }}
        </div>
        <div v-else>
          {{ searchState.chargingUser.name }}
        </div>
        <div class="angle-down-icon">
        <font-awesome-icon icon="angle-down"/>
        </div>
      </b-col>
      <b-col
        class="logout-button"
        @click="logout"
        align-v="center"
        v-if="pointOfSaleState.pointOfSale.useAuthentication">
        <font-awesome-icon icon="sign-out-alt"/>
      </b-col>
    </b-row>
    <TransactionHistory v-if="cartState.isEmpty" :transactions="searchState.transactionHistory" />
    <Cart v-if="!cartState.isEmpty" :items="cartState.rows" />
    <b-row class="transaction-detail-row">
      <div class="total-row">
        <div class="total-text">Total</div>
        <div class="total-value">€{{ (cartState.total / 100).toFixed(2) }}</div>
      </div>
      <div class="balance-row" v-if="pointOfSaleState.pointOfSale.useAuthentication ? !searchState.isChargingUser : searchState.isChargingUser">
        <div class="balance-text">Balance after</div>
        <div class="balance-value warn" v-if="balanceAfter.getAmount() < 0">
          {{ balanceAfter.toFormat() }}
        </div>
        <div class="balance-value" v-else>{{ balanceAfter.toFormat() }}</div>
      </div>
      <div class="warning-row" v-if="searchState.isChargingUser">
        <font-awesome-icon icon="exclamation-triangle"/>
        You are charging {{ searchState.chargingUser.firstName }}!
      </div>
    </b-row>
    <CheckoutButton ref="checkoutButton" :openPickMember="openPickMember" />
    <div class="borrelmode-text" v-if="!pointOfSaleState.pointOfSale.useAuthentication">
      Borrelmode is active for {{ pointOfSaleState.pointOfSale.owner.name }}
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import Formatters from '@/mixins/Formatters';
import Cart from '@/components/checkoutbar/Cart.vue';
import CheckoutButton from '@/components/checkoutbar/CheckoutButton.vue';
import { User } from '@/entities/User';
import UserModule from '@/store/modules/user';
import PointOfSaleModule from '@/store/modules/point-of-sale';
import TransactionHistory from '@/components/checkoutbar/TransactionHistory.vue';
import CartModule from '@/store/modules/cart';
import SearchModule from '@/store/modules/search';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { BRow, BCol } from 'bootstrap-vue';
import Dinero from 'dinero.js';

/**
 * Component for displaying the checkout bar. This is the bar that is displayed
 * at the bottom of the screen when the user is in the checkout screen.
 */
@Component({
  components: { TransactionHistory, Cart, CheckoutButton },
  props: {
    subTransactionRows: {
      type: Array,
    },
  },
})
export default class CheckoutBar extends Formatters {
  /**
   * A function that forces the user to pick a member. This is a required prop
   * of this component.
   */
  @Prop() openPickMember!: Function;

  public userState = getModule(UserModule);

  public pointOfSaleState = getModule(PointOfSaleModule);

  public cartState = getModule(CartModule);

  public searchState = getModule(SearchModule);

  $refs!: {
    checkoutButton: CheckoutButton;
  };

  /**
   * The balance of the user after the transaction would be completed.
   */
  get balanceAfter(): Dinero.Dinero {
    if (this.userState.userBalance) {
      return this.userState.userBalance.subtract(Dinero({
        amount: this.cartState.total,
        currency: 'EUR',
      }));
    }

    return Dinero({
      amount: -this.cartState.total,
      currency: 'EUR',
    });
  }

  /** 
   * Update the checkout button when the organ member is selected.
   * @param {User} user The user that is selected.
   */
  organMemberSelected(user: User): void {
    // TODO: Fix how this is routed between the checkout button and the checkout bar.
    this.$refs.checkoutButton.organMemberSelected(user);
  }

  /**
   * Logs the user out of the POS. This also resets the color.
   */
  logout() {
    if (!this.pointOfSaleState.pointOfSale.useAuthentication) return;
    this.$emit('logout');
    // @ts-ignore
    document.querySelector(':root').style.setProperty('--gewis-red', 'rgba(212, 0, 0, 1)');
  }
}
</script>
<style lang="scss" scoped>
.checkoutbar {
  display: flex;
  flex-direction: column;
  flex: 0 0 380px;

  .row {
    margin: 0;
  }

  .order-for {
    flex-wrap: nowrap;
    margin-bottom: 16px;

    .for-text {
      flex-grow: 0;
      flex-shrink: 0;
      flex-basis: fit-content;
      vertical-align: middle;
      line-height: 62px;
      font-size: 20px;
      margin-right: 10px;
      padding: 0;
    }

    .user-button {
      border: 1px solid $gewis-red;
      border-radius: $border-radius;
      flex-grow: 1;
      flex-shrink: 0;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 20px;
      margin-right: 10px;

      .angle-down-icon {
        margin-left: 10px;

        svg {
          width: 20px;
          height: 20px;
        }
      }
    }

    .logout-button {
      background-color: $gewis-red;
      border-radius: $border-radius;
      display: flex;
      justify-content: center;
      align-items: center;
      width: $nav-height;
      flex-grow: 0;
      flex-shrink: 0;
      cursor: pointer;
      height: $nav-height;
      text-align: center;
      flex-basis: 62px;
      color: white;

      svg {
        width: 24px;
        height: 24px;
      }
    }
  }

  .transaction-history-table-container {
    flex: 1;
    overflow-y: auto;
  }

  .transaction-detail-row {
    margin: 8px 0;
    background: white;
    padding: 8px 12px;
    display: flex;
    flex-direction: column;
    border-radius: $border-radius;

    .total-row {
      display: flex;
      flex-direction: row;
      font-size: 20px;

      .total-text {
        flex: 1;
      }

      .total-value {
        align-self: flex-end;
      }
    }

    .balance-row {
      display: flex;
      flex-direction: row;
      font-size: 16px;

      .balance-text {
        flex: 1;
      }

      .balance-value {
        align-self: flex-end;

        &.warn {
          color: $gewis-red;
          font-weight: 800;
        }
      }
    }

    .warning-row {
      font-size: 13px;

      svg {
        color: red;
      }
    }
  }

  .charge-other-button {
    cursor: pointer;
    height: 8%;
    background-color: #525659;
    display: flex;
    justify-content: center;
    align-items: center;
    p {
      color: white;
      font-weight: 700;
      margin: 0;
    }
  }

  .borrelmode-text {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 8px;
    color: white;
    background: $gewis-red;
    margin: 12px -16px -16px -16px;
    border-bottom-left-radius: $border-radius;
    border-bottom-right-radius: $border-radius;
    padding: 8px 16px;
    text-align: center;
  }
}
</style>
