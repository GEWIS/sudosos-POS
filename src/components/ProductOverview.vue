<template>
  <div>
    <b-row class="mx-0">
      <ProductItem v-for="item in products"
                        :product="item"
                        :key="item.id"
      />
    </b-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Product } from '@/entities/Product';
import ProductItem from '@/components/ProductItem.vue';

  @Component({
    components: {
      ProductItem,
    },
  })

export default class ProductOverview extends Vue {
    @Prop()
    products!: Product[];
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
