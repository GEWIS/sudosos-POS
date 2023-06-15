<template>
  <div class="content-container">
    <div class="content-top">
      <CategorieButtons :categories="categories" />
      <BackendStatus />
    </div>
    <div class="content-center">
      <Scrollable>
        <Products
          :products="filteredProducts"
          :searching="false" />
      </Scrollable>
    </div>
    <div class="content-bottom">
      <Settings @forceUpdateStore="$emit('forceUpdateStore')" />
      <SearchBarButton @clicked="$emit('openProductSearch')" />
      <ActivityTimer ref="activityTimer" v-if="shouldTrackActivity"/>
    </div>
  </div>
</template>
<script lang="ts">
import {
  Product, ProductInContainer,
} from '@/entities/Product';
import {
  Vue, Component,
} from 'vue-facing-decorator';
import CategorieButtons from '@/components/maincontent/categories/CategorieButtons.vue';
import BackendStatus from '@/components/maincontent/categories/BackendStatus.vue';
import Products from '@/components/maincontent/common/Products.vue';
import Settings from '@/components/maincontent/categories/Settings.vue';
import SearchBarButton from '@/components/maincontent/categories/SearchBarButton.vue';
import ActivityTimer from '@/components/maincontent/categories/ActivityTimer.vue';
import { getModule } from 'vuex-module-decorators';
import PointOfSaleModule from '@/store/modules/point-of-sale';
import SearchModule from '@/store/modules/search';
import Scrollable from '@/components/maincontent/common/Scrollable.vue';
import { ProductCategory } from '@/entities/ProductCategory';

/**
 * Component for the main content containing an overview of the products per
 * category.
 */
@Component({
  components: {
  CategorieButtons,
  BackendStatus,
  Products,
  Settings,
  SearchBarButton,
  ActivityTimer,
  Scrollable,
  },
  })
export default class MainContentCategories extends Vue {
  private pointOfSaleState = getModule(PointOfSaleModule);

  private searchState = getModule(SearchModule);

  /**
   * If the activity should be shown and should track if the user stays active.
   */
  get shouldTrackActivity(): boolean {
    return this.pointOfSaleState.pointOfSale.useAuthentication;
  }

  /**
   * The products that should be shown. This is a computed property that filters
   * the products based on the current category. It will also sort them by name
   * and put names that start with _ at the start.
   */
  get filteredProducts(): ProductInContainer[] {
    const sortFn = (a: Product, b: Product) => {
      if (a.name[0] === '_' && b.name[0] !== '_') return -1;
      if (a.name[0] !== '_' && b.name[0] === '_') return 1;
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    };

    const currentCategory = this.searchState.filterCategory;
    if (currentCategory === 0) {
      return this.pointOfSaleState.allProducts.sort(sortFn);
    }
    return this.pointOfSaleState.allProducts.filter(
      (product: Product) => product.category.id === currentCategory,
    ).sort(sortFn);
  }

  /**
   * The allowed categories that should be shown.
   */
  get categories(): ProductCategory[] {
    return this.pointOfSaleState.categories;
  }
}
</script>
<style lang="scss" scoped>
.content-bottom {
  gap: $default-padding-half;
  flex: $top-bottom-height 0 0;
}
</style>
