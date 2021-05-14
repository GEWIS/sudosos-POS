<template>
  <div class="checkoutbar">
    <b-row class="user-data-header">
      <b-col cols="8" class="user-data-container">
        <p class="user-data-line">
          <font-awesome-icon icon="user" /> {{ userState.user.name }}
        </p>
        <p class="user-data-line">
          <font-awesome-icon icon="wallet" />
          <span :class="saldoClass" v-if="userState.user.saldo">
            {{ userState.user.saldo.toFormat() }}
          </span>
        </p>
      </b-col>
      <b-col class="logout-button">
        <font-awesome-icon icon="sign-out-alt" />
      </b-col>
    </b-row>
    <products-table :items="subTransactionRows" />
    <b-row class="transaction-detail-row">
      <b-col cols="6" offset="2"><p>Total</p></b-col>
      <b-col cols="4">
          <p v-if="userState.saldo">
            {{ userState.saldo.toFormat() }}
          </p>
        </b-col>
    </b-row>
    <b-row class="transaction-detail-row">
      <b-col cols="6" offset="2"><p>Balance after</p></b-col>
      <b-col cols="4"><p>{{ balanceAfter.toFormat() }}</p></b-col>
    </b-row>
    <checkout-button />
    <b-row class="charge-other-button" @click="chargeOtherPerson">
      <p v-if="searchState.chargingUser.name === undefined">
        <font-awesome-icon icon="user-friends"/> Charge someone else
      </p>
      <p v-else>
        Charging {{ searchState.chargingUser.name }}
      </p>
    </b-row>
  </div>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import Dinero from 'dinero.js';
import Formatters from '@/mixins/Formatters';
import ProductsTable from '@/components/ProductsTable.vue';
import CheckoutButton from '@/components/CheckoutButton.vue';
import { SubTransaction } from '@/entities/SubTransaction';
import { SubTransactionRow } from '@/entities/SubTransactionRow';
import { User } from '@/entities/User';
import UserModule from '@/store/modules/user';
import TransactionModule from '@/store/modules/transactions';
import SearchModule from '@/store/modules/search';

@Component({
  components: { ProductsTable, CheckoutButton },
})
export default class CheckoutBar extends Formatters {
  private userState = getModule(UserModule);

  private transactionState = getModule(TransactionModule);

  private searchState = getModule(SearchModule);

  // Other user to charge
  private charging: User|null = null;

  get saldoClass() {
    if (this.userState.user.saldo instanceof Number) {
      const saldo = this.dinero({ amount: this.userState.user.saldo });
      return saldo.isPositive() ? 'positive' : 'negative';
    }
    return 'positive';
  }

  get subTransactionRows() {
    if (this.transactionState.currentTransaction.subTransactions) {
      if (this.transactionState.currentTransaction.subTransactions.length === 0) {
        return [];
      }
      return this.transactionState.currentTransaction.subTransactions
        .map((sub: SubTransaction) => sub.subTransactionRows)
        .reduce((acc: SubTransactionRow[], curr: SubTransactionRow[]) => acc.concat(curr));
    }
    return [];
  }

  get transactionTotal() {
    return this.subTransactionRows.reduce(
      (acc: number, curr: SubTransactionRow) => acc + curr.price.multiply(curr.amount).getAmount(),
      0,
    );
  }

  get balanceAfter() {
    if (this.userState.user.saldo) {
      return this.userState.user.saldo.subtract(Dinero({ amount: this.transactionTotal }));
    }
    return Dinero({ amount: this.transactionTotal });
  }

  chargeOtherPerson() {
    this.searchState.setUserSearching(true);
  }
}
</script>
<style lang="scss" scoped>
.checkoutbar {
  background-color: #dadada;
  height: 100vh;
  display: flex;
  flex-direction: column;
  .row {
    margin: 0;
  }
  .user-data-header {
    .user-data-container {
      padding-top: 0.5rem;
      background-color: #525659;
      .user-data-line {
        white-space: nowrap;
        overflow: hidden;
        display: block;
        text-overflow: ellipsis;
        color: white;
        span.positive {
          color: #93e78e;
        }
        span.negative {
          color: #ed5a5a;
        }
      }
    }
  }
  .logout-button {
    background-color: red;
    padding: 15px;
    svg {
      width: 100%;
      height: 100%;
      color: white;
    }
  }
  .products-table-container {
    flex: 1;
  }
  .transaction-detail-row {
    border-bottom: 4px solid white;
    div {
      padding: 0;
      p {
        margin-bottom: 0.5em;
        margin-top: 0.5em;
        font-weight: 700;
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
}
</style>
