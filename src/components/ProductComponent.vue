<template>
    <div class="product">
      <img alt="Placeholder for Beugel" />
      <p class="w-100 product-name mb-0">{{product.name}}</p>
      <p>&euro;Prijs</p>
    </div>
</template>

<script lang="ts">
import { Prop, Vue } from 'vue-property-decorator';
import { Product } from '@/entities/Product';

export default class ProductComponent extends Vue {
  @Prop()
  product: Product | undefined;
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
