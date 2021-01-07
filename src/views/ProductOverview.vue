<template>
  <div>
    <b-row class="mx-0">
      <ProductComponent v-for="item in filteredProducts"
                        :product="item"
                        :key="item.id"
      />
    </b-row>
    <searchbar-with-keyboard
      :input.sync="query"
      :showSearchbar="searchState.searching">
    </searchbar-with-keyboard>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Product } from '@/entities/Product';
import SearchbarWithKeyboard from '@/components/SearchbarWithKeyboard.vue';
import ProductComponent from '@/components/ProductComponent.vue';

  @Component({
    components: {
      ProductComponent,
      SearchbarWithKeyboard,
    },
  })
export default class ProductOverview extends Vue {
    // Proxy for the state, compact notation
    private searchState = this.$store.state.searchState;

    private productsState = this.$store.state.productsState;

    mounted() {
      // Initialize the product overview with beer
      this.$store.commit('searchState/setFilterName', 'beer');
    }

    // What is the user searching for?
    query: string = '';

    // Show the search bar with keyboard
    searching: boolean = false;

    // Filter the products by the desired criteria
    get filteredProducts() {
      if (this.searchState.searching) {
        return this.productsState.products
          .filter(
            (product: Product) => product.name.toLowerCase().includes(this.query.toLowerCase()),
          );
      }
      // @ts-ignore
      const currentCategory = this.searchState.filterCategory;
      return this.productsState.products
        .filter((product: Product) => product.category.name === currentCategory);
    }
}
</script>

<style scoped lang="scss">
  .product-card {
    margin: 0.5rem 0;

    .product {
      background-color: $gewis-grey-light;

      > img {
        width: auto;
        height: auto;
        max-height: 5rem;
        background-color: $gewis-grey-light;
      }
    }
  }

  .product-name {
    background: $gewis-grey-accent;
  }
</style>
