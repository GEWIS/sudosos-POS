<template>
  <div class="wrapper">
    <div v-if="posNotLoaded" class="home-loader">
      <div>
        <b-spinner />
      </div>
    </div>
    <div v-else>
      <Home />
    </div>
    <Background />
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import Home from '@/components/Home.vue';
import Component from 'vue-class-component';
import { getModule } from 'vuex-module-decorators';
import PointOfSaleModule from '@/store/modules/point-of-sale';
import SearchModule from '@/store/modules/search';
import Background from '@/components/Background.vue';

/**
 * HomeWrapper contains the Home component and the Background component.
 */
@Component({
  components: { 
    Home,
    Background,
  },
})
export default class HomeWrapper extends Vue {
  private searchState = getModule(SearchModule);

  private pointOfSaleState = getModule(PointOfSaleModule);

  /**
   * Returns true if the point of sale is not loaded.
   */
  get posNotLoaded() {
    return this.pointOfSaleState.pointOfSale === undefined
      || Object.keys(this.pointOfSaleState.pointOfSale).length === 0;
  }

  /**
   * When the component is mounted, fetch the point of sale and the transaction history.
   */
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
.home-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
