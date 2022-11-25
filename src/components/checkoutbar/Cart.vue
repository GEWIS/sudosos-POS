<template>
  <div class="products-table-container">
    <CartProduct v-for="item in items" :key="item.product.id" :item="item"/>
  </div>
</template>
<script lang="ts">
import {
  Component, Prop, Vue,
} from 'vue-property-decorator';
import { SubTransactionRow } from '@/entities/SubTransactionRow';
import CartProduct from '@/components/checkoutbar/CartProduct.vue';

@Component({
  components: {
    CartProduct,
  },
})
export default class ProductsTable extends Vue {
  @Prop() items!: SubTransactionRow[];
}
</script>
