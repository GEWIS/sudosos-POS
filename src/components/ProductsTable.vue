<template>
  <div class="products-table-container">
    <products-table-header/>
    <products-table-row v-for="item in items" :key="item.product.id" :item="item" />
  </div>
</template>
<script lang="ts">
import {
  Component, Prop, PropSync, Vue,
} from 'vue-property-decorator';
import { SubTransactionRow } from '@/entities/SubTransactionRow';
import ProductsTableHeader from '@/components/ProductsTableHeader.vue';
import ProductsTableRow from '@/components/ProductsTableRow.vue';

@Component({
  components: {
    ProductsTableHeader,
    ProductsTableRow,
  },
})
export default class ProductsTable extends Vue {
  @Prop() items!: SubTransactionRow[];
}
</script>
