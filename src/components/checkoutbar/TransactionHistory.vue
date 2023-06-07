<template>
  <div class="transaction-history-table-container">
    <transaction-history-row
      v-for="transaction in transactions"
      :key="transaction.id"
      :transaction="transaction"
    />
  </div>
</template>

<script lang="ts">
import {
  Component, Prop, Vue,
} from 'vue-property-decorator';
import TransactionHistoryRow from '@/components/checkoutbar/TransactionHistoryRow.vue';
import { Transaction } from '@/entities/Transaction';

/**
 * Component for displaying the transaction history of a user.
 */
@Component({
  components: {
  TransactionHistoryRow,
  },
  })
export default class TransactionHistory extends Vue {
  /**
   * The transactions to display.
   */
  @Prop() transactions!: Transaction[];
}
</script>
