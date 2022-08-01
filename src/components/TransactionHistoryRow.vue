<template>
  <b-row class="transaction-history-row">
    <div class="date">{{this.date}}</div>
    <div class="time">{{this.time}}</div>
    <div class="value">€{{this.value}}</div>
    <div v-if="isCreatedBySomeoneElse()" class="created-by">
      {{createdBy()}}
    </div>
  </b-row>
</template>

<script lang="ts">
import Formatters from '@/mixins/Formatters';
import { Transaction } from '@/entities/Transaction';
import { Component, Prop } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import UserModule from '@/store/modules/user';

@Component
export default class ProductsTableRow extends Formatters {
  @Prop() transaction: Transaction;

  private userState = getModule(UserModule);

  get date() {
    let d = this.transaction.createdAt;
    const offset = d.getTimezoneOffset();
    d = new Date(d.getTime() - (offset * 60 * 1000));
    return d.toISOString().split('T')[0];
  }

  get time() {
    let d = this.transaction.createdAt;
    const offset = d.getTimezoneOffset();
    d = new Date(d.getTime() - (offset * 60 * 1000));
    return d.toISOString().split('T')[1].split('.')[0];
  }

  get value() {
    return (this.transaction.price.amount / 100).toFixed(2);
  }

  isCreatedBySomeoneElse(): boolean {
    return this.transaction.createdBy !== undefined
      && this.transaction.createdBy.id !== undefined
      && this.transaction.createdBy.id === this.userState.user.id;
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

  div {
    flex: 1 1 30%;
  }
}
</style>
