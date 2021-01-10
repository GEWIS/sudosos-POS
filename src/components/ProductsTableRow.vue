<template>
  <b-row class="product-table-row">
    <b-col cols="2">
      <p class="first-col">{{ item.amount }}</p>
    </b-col>
    <b-col cols="6">
      <p>{{ item.product.name }}</p>
    </b-col>
    <b-col cols="4">
      <p>{{ dinero({ amount: productTotal}).toFormat() }}</p>
    </b-col>
  </b-row>
</template>
<script lang="ts">
import {
  Component, Prop, PropSync, Vue,
} from 'vue-property-decorator';
import { SubTransactionRow } from '@/entities/SubTransactionRow';
import Formatters from '@/mixins/Formatters';
@Component
export default class ProductsTable extends Formatters {
  @Prop() item!: SubTransactionRow;

  get productTotal() {
    return this.item.amount * this.item.price;
  }
}
</script>
<style lang="scss" scoped>
.products-table-row {
  border-bottom: 4px solid #525659;
  div{
    padding: 0;
    p {
      // align the first item center
      &.first-col {
        text-align: center;
      }
      font-size: 1.5em;
      margin-bottom: 0;
      margin-top: 0.5em;
    }
  }
}
</style>
