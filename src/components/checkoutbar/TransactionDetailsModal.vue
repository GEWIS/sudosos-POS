<template>
  <b-modal
    :id="`details-modal-${baseTransaction.id}`"
    title="Transaction details"
    centered
    size="lg"
    no-stacking
  >
    <p>
      {{`${date} - ${time}`}}
    </p>

    <div v-if="loading">
      <b-spinner />
    </div>
    <TransactionDetails v-else :transaction="transaction" />

    <template v-slot:modal-footer="{ ok, cancel }">
      <b-button
        variant="primary"
        id="details-cancel"
        @click="cancel()">
        Close
      </b-button>
    </template>
  </b-modal>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import Formatters from '@/mixins/Formatters';
import { Transaction } from '@/entities/Transaction';
import TransactionDetails from '@/components/checkoutbar/TransactionDetails.vue';
import { getTransaction } from '@/api/transactions';

/**
 * Component for displaying transaction details in a modal.
 */
@Component({
  components: {
  TransactionDetails,
  },
  })
export default class TransactionDetailsModal extends Formatters {
  /**
   * The base information of transaction to display.
   */
  @Prop() baseTransaction!: Transaction;

  /**
   * The full information of transaction to display.
   */
  transaction: Transaction = {} as Transaction;

  /**
   * Whether the transaction is loading.
   */
  loading = true;

  /**
   * The date of the transaction.
   */
  get date() {
    return Formatters.dateFromObj(this.baseTransaction.createdAt);
  }

  /**
   * The time of the transaction.
   */
  get time() {
    return Formatters.timeFromObj(this.baseTransaction.createdAt);
  }

  /**
   * Shows the modal and loads the transaction.
   */
  async show() {
    this.$bvModal.show(`details-modal-${this.baseTransaction.id}`);
    await this.getTrans();
  }

  /**
   * Loads the transaction.
   */
  async getTrans() {
    if (Object.keys(this.transaction).length > 0 || !this.loading) return;
    const transaction = await getTransaction(this.baseTransaction.id);
    Object.assign(this.transaction, transaction);
    this.loading = false;
  }
}
</script>
