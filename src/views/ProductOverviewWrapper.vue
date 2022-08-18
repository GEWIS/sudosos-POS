<template>
  <div class="wrapper">
    <div v-if="posNotLoaded" class="product-overview-loader">
      <div>
        <b-spinner />
      </div>
    </div>

    <div v-else>
      <product-overview />
    </div>

    <div class="background-logo">
      <!--      <img src="@/assets/img/base-gewis-logo.png" alt="logo" />-->
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import ProductOverview from '@/views/ProductOverview.vue';
import Component from 'vue-class-component';
import { getModule } from 'vuex-module-decorators';
import PointOfSaleModule from '@/store/modules/point-of-sale';
import SearchModule from '@/store/modules/search';
import UserModule from '@/store/modules/user';

@Component({
  components: { ProductOverview },
})
export default class ProductOverviewWrapper extends Vue {
  private searchState = getModule(SearchModule);

  private userState = getModule(UserModule);

  private pointOfSaleState = getModule(PointOfSaleModule);

  get posNotLoaded() {
    return this.pointOfSaleState.pointOfSale === undefined
      || Object.keys(this.pointOfSaleState.pointOfSale).length === 0;
  }

  async mounted() {
    if (this.pointOfSaleState.pointOfSale === undefined
      || this.pointOfSaleState.pointOfSale.id === undefined) {
      this.pointOfSaleState.fetchPointOfSale(1);
    }
    this.searchState.resetFilterCategory();
    this.searchState.fetchTransactionHistory();
  }
}
</script>

<style scoped lang="scss">
@import "~bootstrap/scss/bootstrap";
@import "./src/styles/common.scss";
@import "./src/styles/Nav.scss";

.product-overview-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
