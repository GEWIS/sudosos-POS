<template>
  <div>
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
      <TransactionDetails v-if="!loading" :transaction="this.transaction" />

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

  loading = false;

  async mounted() {
    this.loading = true;
    await this.getTrans();
  }

  get date() {
    return Formatters.dateFromObj(this.baseTransaction.createdAt);
  }

  get time() {
    return Formatters.timeFromObj(this.baseTransaction.createdAt);
  }

  async getTrans() {
    const transaction = await getTransaction(this.baseTransaction.id);
    Object.assign(this.transaction, transaction);
    this.loading = false;
  }
}
</script>

<style lang="scss" scoped>

</style>
