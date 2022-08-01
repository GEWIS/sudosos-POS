<template>
  <div class="transaction-history-table-container">
    <transaction-history-row
      v-for="transaction in transactions"
      :key="transaction.id"
      :transaction="transaction"
    />
  </div>
</template>

<script>
import {
  Component, Prop, Vue,
} from 'vue-property-decorator';
import { Transaction } from '@/entities/Transaction';
import TransactionHistoryRow from '@/components/TransactionHistoryRow.vue';

@Component({
  components: {
    TransactionHistoryRow,
  },
})
export default class TransactionHistory extends Vue {
  @Prop() transactions;
}
</script>

<style scoped>

</style>
