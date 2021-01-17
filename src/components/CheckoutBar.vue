<template>
  <b-container class="checkoutbar">
    <b-row>
      <b-col cols="8" class="user-data-container">
        <p class="user-data-line">
          <font-awesome-icon icon="user" /> {{ userState.name }}
        </p>
        <p class="user-data-line">
          <font-awesome-icon icon="wallet" />
          <span :class="saldoClass">
            {{ dinero({ amount: userState.saldo }).toFormat() }}
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
      <b-col cols="4"><p>{{
        dinero({ amount: transactionTotal }).toFormat()
      }}</p></b-col>
    </b-row>
    <b-row class="transaction-detail-row">
      <b-col cols="6" offset="2"><p>Balance after</p></b-col>
      <b-col cols="4"><p>{{ dinero({ amount: balanceAfter }).toFormat() }}</p></b-col>
    </b-row>
    <checkout-button />
    <b-row class="charge-other-button">
      <p v-if="charging === null">
        <font-awesome-icon icon="user-friends"/> Charge someone
      </p>
      <p v-else>
        Charging {{ charging.name }}
      </p>
    </b-row>
  </b-container>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import Formatters from '@/mixins/Formatters';
import ProductsTable from '@/components/ProductsTable.vue';
import CheckoutButton from '@/components/CheckoutButton.vue';
import { SubTransaction } from '@/entities/SubTransaction';
import { SubTransactionRow } from '@/entities/SubTransactionRow';
import { User } from '@/entities/User';
@Component({
  components: { ProductsTable, CheckoutButton },
})
export default class CheckoutBar extends Formatters {
  private userState = this.$store.state.userState;

  private transactionState = this.$store.state.transactionState;

  // Other user to charge
  private charging: User|null = null;

  get saldoClass() {
    const saldo = this.dinero({ amount: this.userState.saldo });
    return saldo.isPositive() ? 'positive' : 'negative';
  }

  get subTransactionRows() {
    if (this.transactionState.subTransactions.length === 0) {
      return [];
    }
    return this.transactionState.subTransactions
      .map((sub: SubTransaction) => sub.subTransactionRows)
      .reduce((acc: SubTransactionRow[], curr: SubTransactionRow[]) => acc.concat(curr));
  }

  get transactionTotal() {
    return this.subTransactionRows.reduce(
      (acc: number, curr: SubTransactionRow) => acc + curr.amount * curr.price,
      0,
    );
  }

  get balanceAfter() {
    return this.userState.saldo - this.transactionTotal;
  }
}
</script>
<style lang="scss" scoped>
.checkoutbar {
  background-color: #dadada;
  height: 100vh;
  display: flex;
  flex-direction: column;
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
