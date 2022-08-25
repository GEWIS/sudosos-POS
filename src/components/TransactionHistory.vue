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
