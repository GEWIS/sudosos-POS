<template>
  <div class="wrapper">
    <div v-if="posNotLoaded" class="home-loader">
      <div>
        <b-spinner />
      </div>
    </div>
    <div v-else>
      <home />
    </div>
    <div class="background-logo">
      <!--      <img src="@/assets/img/base-gewis-logo.png" alt="logo" />-->
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import Home from '@/components/Home.vue';
import Component from 'vue-class-component';
import { getModule } from 'vuex-module-decorators';
import PointOfSaleModule from '@/store/modules/point-of-sale';
import SearchModule from '@/store/modules/search';

@Component({
  components: { Home },
})
export default class HomeWrapper extends Vue {
  private searchState = getModule(SearchModule);

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
.home-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
