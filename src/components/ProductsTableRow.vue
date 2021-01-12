<template>
  <b-row class="products-table-row">
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
  border-bottom: 4px solid white;
  div{
    padding: 0;
    p {
      // align the first item center
      &.first-col {
        text-align: center;
      }
      margin-bottom: 0.5em;
      margin-top: 0.5em;
      font-weight: 700;
    }
  }
}
</style>
