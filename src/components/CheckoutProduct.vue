<template>
<b-row class="w-100 mx-0 my-2 px-1 py-2">
  <b-col cols="12" sm="6" class="text-truncate">{{ product.name }}</b-col>
  <b-col cols="6" sm="3" class="text-left text-sm-center mt-1 mt-sm-0">
    <span>
      <span>
        <font-awesome-icon icon="minus" size="xs" class="mr-1 icon remove" />
      </span>
      x{{ subTransaction.amount }}
    <span><font-awesome-icon icon="plus" size="xs" class="ml-1 icon add" /></span>
    </span>
  </b-col>
  <b-col cols="6" sm="3" class="text-right mt-1 mt-sm-0">
    <span>
    {{ dinero({amount: subTransaction.pricePerProduct * subTransaction.amount}).toFormat() }}
    <font-awesome-icon icon="times" size="xs" class="ml-1 icon remove" />
      </span>
  </b-col>
</b-row>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import { SubTransaction } from '@/entities/SubTransaction';
import Formatters from '@/mixins/Formatters';
import { Product } from '@/entities/Product';
import FakeProducts from '@/assets/FakeProducts';


@Component
export default class CheckoutProduct extends Formatters {
  @Prop() subTransaction!: SubTransaction;

  product : Product = FakeProducts.fetchProducts()[Number(this.subTransaction.productId)];
}
</script>

<style scoped lang="scss">
  .icon:hover {
    cursor: pointer;

    &.add {
      color: $gewis-green;
    }

    &.remove {
      color: $gewis-red;
    }
  }

  .row {
    background-color: $gewis-grey-accent;
  }
</style>
