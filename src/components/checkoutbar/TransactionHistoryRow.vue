<template>
  <b-row class="transaction-history-row" @click="openModal">

    <div class="date">{{this.date}}</div>
    <div class="time">{{this.time}}</div>
    <div class="value">{{this.value}}</div>
    <div v-if="isCreatedBySomeoneElse()" class="created-by">
      {{createdBy()}}
    </div>

    <transaction-details-modal
      :baseTransaction="transaction"
      :ref="`transaction-modal-${transaction.id}`"
    />
  </b-row>
</template>

<script lang="ts">
import Formatters from '@/mixins/Formatters';
import { Transaction } from '@/entities/Transaction';
import { Component, Prop } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import UserModule from '@/store/modules/user';
import TransactionDetailsModal from '@/components/checkoutbar/TransactionDetailsModal.vue';

@Component({
  components: { TransactionDetailsModal },
})
export default class ProductsTableRow extends Formatters {
  @Prop() transaction: Transaction;

  private userState = getModule(UserModule);

  get date() {
    return Formatters.dateFromObj(this.transaction.createdAt);
  }

  get time() {
    return Formatters.timeFromObj(this.transaction.createdAt);
  }

  get value() {
    return this.transaction.priceInclVat.toFormat();
  }

  openModal() {
    // @ts-ignore
    this.$refs[`transaction-modal-${this.transaction.id}`].show();
  }

  isCreatedBySomeoneElse(): boolean {
    return this.transaction.createdBy !== undefined
      && this.transaction.createdBy.id !== undefined
      && this.transaction.createdBy.id === this.userState.user.id
      && this.transaction.createdBy.id !== this.transaction.from.id;
  }

  createdBy(): string {
    if (this.transaction.createdBy === undefined) return '';
    if (this.transaction.createdBy.id === this.userState.user.id) {
      return `Created by you for ${this.transaction.from.firstName}`;
    }
    return `Created by ${this.transaction.createdBy.firstName}`;
  }
}
</script>

<style lang="scss" scoped>
.transaction-history-row {
  margin: 0 0 0.5rem 0;
  width: 100%;
  background: $gewis-grey-accent;
  border-radius: 8px;
  padding: 4px 0.5rem;
  display: flex;
  flex-wrap: wrap;
  cursor: pointer;

  div {
    flex: 1 1 30%;
  }
}
</style>
