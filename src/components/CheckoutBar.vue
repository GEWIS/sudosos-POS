<template>
  <div class="checkoutbar shadow">
    <b-row class="order-for">
      <b-col class="for-text">
          Order for
      </b-col>
      <b-col class="user-button" @click="chargeOtherPerson">
        <div v-if="!searchState.isChargingUser && userState.isInBorrelMode">
          no one
        </div>
        <div v-else-if="!searchState.isChargingUser">
          {{ userState.user.firstName }}
        </div>
        <div v-else>
          {{ searchState.chargingUser.firstName }}
        </div>
        <div class="angle-down-icon">
        <font-awesome-icon icon="angle-down"/>
        </div>
      </b-col>
      <b-col class="logout-button" @click="logout" align-v="center">
        <font-awesome-icon icon="sign-out-alt"/>
      </b-col>
    </b-row>
    <products-table :items="subTransactionRows" :updateRows="updateRows" :userActivity="userActivity"/>
    <b-row class="transaction-detail-row">
      <div class="total-row">
        <div class="total-text">Total</div>
        <div class="total-value">€{{ (transactionTotal / 100).toFixed(2) }}</div>
      </div>
      <div class="balance-row" v-if="!searchState.isChargingUser && !userState.isInBorrelMode">
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
    <checkout-button ref="checkoutButton" :openPickMember="openPickMember" />
    <div class="borrelmode-text" v-if="userState.isInBorrelMode">
      Borrelmode is active for {{ userState.borrelModeOrgan.organName }}
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import DineroType from 'dinero.js';
import Formatters from '@/mixins/Formatters';
import ProductsTable from '@/components/ProductsTable.vue';
import CheckoutButton from '@/components/CheckoutButton.vue';
import { User } from '@/entities/User';
import UserModule from '@/store/modules/user';
import SearchModule from '@/store/modules/search';
import { SubTransactionRow } from '@/entities/SubTransactionRow';

@Component({
  components: { ProductsTable, CheckoutButton },
  props: {
    subTransactionRows: {
      type: Array,
    },
  },
})
export default class CheckoutBar extends Formatters {
  @Prop() openUserSearch: Function;

  @Prop() openPickMember: Function;

  @Prop() updateRows: Function;

  @Prop() loggedOut: Function;

  @Prop() userActivity: Function;

  private userState = getModule(UserModule);

  private searchState = getModule(SearchModule);

  subTransactionRows: SubTransactionRow[];

  get transactionTotal() {
    let total = 0;

    this.subTransactionRows.forEach((row: any) => {
      const rowTotal = row.price.getAmount() * row.amount;
      total += rowTotal;
    });

    return total;
  }

  get balanceAfter() {
    if (this.userState.user.saldo) {
      return this.userState.user.saldo.subtract(DineroType({
        amount: this.transactionTotal,
        currency: 'EUR',
      }));
    }

    return DineroType({
      amount: this.transactionTotal,
      currency: 'EUR',
    });
  }

  chargeOtherPerson() {
    this.openUserSearch();
  }

  organMemberSelected(user: User): void {
    (this.$refs.checkoutButton as CheckoutButton).organMemberSelected(user);

    this.userActivity(); // Indicate user activity
  }

  logout() {
    this.userState.reset();
    this.searchState.reset();
    this.loggedOut();
    this.$router.push('/');
    // @ts-ignore
    document.querySelector(':root').style.setProperty('--gewis-red', 'rgba(212, 0, 0, 1)');
  }
}
</script>
<style lang="scss" scoped>
@import "@/styles/global/variables.scss";

.checkoutbar {
  display: flex;
  flex-direction: column;
  flex: 0 0 380px;
  padding-left: 8px;
  border-radius: $border-radius;
  background: rgba(white, 0.8);
  padding: 16px;

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

  .products-table-container {
    flex: 1;
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
