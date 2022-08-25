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
    <TransactionDetails v-else :transaction="this.transaction" />

    <template v-slot:modal-footer="{ ok, cancel }">
      <b-button
        variant="primary"
        id="details-cancel"
        @click="cancel()"
      >Close
      </b-button>
    </template>
  </b-modal>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
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

  transaction: Transaction = {} as Transaction;

  loading = true;

  get date() {
    return Formatters.dateFromObj(this.baseTransaction.createdAt);
  }

  get time() {
    return Formatters.timeFromObj(this.baseTransaction.createdAt);
  }

  async show() {
    this.$bvModal.show(`details-modal-${this.baseTransaction.id}`);
    await this.getTrans();
  }

  async getTrans() {
    if (Object.keys(this.transaction).length > 0 || !this.loading) return;
    const transaction = await getTransaction(this.baseTransaction.id);
    Object.assign(this.transaction, transaction);
    this.loading = false;
  }
}
</script>

<style lang="scss" scoped>

</style>
