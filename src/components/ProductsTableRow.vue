<template>
  <b-row class="products-table-row">
    <b-button class="row-button" @click="decreaseItem">-</b-button>
    <div class="row-amount">{{amount}}</div>
    <b-button class="row-button" @click="increaseItem">+</b-button>
    <div class="row-name">{{ item.product.name }}</div>
    <div class="row-price">€{{ (productTotal / 100).toFixed(2) }}</div>
  </b-row>
</template>
<script lang="ts">
import {
  Component, Prop, PropSync, Vue,
} from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { SubTransactionRow } from '@/entities/SubTransactionRow';
import Formatters from '@/mixins/Formatters';
import Keypad from '@/components/Keypad.vue';
import TransactionModule from '@/store/modules/transactions';

@Component({
  components: {
    Keypad,
  },
})
export default class ProductsTableRow extends Formatters {
  @Prop() item!: SubTransactionRow;

  transactionsState = getModule(TransactionModule);

  get productTotal() {
    return (this.item.price as any).amount * this.item.amount;
  }

  get amount() {
    const itemIndex = (this.$parent.$parent.$parent as any).rows
      .findIndex((row) => row.product.id === this.item.product.id);

    return (this.$parent.$parent.$parent as any).rows[itemIndex].amount;
  }

  set amount(value: number) {
    const itemIndex = (this.$parent.$parent.$parent as any).rows
      .findIndex((row) => row.product.id === this.item.product.id);

    (this.$parent.$parent.$parent as any).rows[itemIndex].amount = value;
  }

  deleteItem() {
    const { rows } = this.$parent.$parent.$parent as any;
    (this.$parent.$parent.$parent as any).rows = rows
      .filter((row) => row.product.id !== this.item.product.id);
  }

  increaseItem() {
    this.amount += 1;
  }

  decreaseItem() {
    if (this.amount > 1) {
      this.amount -= 1;
    } else {
      this.deleteItem();
    }
  }
}
</script>
<style lang="scss" scoped>
.products-table-row {
  width: 100%;
  margin: 0 0 4px 0;
  align-items: center;

  .row-button {
    width: 40px;
    height: 40px;
    line-height: 20px;
    color: white;
    font-size: 20px;
    background: $gewis-red;
    border: none;

    &:active {
      background-color: $gewis-red !important;
      border: none;
    }
  }

  .row-amount {
    margin: 0 8px;
  }

  .row-name {
    margin-left: 8px;
    flex: 1;
  }

  .row-price {
    justify-self: right;
    margin-right: 12px;
  }
}
</style>
