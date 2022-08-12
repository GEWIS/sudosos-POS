<template>
  <div>
    <b-modal
      id="details-modal"
      title="Transaction details"
      centered
      size="lg"
      no-stacking
    >
      <p>
        {{`${this.date} - ${this.time}`}}
      </p>

      <div v-if="this.transaction === undefined">
        <b-spinner />
      </div>
      <TransactionDetails v-if="this.transaction !== undefined" :transaction="this.transaction" />

      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button
          variant="primary"
          id="details-cancel"
          @click="cancel()"
        >Close
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import {
  Component, Prop,
} from 'vue-property-decorator';
import Formatters from '@/mixins/Formatters';
import { Transaction } from '@/entities/Transaction';
import TransactionDetails from '@/components/TransactionDetails.vue';
import { getTransaction } from '@/api/transactions';

@Component({
  components: {
    TransactionDetails,
  },
})
export default class TransactionDetailsModal extends Formatters {
  @Prop() baseTransaction!: Transaction;

  @Prop() open: boolean;

  fullTransaction?: Transaction = undefined;

  private loading: boolean = true;

  get date() {
    return Formatters.dateFromObj(this.baseTransaction.createdAt);
  }

  get time() {
    return Formatters.timeFromObj(this.baseTransaction.createdAt);
  }

  get transaction() {
    console.log('get transaction');
    return this.fullTransaction;
  }

  set transaction(t: Transaction) {
    console.log('set transaction', t);
    this.fullTransaction = t;
  }

  show() {
    this.loading = true;
    this.$bvModal.show('details-modal');
    this.getTrans();
  }

  getTrans() {
    if (this.transaction === undefined) {
      getTransaction(this.baseTransaction.id)
        .then((t) => {
          this.transaction = t;
          this.loading = false;
        });
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
