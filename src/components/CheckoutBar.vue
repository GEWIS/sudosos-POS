<template>
  <b-container class="checkoutbar">
    <b-row>
      <b-col cols="8" class="user-data-container">
        <p class="user-data-line">
          <font-awesome-icon icon="user"/> {{ userState.name }}
        </p>
        <p class="user-data-line">
          <font-awesome-icon icon="wallet"/>
          <span :class="saldoClass">
            {{ dinero({ amount: userState.saldo}).toFormat() }}
          </span>
        </p>
      </b-col>
      <b-col class="logout-button">
        <font-awesome-icon icon="sign-out-alt" />
      </b-col>
    </b-row>
    <products-table :items="subTransactionRows"/>
  </b-container>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import Formatters from '@/mixins/Formatters';
import ProductsTable from '@/components/ProductsTable.vue';
import { SubTransaction } from '@/entities/SubTransaction';
import { SubTransactionRow } from '@/entities/SubTransactionRow';
@Component({
  components: { ProductsTable },
})
export default class CheckoutBar extends Formatters {
  private userState = this.$store.state.userState;

  private transactionState = this.$store.state.transactionState;

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
}
</script>
<style lang="scss" scoped>
  .checkoutbar {
    background-color: $gewis-grey;
    height: 100vh;
    display: flex;
    flex-direction: column;
    .user-data-container{
      padding-top: 0.5rem;
      background-color: #525659;
      .user-data-line {
        white-space: nowrap;
        overflow: hidden;
        display: block;
        text-overflow: ellipsis;
        color: white;
        span.positive {
          color: #93E78E;
        }
        span.negative {
          color: #ED5A5A;
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
  }
</style>
