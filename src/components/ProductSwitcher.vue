<template>
  <div>
    <b-tabs>
      <b-tab
      v-for="category in productCategories"
      :key="category.id"
      :products="category.products"
      :title="category.name"
      >
        <ProductCategoryOverview :products="category.products"></ProductCategoryOverview>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import { Component, Prop, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue';
import ProductCategoryOverview from '@/components/ProductCategoryOverview.vue';
import { Product } from '@/entities/Product';
import { ProductCategory } from '@/entities/ProductCategory';

@Component({
  components: {
    ProductCategoryOverview,
  },
})
export default class ProductSwitcher extends Vue {
  @Prop()
  productCategories!: ProductCategory[];
}
</script>

<style scoped lang="scss">

</style>
