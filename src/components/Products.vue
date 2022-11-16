<template>
  <div class="products">
    <Product
      v-for="item in products"
      :product="item"
      :key="`${item.id}-${item.containerId}`"
      @selected="increaseProduct(item)"
    />
    <div class="no-components" v-if="products.length === 0">
      <div v-if="searching">There are no products for this query.</div>
      <div v-else>There are no products in this category.</div>
    </div>
  </div>
</template>
<script lang="ts">
import { ProductInContainer } from '@/entities/Product';
import { Vue, Prop, Component } from 'vue-property-decorator';
import Product from '@/components/Product.vue';
import { getModule } from 'vuex-module-decorators';
import CartModule from '@/store/modules/cart';

@Component({
  components: {
    Product: Product,
  },
})
export default class Products extends Vue {
  @Prop() products!: ProductInContainer[];
  @Prop() searching!: boolean;

  private cartState = getModule(CartModule);

  increaseProduct(product: ProductInContainer) {
    this.cartState.increaseProduct({product, amount: 1});
  }
}
</script>
<style scoped lang="scss">
.products {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
  margin: 16px 0;
}

.no-components {
  width: 100%;
  flex: 1;
  text-align: center;
  margin-top: 8px;
}
</style>