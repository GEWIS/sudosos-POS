<template>
  <b-row class="transaction-history-row" @click="openModal">
    <div class="top">
      <div class="date">{{date}}</div>
      <div class="time">{{time}}</div>
      <div class="value">{{value}}</div>
    </div>
    <div class="bottom">
      <div v-if="isCreatedBySomeoneElse()" class="created-by">
        {{createdBy()}}
      </div>
    </div>
    <transaction-details-modal
      :baseTransaction="transaction"
      :ref="`transaction-modal-${transaction.id}`" />
  </b-row>
</template>

<script lang="ts">
import Formatters from '@/mixins/Formatters';
import { Transaction } from '@/entities/Transaction';
import { Vue, Component, Prop } from 'vue-facing-decorator';
import { getModule } from 'vuex-module-decorators';
import UserModule from '@/store/modules/user';
import TransactionDetailsModal from '@/components/checkoutbar/TransactionDetailsModal.vue';

/**
 * Component for displaying a single transaction in the transaction history.
 */
@Component({
  components: { TransactionDetailsModal },
  })
export default class TransactionHistoryRow extends Vue {
  /**
   * The transaction to display.
   */
  @Prop() transaction: Transaction;

  private userState = getModule(UserModule);

  /**
   * The date of the transaction.
   */
  get date() {
    return Formatters.dateFromObj(this.transaction.createdAt);
  }

  /**
   * The time of the transaction.
   */
  get time() {
    return Formatters.timeFromObj(this.transaction.createdAt);
  }

  /**
   * The value of the transaction.
   */
  get value() {
    return this.transaction.priceInclVat.toFormat();
  }

  /**
   * Opens the transaction details modal.
   */
  openModal() {
    // @ts-ignore
    this.$refs[`transaction-modal-${this.transaction.id}`].show();
  }

  /**
   * Checks if the transaction was created by someone else.
   */
  isCreatedBySomeoneElse(): boolean {
    return this.transaction.createdBy !== undefined
      && this.transaction.createdBy.id !== undefined
      && this.transaction.createdBy.id === this.userState.user.id
      && this.transaction.createdBy.id !== this.transaction.from.id;
  }

  /**
   * Returns the text to display for who created the transaction.
   */
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
  margin: 0 0 $default-padding-half 0;
  width: 100%;
  background: white;
  border-radius: 8px;
  padding: 8px 16px;
  display: flex;
  flex-wrap: wrap;
  cursor: pointer;
  flex-direction: column;

  .top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;

    .date {
      font-size: 18px;
      font-weight: 500;
    }

    .time {
      font-size: 18px;
      font-weight: 500;
    }

    .value {
      font-size: 18px;
      font-weight: 500;
    }
  }

  .bottom {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;

    .created-by {
      font-size: 15px;
      font-weight: 500;
    }
  }
}
</style>
