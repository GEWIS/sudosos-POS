<template>
  <div class="content-container">
    <div class="content-top">
      <ExitButton @click="$emit('exit')" />
      <SearchBar ref="searchBar" @update="e => updateSearchFromInput(e)" />
    </div>
    <div class="content-center">
      <Scrollable>
        <Products
          :products="filteredProducts"
          :searching="true" 
          @selected="item => addProduct({product: item, amount: 1})" />
      </Scrollable>
    </div>
    <div class="content-bottom">
      <div class="keyboard-container">
		<Keyboard
      ref="keyboard"
          :onChange="updateSearchFromKeyboard"
          :allowNumbers="false" />
	  </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import SearchBar from '@/components/maincontent/common/SearchBar.vue';
import Keyboard from '@/components/maincontent/common/Keyboard.vue';
import ExitButton from '@/components/maincontent/common/ExitButton.vue';
import Products from '@/components/maincontent/common/Products.vue';
import { getModule } from 'vuex-module-decorators';
import CartModule from '@/store/modules/cart';
import { Product, ProductInContainer } from '@/entities/Product';
import Scrollable from '@/components/maincontent/common/Scrollable.vue';
import Fuse from 'fuse.js';
import PointOfSaleModule from '@/store/modules/point-of-sale';

@Component({
  components: {
    SearchBar,
    Keyboard,
    ExitButton,
    Products,
    Scrollable,
  },
})
export default class MainContentSearch extends Vue {
  private query: string = "";

  private pointOfSaleState = getModule(PointOfSaleModule);

  $refs!: {
    searchBar: SearchBar;
  }

  private cartState = getModule(CartModule);

  get filteredProducts(): ProductInContainer[] {
    return new Fuse(
      this.pointOfSaleState.allProducts,
      {
        keys: ['nameWithoutAccents', 'category.name'],
        isCaseSensitive: false,
        shouldSort: true,
        threshold: 0.2,
      },
    ).search(this.query).map((r) => r.item);
  }
  
  updateSearchFromKeyboard(value: string): void {
    this.query = value;
    this.$refs.searchBar.updateQuery(value);
  }

  updateSearchFromInput(value: string): void {
    this.query = value;
  }

  addProduct({product, amount}: {product: Product, amount: number}) {
    this.cartState.addProduct({product, amount});
  }
}
</script>
<style lang="scss" scoped>
.content-bottom {
  justify-content: center;
}

.keyboard-container {
  flex: 0 1 720px;
}

</style>