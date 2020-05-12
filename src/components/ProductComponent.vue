<template>
  <b-col class="text-center product-card px-2"
         cols="4" sm="4" md="3" lg="2">
    <div class="product">
      <img :src="product.picture" alt="Placeholder for Beugel" />
      <p class="w-100 product-name mb-0">{{ product.name }}</p>
      <p class="w-100 product-price mb-0">({{ dinero({amount: product.price}).toFormat() }})</p>
    </div>
  </b-col>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import { Product } from '@/entities/Product';
import Formatters from '@/mixins/Formatters';

@Component
export default class ProductComponent extends Formatters {
  @Prop() product!: Product;
}

</script>

<style scoped lang="scss">
  .product-card {
    margin: 0.5rem 0;

    .product {
      background-color: $gewis-grey-light;

      > img {
        width: auto;
        height: auto;
        max-height: 5rem;
        background-color: $gewis-grey-light;
      }
    }
  }

  .product-name {
    background: $gewis-grey-accent;
    font-weight: bold;
  }

  .product-price {
    background: $gewis-grey-accent;
  }
</style>
