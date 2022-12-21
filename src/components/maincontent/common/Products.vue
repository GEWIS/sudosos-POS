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
import { 
  Vue, Prop, Component 
} from 'vue-property-decorator';
import Product from '@/components/maincontent/common/Product.vue';
import { getModule } from 'vuex-module-decorators';
import CartModule from '@/store/modules/cart';

/**
 * Component for a list of products card.
 */
@Component({
  components: {
    Product: Product,
  },
})
export default class Products extends Vue {
  /**
   * The list of products. This is a required prop.
   */
  @Prop() products!: ProductInContainer[];

  /**
   * If the component is currently searching. This is a required prop.
   */
  @Prop() searching!: boolean;

  private cartState = getModule(CartModule);

  /**
   * Called when a product is clicked. Increases the amount of the product in
   * the cart by 1.
   */
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
  gap: $default-padding-half;
  margin: 0;
}

.no-components {
  width: 100%;
  flex: 1;
  text-align: center;
  margin-top: $default-padding-half;
}
</style>