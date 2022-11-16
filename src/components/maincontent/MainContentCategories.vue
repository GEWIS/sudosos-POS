<template>
  <div class="content-container">
    <div class="content-top">
      <CategorieButtons :categories="pointOfSaleState.categories" />
      <BackendStatus />
    </div>
    <div class="content-center custom-scrollbar">
      <Products
        :products="filteredProducts"
        :searching="false" />
    </div>
    <div class="content-bottom">
      <Settings @forceUpdateStore="$emit('forceUpdateStore')" />
      <SearchBarButton @clicked="$emit('openProductSearch')" /> 
      <ActivityTimer ref="activityTimer" v-if="shouldTrackActivity"/>
    </div>
  </div>
</template>
<script lang="ts">
import { Product, ProductInContainer } from '@/entities/Product';
import { Vue, Component, Prop } from 'vue-property-decorator';
import CategorieButtons from '@/components/maincontent/categories/CategorieButtons.vue';
import BackendStatus from '@/components/maincontent/categories/BackendStatus.vue';
import Products from '@/components/maincontent/common/Products.vue';
import Settings from '@/components/maincontent/categories/Settings.vue';
import SearchBarButton from '@/components/maincontent/categories/SearchBarButton.vue';
import ActivityTimer from '@/components/maincontent/categories/ActivityTimer.vue';
import { getModule } from 'vuex-module-decorators';
import PointOfSaleModule from '@/store/modules/point-of-sale';
import UserModule from '@/store/modules/user';
import SearchModule from '@/store/modules/search';

@Component({
  components: {
    CategorieButtons,
    BackendStatus,
    Products,
    Settings,
    SearchBarButton,
    ActivityTimer,
  },
})
export default class MainContentProducts extends Vue {
  @Prop() products!: ProductInContainer[];

  private pointOfSaleState = getModule(PointOfSaleModule);

  private userState = getModule(UserModule);

  private searchState = getModule(SearchModule);

  get shouldTrackActivity(): boolean {
    return this.pointOfSaleState.pointOfSale.useAuthentication;
  }

  get filteredProducts(): ProductInContainer[] {
    const sortFn = (a: Product, b: Product) => {
      if (a.name[0] === '_' && b.name[0] !== '_') return -1;
      if (a.name[0] !== '_' && b.name[0] === '_') return 1;
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    };

    // @ts-ignore
    const currentCategory = this.searchState.filterCategory;
    if (currentCategory === 0) {
      return this.products.sort(sortFn);
    }
    return this.products.filter(
      (product: Product) => product.category.id === currentCategory,
    ).sort(sortFn);
  }
}
</script>
<style lang="scss" scoped>
@import "./src/styles/common.scss";
@import "./src/styles/Nav.scss";

.content-bottom {
  gap: 12px;
}
</style>