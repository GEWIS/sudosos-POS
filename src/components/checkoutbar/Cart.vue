<template>
  <div class="cart">
    <CartProduct v-for="item in items" :key="item.product.id" :item="item"/>
  </div>
</template>
<script lang="ts">
import {
  Component, Prop, Vue,
} from 'vue-property-decorator';
import { SubTransactionRow } from '@/entities/SubTransactionRow';
import CartProduct from '@/components/checkoutbar/CartProduct.vue';

/**
 * Component for displaying the products that are currently in the shopping
 * cart.
 */
@Component({
  components: {
    CartProduct,
  },
})
export default class Cart extends Vue {
  /**
   * The items that are currently in the shopping cart. This is a list of
   * SubTransactionRows and a required prop of this component.
   */
  @Prop() items!: SubTransactionRow[];
}
</script>
<style lang="scss" scoped>
.cart {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: $default-padding-half;
}
</style>