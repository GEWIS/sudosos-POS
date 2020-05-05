<template>
  <b-col class="text-center product-card px-2"
         cols="4" sm="4" md="3" lg="2">
    <div class="product">
      <img alt="Placeholder for Beugel" />
      <p class="w-100 product-name mb-0">{{ productProp.name }}</p>
      <p>&euro;Prijs</p>
    </div>
  </b-col>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Product } from '@/entities/Product';

@Component
export default class ProductComponent extends Vue {
  @Prop() productProp!: Product;
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
  }
</style>
